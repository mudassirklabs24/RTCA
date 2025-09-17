import asyncHandler from "express-async-handler";
import userModel from "../../user/models/userModel.js";
import chatModel from "../models/chatModel.js";

export default {
  createChat: asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const { otherUserId } = req.params;
    const exisitingUser = await userModel.findById(userId);
    if (!exisitingUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const otherUser = await userModel.findById(otherUserId)
    if(!otherUser){
        return res.status(404).json({message:"Other user id is not valid", success:false})
    }
    const usersIds = []
    usersIds.push(exisitingUser?._id,otherUser?._id)
    // if(usersIds[0] === otherUser?._id){

    // }
    console.log(usersIds)
   const newChat =  await chatModel.create({
        chatName:`${otherUser?.firstName} ${otherUser?.lastName}`,
      usersIds  
    })

    return res.status(201).json({message:`Chat created with ${otherUser?.firstName} ${otherUser?.lastName}. `, chat:newChat})
  }),
};
