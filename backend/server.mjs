import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

// Explicit CJS-to-ESM interop for Convex
import convexPkg from './node_modules/convex/dist/cjs/index.js';
const { ConvexHttpClient } = convexPkg;

import convexServerPkg from './node_modules/convex/dist/cjs/server/index.js';
const { anyApi } = convexServerPkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const convex = new ConvexHttpClient(process.env.CONVEX_URL);
const api = anyApi;

// Helper: Format Response
const formatResponse = (success, message, data = null, errors = null) => ({
    success, message, data, errors, timestamp: new Date().toISOString()
});

// Helper: Generate Token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
});

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500', 'null'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { mobile, password, role } = req.body;
        console.log(`Login attempt: ${mobile} as ${role}`);
        const user = await convex.query(api.users.getUserByMobile, { mobile });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json(formatResponse(false, 'Invalid credentials'));
        }

        if (user.role !== role) {
            return res.status(401).json(formatResponse(false, 'Invalid role selected'));
        }

        const token = generateToken(user._id);
        await convex.mutation(api.users.updateLastLogin, { id: user._id });

        res.json(formatResponse(true, 'Login successful', {
            token,
            user: { id: user._id, name: user.name, mobile: user.mobile, role: user.role }
        }));
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json(formatResponse(false, 'Server error'));
    }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// Static files
app.use(express.static(path.join(__dirname, '../')));

// 404 handler
app.use((req, res) => {
    res.status(404).json(formatResponse(false, `Route ${req.method} ${req.url} not found`));
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Self-contained server (MJS interop) running on port ${PORT}`);
});