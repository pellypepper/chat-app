import express from 'express';
const app = express();
const PORT = process.env.PORT || 4000;
import registerRoutes from './src/routes/register';

import { db } from './src/util/db';

app.use(express.json());

app.use('/register', registerRoutes);



app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });