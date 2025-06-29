"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../middleware/auth");
var storyController_1 = require("../controller/storyController");
var upload_1 = require("../middleware/upload");
var router = express_1.default.Router();
router.post('/upload', auth_1.authenticateAccessToken, upload_1.upload.single('image'), storyController_1.uploadStory);
router.get('/friends', auth_1.authenticateAccessToken, storyController_1.getFriendsStories);
router.get('/', auth_1.authenticateAccessToken, storyController_1.getMyStories);
router.post('/view/:storyId', auth_1.authenticateAccessToken, storyController_1.markStoryViewed);
router.get('/view/:storyId', auth_1.authenticateAccessToken, storyController_1.getStoryViews);
router.delete('/:storyId', auth_1.authenticateAccessToken, storyController_1.deleteStory);
exports.default = router;
//# sourceMappingURL=story.js.map