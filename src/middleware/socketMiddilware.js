import jwt from 'jsonwebtoken';
import  User  from '../mvc/model/auth.model.js'; 
import 'dotenv/config'

export const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie
            ?.split(';')
            .find(row => row.trim().startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            return next(new Error('Authentication token missing'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Fetch the full user details out of MongoDB
        const user = await User.findById(decoded.id).select('fullname');
        if (!user) {
            return next(new Error('User entity fallback missing'));
        }

        // 4. CRITICAL: Attach properties onto the socket instance securely
        socket.userId = user._id.toString();
        socket.fullname = user.fullname; // 👈 EXPLICITLY ATTACH THIS HERE

        next();
    } catch (error) {
        next(new Error('Socket authentication pipeline dropped'));
    }
};