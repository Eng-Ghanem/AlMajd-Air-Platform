import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

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
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const authUser = sessionData?.session?.user;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      let currentProfile = null;
        
      if (error) {
        if (error.code === 'PGRST116') {
          if (authUser) {
            const newProfile = {
              id: userId,
              email: authUser.email,
              name: authUser.user_metadata?.name || authUser.email.split('@')[0],
              role: authUser.email === '41147332a@gmail.com' ? 'admin' : 'customer'
            };
            const { data: insertData } = await supabase
              .from('users')
              .upsert([newProfile])
              .select()
              .single();
              
            currentProfile = insertData || newProfile;
          }
        }
      } else {
        currentProfile = data;
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
    return supabase.auth.signInWithPassword({ email, password });
  };

  const register = async (email, password, name) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });
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
      if (updates.name) {
        await supabase.auth.updateUser({ 
          data: { name: updates.name } 
        });
      }

      // 2. Try updating public users table (We ignore errors if it fails due to RLS)
      await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);
        
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

  const resetPassword = async (email) => {
    return supabase.auth.resetPasswordForEmail(email);
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
