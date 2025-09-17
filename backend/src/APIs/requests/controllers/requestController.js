import asyncHandler from 'express-async-handler'
import userModel from '../../user/models/userModel.js'
import requestModel from '../models/requestModel.js';


export default {
  sendRequest: asyncHandler(async (req, res) => {
    const senderId = req.user.userId; 
    const { receiverId } = req.body;
const sender = await userModel.findById(senderId)
    const receiver = await userModel.findById(receiverId);  
    if (!receiver) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const existingRequest = await requestModel.findOne({
      senderId,
      receiverId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent", success: false });
    }

    // Create the chat/friend request
    const request = await requestModel.create({ senderId, receiverId });

    // Emit real-time notification via Socket.IO
    if (req.io) {
      req.io.to(receiverId.toString()).emit("newChatRequest", {
        senderId,
        message: `${sender?.firstName} ${sender?.lastName} sent you a chat request`,
        requestId: request._id,
      });
    }

    res.status(201).json({
      message: "Request sent successfully",
      success: true,
      request,
    });
  }),
}