import express from 'express'
const router = express.Router()

import auth from '../../middleware/auth.js'
import { arcjetMiddleware } from '../../middleware/acrjetMiddware.js'
import { register, login, logout, updateProfile , CheckUser } from '../controller/auth.controller.js'

// router.use(arcjetMiddleware)

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

router.put('/update-profile', auth, updateProfile)
router.get('/check', auth, CheckUser)
export default router

// work on arkjet