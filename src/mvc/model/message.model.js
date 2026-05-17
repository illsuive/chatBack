import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiverId : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    message : {type : String ,default : ''},
    // isRead : {type : Boolean , default : false},
    // isDeleted : {type : Boolean , default : false},
    // isEdited : {type : Boolean , default : false},
    // editedMessage : {type : String , default : ''},
    // editedTimestamp : {type : Date , default : null},
    image : {type : String , default : ''},
    publicId : {type : String , default : ''}

}, {timestamps: true})

const Message = mongoose.model('Message' , messageSchema)

export default Message;