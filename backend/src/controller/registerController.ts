import bcrypt from 'bcrypt';
import { db } from '../util/db'; // Adjust the import path as necessary

export const Register = async (req: any, res: any) => {
   const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    } 


    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await db.insert('users').values({
            firstname,
            lastname,
            email,
            password: hashedPassword
        }).returning('*');

        if (user.length > 0) {
            return res.status(201).json({ message: 'User registered successfully', user: user[0] });
        } else {
            return res.status(500).json({ error: 'User registration failed' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}