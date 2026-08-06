const http = require('http');

http.get('http://localhost:5000/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Backend says:', data));
}).on('error', (err) => console.log('Backend not reachable:', err.message));
