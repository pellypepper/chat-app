"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const storyController_1 = require("../controller/storyController");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.post('/upload', auth_1.authenticateAccessToken, upload_1.upload.single('image'), storyController_1.uploadStory);
router.get('/friends', auth_1.authenticateAccessToken, storyController_1.getFriendsStories);
router.get('/', auth_1.authenticateAccessToken, storyController_1.getMyStories);
router.post('/view/:storyId', auth_1.authenticateAccessToken, storyController_1.markStoryViewed); // ✅ Fixed: view makes sense for marking as viewed
router.get('/view/user/:storyId', auth_1.authenticateAccessToken, storyController_1.getStoryViews);
router.delete('/:storyId', auth_1.authenticateAccessToken, storyController_1.deleteStory);
exports.default = router;
//# sourceMappingURL=story.js.map