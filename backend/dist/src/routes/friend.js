"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/friends.ts
var express_1 = require("express");
var auth_1 = require("../middleware/auth");
var friendController_1 = require("../controller/friendController");
var router = express_1.default.Router();
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