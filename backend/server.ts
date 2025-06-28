import express from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

console.log('🚀 Starting minimal server...');
console.log('📍 PORT:', PORT);
console.log('📍 NODE_ENV:', process.env.NODE_ENV);

app.use(express.json());

app.get('/health', (req, res) => {
  console.log('🏥 Health check');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Minimal server is running!'
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Fly.io!' });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`✅ Server listening on 0.0.0.0:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});