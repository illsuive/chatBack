import User from "../model/auth.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { WelcomeEmail } from '../../utils/mail.js'
import cloudinary from '../../utils/cloudnary.js'
import 'dotenv/config'

export const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required', success: false })
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'User already exists', success: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({ fullname, email, password: hashedPassword })
        await newUser.save()

        await WelcomeEmail(email)

        res.status(201).json({ message: 'User created successfully', success: true })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required', success: false })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials', success: false })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials', success: false })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction
        });
        
        res.status(200).json({ message: 'Logged in successfully', success: true, user: userWithoutPassword })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const logout = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

        res.cookie('token', '', {
            maxAge: 0,
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction
        });
        res.status(200).json({ message: 'Logged out successfully', success: true })
    } catch (error) {
        res.status(500).json({ message: error.message, success: false })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.user
        const { profilePic } = req.body;
        if (!profilePic) {
            return res.status(400).json({ message: 'Profile picture is required', success: false })
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: 'profile-pics',
            width: 300,
            height: 300,
            crop: 'fill'
        })

        user.publicId = uploadResponse.public_id
        user.profilePic = uploadResponse.secure_url
        await user.save()

        return res.status(200).json({
            message: 'Profile updated successfully',
            success: true,
            user: {
                profilePic: user.profilePic 
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export const CheckUser = async (req, res) => {

    if (!req.user) {
        return res.status(401).json({
            message: 'Unauthorized',
            success: false
        })
    }

    res.status(200).json({
        user: req.user,
        message: 'Authenticated',
        success: true
    })
}
