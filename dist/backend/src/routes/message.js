"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controller/messageController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.get("/", auth_1.authenticateAccessToken, messageController_1.getMessage);
router.get("/message-list", auth_1.authenticateAccessToken, messageController_1.getUserChatsSummary);
router.post("/send-message", auth_1.authenticateAccessToken, upload_1.upload.single("image"), messageController_1.sendMessage);
router.put("/update-group/:chatId", auth_1.authenticateAccessToken, messageController_1.updateGroupChat);
router.post("/create-chat", auth_1.authenticateAccessToken, messageController_1.createChat);
router.delete("/delete-everyone/:chatId", auth_1.authenticateAccessToken, messageController_1.deleteChatForEveryone);
router.delete("/delete-user/:messageId", auth_1.authenticateAccessToken, messageController_1.deleteMessageForEveryone);
exports.default = router;
//# sourceMappingURL=message.js.map