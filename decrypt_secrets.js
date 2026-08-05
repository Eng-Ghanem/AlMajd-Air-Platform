const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// The password to encrypt/decrypt the files
const password = 'AlmajdAir2026!@#';
const algorithm = 'aes-256-cbc';

try {
  const fileContent = fs.readFileSync(path.join(__dirname, 'secured_secrets.enc'), 'utf8');
  const { iv, data } = JSON.parse(fileContent);

  const key = crypto.scryptSync(password, 'salt', 32);
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  
  let decrypted = decipher.update(data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  const secrets = JSON.parse(decrypted);

  // Write them back to their locations if they don't exist or if you want to overwrite
  if (secrets.client_env) {
    fs.writeFileSync(path.join(__dirname, 'client', '.env_recovered'), secrets.client_env);
    console.log('Recovered client env to client/.env_recovered');
  }
  
  if (secrets.server_env) {
    fs.writeFileSync(path.join(__dirname, 'server', '.env_recovered'), secrets.server_env);
    console.log('Recovered server env to server/.env_recovered');
  }

  console.log('Decryption successful!');

} catch (error) {
  console.error('Error during decryption. Make sure secured_secrets.enc exists and the password is correct.', error.message);
}
