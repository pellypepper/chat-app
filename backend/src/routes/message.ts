import  Express  from "express";
import { getMessage, sendMessage, createChat, deleteChatForEveryone, deleteMessageForUser} from "../controller/messageController";
import { authenticateAccessToken } from "../middleware/auth";

const router = Express.Router();



router.get("/",  authenticateAccessToken,  getMessage);
router.post("/send-message",  authenticateAccessToken,  sendMessage);
router.post("/create-chat",  authenticateAccessToken,  createChat);
router.delete("/delete-everyone",  authenticateAccessToken, deleteChatForEveryone);
router.delete("/delete-user/:messageId", authenticateAccessToken, deleteMessageForUser);


export default router;