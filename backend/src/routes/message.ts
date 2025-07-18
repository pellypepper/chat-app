import  Express  from "express";
import { getMessage, sendMessage,  getUserChatsSummary,  createChat, deleteChatForEveryone, deleteMessageForEveryone, updateGroupChat} from "../controller/messageController";
import { authenticateAccessToken } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Express.Router();



router.get("/",  authenticateAccessToken,  getMessage);
router.get("/message-list",  authenticateAccessToken,  getUserChatsSummary);
router.post("/send-message", authenticateAccessToken, upload.single("image"), sendMessage);
router.put("/update-group/:chatId", authenticateAccessToken, updateGroupChat)
router.post("/create-chat",  authenticateAccessToken,  createChat);
router.delete("/delete-everyone/:chatId",  authenticateAccessToken, deleteChatForEveryone);
router.delete("/delete-user/:messageId", authenticateAccessToken, deleteMessageForEveryone);


export default router;