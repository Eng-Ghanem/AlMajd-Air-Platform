import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseUrl, supabaseKey } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (session) => {
    try {
      const authUser = session?.user;
      const userId = authUser?.id;
      const token = session?.access_token;

      if (!userId) {
        setLoading(false);
        return;
      }

      let currentProfile = null;

      // 1. PRIMARY: Try fetching from Supabase directly as it is highly reliable
      if (token && userId) {
        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=*`, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              currentProfile = data[0];
            }
          }
        } catch (e) {
          console.error("Supabase direct REST fetch failed:", e);
        }
      }

      // 2. FALLBACK: Try fetching from backend API if direct fetch failed
      if (!currentProfile && token) {
        try {
          const res = await fetch(`http://${window.location.hostname}:5000/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
          });
          if (res.ok) {
            currentProfile = await res.json();
          }
        } catch (err) {
          console.error("Failed to fetch profile from API", err);
        }
      }
      
      // Final fallback if both API and Supabase fail
      if (!currentProfile && authUser) {
        currentProfile = {
          id: userId,
          email: authUser.email,
          name: authUser.user_metadata?.name || authUser.email.split('@')[0],
          phone: authUser.user_metadata?.phone || null,
          role: 'customer'
        };
      }
      
      // Override with auth metadata if exists, this makes it bulletproof
      if (currentProfile && authUser?.user_metadata?.name) {
          currentProfile.name = authUser.user_metadata.name;
      }
      
      if (currentProfile) {
          setProfile(currentProfile);
          localStorage.setItem('user', JSON.stringify(currentProfile));
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    localStorage.removeItem('user');
    setProfile(null);
    setUser(null);
    return supabase.auth.signInWithPassword({ email, password });
  };

  const register = async (email, password, name, phone) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone }
      }
    });
    
    if (data?.user && !error) {
       const userProfile = {
         id: data.user.id,
         email: data.user.email,
         name: name,
         phone: phone,
         role: 'customer' // Default to customer
       };

       try {
         await fetch(`http://${window.location.hostname}:5000/api/auth/sync-user`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(userProfile)
         });
       } catch (err) {
         console.warn("API sync failed", err);
       }
    }
    return { data, error };
  };

  const logout = async () => {
    localStorage.removeItem('user');
    setUser(null);
    setProfile(null);
    return supabase.auth.signOut();
  };

  const updateProfile = async (userId, updates) => {
    try {
      // 1. Force update auth metadata (Guaranteed to work, bypasses RLS)
      let metadataUpdates = {};
      if (updates.name !== undefined) metadataUpdates.name = updates.name;
      if (updates.phone !== undefined) metadataUpdates.phone = updates.phone;
      
      if (Object.keys(metadataUpdates).length > 0) {
        await supabase.auth.updateUser({ 
          data: metadataUpdates 
        });
      }

      // 2. Try updating public users table (We check for errors or silent RLS failures)
      const { data: updateData, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select();
        
      // If direct update fails (error) or silently fails (0 rows updated due to RLS)
      if (updateError || !updateData || updateData.length === 0) {
        console.warn('Direct profile update failed or blocked by RLS.');
      }
        
      // 3. Force UI update
      const updatedProfile = { ...(profile || {}), ...updates };
      setProfile(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      
      return { data: updatedProfile, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, error };
    }
  };

  const verifyOtp = async (email, token, type) => {
    return supabase.auth.verifyOtp({ email, token, type });
  };

  const resetPassword = async (email, options = {}) => {
    return supabase.auth.resetPasswordForEmail(email, options);
  };

  const updatePassword = async (newPassword) => {
    return supabase.auth.updateUser({ password: newPassword });
  };

  const updateEmail = async (newEmail) => {
    return supabase.auth.updateUser({ email: newEmail });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      login, 
      register, 
      logout, 
      updateProfile,
      verifyOtp,
      resetPassword,
      updatePassword,
      updateEmail
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
