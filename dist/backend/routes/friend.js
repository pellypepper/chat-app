"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/friends.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const friendController_1 = require("../controller/friendController");
const router = express_1.default.Router();
//Get all users
router.get('/all', auth_1.authenticateAccessToken, friendController_1.allUsers);
// Add a friend
router.post('/add', auth_1.authenticateAccessToken, friendController_1.addFriend);
// Get list of friends
router.get('/list', auth_1.authenticateAccessToken, friendController_1.getFriends);
// Online friends
router.get('/online', auth_1.authenticateAccessToken, friendController_1.getOnlineFriends);
// Remove a friend
router.post('/remove', auth_1.authenticateAccessToken, friendController_1.removeFriend);
// Get details of a specific friend
router.get('/details/:friendId', auth_1.authenticateAccessToken, friendController_1.getFriendDetails);
// Search for friends
router.get('/search', auth_1.authenticateAccessToken, friendController_1.searchFriends);
// Get user status (online/offline)
router.get('/status/:userId', friendController_1.getUserStatus);
exports.default = router;
//# sourceMappingURL=friend.js.map