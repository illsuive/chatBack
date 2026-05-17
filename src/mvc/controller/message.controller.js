import User from "../model/auth.model.js";
import Message from "../model/message.model.js";
import cloudinary from '../../utils/cloudnary.js'
import mongoose from "mongoose";
import { getReciverId, io } from '../../utils/socket.js'

export const getAllUsers = async (req, res) => {
    try {
        const { id } = req.user;
        const users = await User.find({_id : {$ne : id}}).select('-password') // find all user but not owner
        if (!users) {
            return res.status(404).json({ message: 'Users not found', success: false })
        }
        return res.status(200).json({ users, success: true  , message : `${users.length} users found    `})
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

export const getMessagesByuserid = async (req, res) => {
    try {
        const { id } = req.user;
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: id, receiverId: userId },
                { senderId: userId, receiverId: id }
            ]
        });

        if (!messages) {
            return res.status(404).json({ message: 'Messages not found', success: false });
        }

        return res.status(200).json({ messages, success: true , message : `${messages.length} messages found` , data : messages});
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id } = req.user;
        const { receiverId } = req.params;
        const { message, image } = req.body;

        if (!message && !image) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot send an empty message. Please provide text or an image." 
            });
        }

        let imageUrl = null; 
        
        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: 'messages'
            });
            imageUrl = result.secure_url;
        }

        const messagePayload = {
            senderId: id,
            receiverId,
        };
        if (message) messagePayload.message = message;
        if (imageUrl) messagePayload.image = imageUrl;

        const newMessage = new Message(messagePayload);

        await newMessage.save();
        
        const receiverSocketId = getReciverId(receiverId);
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', newMessage);
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Message sent successfully',
            data: newMessage 
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const ChatPartners = async (req, res) => {
    try {
        const { id: currentUserId } = req.user;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId },
                { receiverId: currentUserId }
            ]
        }).select("senderId receiverId"); 

        const partnerIdsSet = new Set();
        
        messages.forEach(msg => {
            if (msg.senderId.toString() !== currentUserId.toString()) {
                partnerIdsSet.add(msg.senderId.toString());
            }
            if (msg.receiverId.toString() !== currentUserId.toString()) {
                partnerIdsSet.add(msg.receiverId.toString());
            }
        });

        const partnerIds = Array.from(partnerIdsSet);

        const chatPartners = await User.find({ _id: { $in: partnerIds } })
            .select("-password"); // Exclude password for security

        return res.status(200).json({ 
            success: true, 
            data: chatPartners 
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
