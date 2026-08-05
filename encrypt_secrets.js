const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// The password to encrypt/decrypt the files
const password = 'AlmajdAir2026!@#';
const algorithm = 'aes-256-cbc';

// Generate key and iv
const key = crypto.scryptSync(password, 'salt', 32);
const iv = crypto.randomBytes(16);

// Read sensitive files
let clientEnv = '';
let serverEnv = '';

try {
  clientEnv = fs.readFileSync(path.join(__dirname, 'client', '.env'), 'utf8');
} catch (e) {
  console.log('No client/.env found or error reading it.');
}

try {
  serverEnv = fs.readFileSync(path.join(__dirname, 'server', '.env'), 'utf8');
} catch (e) {
  console.log('No server/.env found or error reading it.');
}

const secrets = {
  client_env: clientEnv,
  server_env: serverEnv
};

// Encrypt
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(JSON.stringify(secrets), 'utf8', 'hex');
encrypted += cipher.final('hex');

const result = {
  iv: iv.toString('hex'),
  data: encrypted
};

// Save encrypted file
fs.writeFileSync(path.join(__dirname, 'secured_secrets.enc'), JSON.stringify(result));
console.log('Secrets successfully encrypted and saved to secured_secrets.enc');
console.log('You can safely backup secured_secrets.enc. Keep the password safe!');
