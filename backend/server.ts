import express from 'express';
import passport from 'passport';
import './src/config/passport'; 
import registerRoutes from './src/routes/register';
import loginRoutes from './src/routes/login';

import { db } from './src/util/db';


const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);


app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });