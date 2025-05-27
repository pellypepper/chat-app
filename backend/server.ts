import express from 'express';
const app = express();
const PORT = process.env.PORT || 4000;

import { db } from './src/util/db';

app.use(express.json());




app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });