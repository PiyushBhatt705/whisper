import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";

export async function getChats(req:AuthRequest, res:Response, next:NextFunction) {
    try {
        const userId = req.userId

        const chats =await Chat.find({ participants: userId})
        .populate("participants","name email avatar")
        .populate("lastMessage")
        .sort({lastMessageAt: -1})
    } catch (error) {
        
    }
}