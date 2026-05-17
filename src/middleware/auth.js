import jwt from 'jsonwebtoken'
import 'dotenv/config'
import User from '../mvc/model/auth.model.js'

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.', success: false })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.id).select('-password')

        if (!user) {
            return res.status(401).json({ message: 'Invalid token.', success: false })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.', success: false })
    }
}

export default auth