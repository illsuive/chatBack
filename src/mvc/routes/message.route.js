import express from 'express'
const router = express.Router()

import auth from '../../middleware/auth.js'
import {arcjetMiddleware} from '../../middleware/acrjetMiddware.js'
import  { getAllUsers  , getMessagesByuserid , sendMessage  , ChatPartners } from '../controller/message.controller.js'

// router.use(arcjetMiddleware, auth) 

router.use(auth)

router.get('/users' , getAllUsers)
router.get('/chat-partners' , ChatPartners)

router.get('/:userId' , getMessagesByuserid)
router.post('/send-message/:receiverId' , sendMessage)

export default router