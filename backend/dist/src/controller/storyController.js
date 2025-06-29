"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStory = exports.getMyStories = exports.getStoryViews = exports.markStoryViewed = exports.getFriendsStories = exports.uploadStory = void 0;
var db_1 = require("../util/db");
var schema_1 = require("../model/schema");
var drizzle_orm_1 = require("drizzle-orm");
var upload_1 = require("../middleware/upload");
var STORY_EXPIRY_HOURS = 24;
// Upload a new story
var uploadStory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, content, type, now, expiresAt, storyContent, newStory, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = Number((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
                _a = req.body, content = _a.content, type = _a.type;
                if (!userId || (!content && !req.file) || !['text', 'image'].includes(type)) {
                    res.status(400).json({ error: 'Missing or invalid fields' });
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                now = new Date();
                expiresAt = new Date(now.getTime() + STORY_EXPIRY_HOURS * 60 * 60 * 1000);
                storyContent = content;
                if (!(type === 'image')) return [3 /*break*/, 3];
                if (!req.file) {
                    res.status(400).json({ error: 'Image file is required for type image' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, upload_1.compressAndUpload)(req.file)];
            case 2:
                storyContent = _c.sent();
                _c.label = 3;
            case 3: return [4 /*yield*/, db_1.db.insert(schema_1.stories).values({
                    userId: userId,
                    content: storyContent,
                    type: type,
                    createdAt: now,
                    expiresAt: expiresAt,
                }).returning()];
            case 4:
                newStory = (_c.sent())[0];
                res.status(201).json({ story: newStory });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _c.sent();
                console.error('Upload story error:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.uploadStory = uploadStory;
// Get active stories for friends
var getFriendsStories = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, friendRecords, friendIds, now, rawStories, _i, friendIds_1, friendId, friendStories, grouped, result, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                if (!userId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                return [4 /*yield*/, db_1.db
                        .select({ friendId: schema_1.friends.friendId })
                        .from(schema_1.friends)
                        .where((0, drizzle_orm_1.eq)(schema_1.friends.userId, userId))];
            case 2:
                friendRecords = _b.sent();
                friendIds = friendRecords.map(function (f) { return f.friendId; });
                // Check if friendIds is empty
                if (friendIds.length === 0) {
                    res.status(200).json({ groupedStories: [] });
                    return [2 /*return*/];
                }
                now = new Date();
                return [4 /*yield*/, db_1.db
                        .select({
                        id: schema_1.stories.id,
                        userId: schema_1.stories.userId,
                        content: schema_1.stories.content,
                        type: schema_1.stories.type,
                        createdAt: schema_1.stories.createdAt,
                        expiresAt: schema_1.stories.expiresAt,
                        firstname: schema_1.users.firstname,
                        lastname: schema_1.users.lastname,
                        email: schema_1.users.email,
                    })
                        .from(schema_1.stories)
                        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.stories.userId, schema_1.users.id))
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_1.stories.userId, friendIds), (0, drizzle_orm_1.gt)(schema_1.stories.expiresAt, now)))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.stories.createdAt))];
            case 3:
                rawStories = _b.sent();
                _i = 0, friendIds_1 = friendIds;
                _b.label = 4;
            case 4:
                if (!(_i < friendIds_1.length)) return [3 /*break*/, 7];
                friendId = friendIds_1[_i];
                return [4 /*yield*/, db_1.db
                        .select({
                        id: schema_1.stories.id,
                        userId: schema_1.stories.userId,
                        expiresAt: schema_1.stories.expiresAt,
                        createdAt: schema_1.stories.createdAt
                    })
                        .from(schema_1.stories)
                        .where((0, drizzle_orm_1.eq)(schema_1.stories.userId, friendId))];
            case 5:
                friendStories = _b.sent();
                _b.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7:
                // Check if stories were found
                if (rawStories.length === 0) {
                    res.status(200).json({ groupedStories: [] });
                    return [2 /*return*/];
                }
                grouped = rawStories.reduce(function (acc, story) {
                    var _a, _b;
                    var key = story.userId;
                    if (!acc[key]) {
                        acc[key] = {
                            userId: story.userId,
                            firstname: story.firstname,
                            lastname: story.lastname,
                            email: story.email,
                            stories: [],
                        };
                    }
                    acc[key].stories.push({
                        id: story.id,
                        content: story.content,
                        type: story.type,
                        createdAt: (_a = story.createdAt) !== null && _a !== void 0 ? _a : new Date(0),
                        expiresAt: (_b = story.expiresAt) !== null && _b !== void 0 ? _b : new Date(0),
                    });
                    return acc;
                }, {});
                result = Object.values(grouped);
                res.status(200).json({ groupedStories: result });
                return [2 /*return*/];
            case 8:
                error_2 = _b.sent();
                res.status(500).json({ error: 'Internal server error' });
                return [2 /*return*/];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.getFriendsStories = getFriendsStories;
// Mark story as viewed by the user
var markStoryViewed = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, storyId, existing, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                storyId = Number(req.params.storyId);
                if (!userId || !storyId) {
                    res.status(400).json({ error: 'Missing user or story ID' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, db_1.db.select().from(schema_1.storyViews).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.storyViews.storyId, storyId), (0, drizzle_orm_1.eq)(schema_1.storyViews.viewerId, userId)))];
            case 2:
                existing = _b.sent();
                if (!(existing.length === 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, db_1.db.insert(schema_1.storyViews).values({
                        storyId: storyId,
                        viewerId: userId,
                        viewedAt: new Date(),
                    })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                res.status(200).json({ message: 'Story marked as viewed' });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _b.sent();
                console.error('Mark story viewed error:', error_3);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.markStoryViewed = markStoryViewed;
// Get who viewed a user's story and count
var getStoryViews = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, storyId, story, viewers, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                storyId = Number(req.params.storyId);
                if (!userId || !storyId) {
                    res.status(400).json({ error: 'Missing user or story ID' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.db.select().from(schema_1.stories).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.stories.id, storyId), (0, drizzle_orm_1.eq)(schema_1.stories.userId, userId)))];
            case 2:
                story = _b.sent();
                if (story.length === 0) {
                    res.status(403).json({ error: 'Not your story or story not found' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.db.select({
                        id: schema_1.users.id,
                        firstname: schema_1.users.firstname,
                        lastname: schema_1.users.lastname,
                        email: schema_1.users.email,
                        viewedAt: schema_1.storyViews.viewedAt,
                    })
                        .from(schema_1.storyViews)
                        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.storyViews.viewerId, schema_1.users.id))
                        .where((0, drizzle_orm_1.eq)(schema_1.storyViews.storyId, storyId))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.storyViews.viewedAt))];
            case 3:
                viewers = _b.sent();
                res.status(200).json({ viewers: viewers, count: viewers.length });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                console.error('Get story views error:', error_4);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getStoryViews = getStoryViews;
// Get current user's own active stories
var getMyStories = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, now, rawStories, grouped, error_5;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                if (!userId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return [2 /*return*/];
                }
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                now = new Date();
                return [4 /*yield*/, db_1.db
                        .select({
                        id: schema_1.stories.id,
                        content: schema_1.stories.content,
                        type: schema_1.stories.type,
                        createdAt: schema_1.stories.createdAt,
                        expiresAt: schema_1.stories.expiresAt,
                        firstname: schema_1.users.firstname,
                        lastname: schema_1.users.lastname,
                        email: schema_1.users.email,
                        userId: schema_1.users.id,
                    })
                        .from(schema_1.stories)
                        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.stories.userId, schema_1.users.id))
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.stories.userId, userId), (0, drizzle_orm_1.gt)(schema_1.stories.expiresAt, now)))
                        .orderBy((0, drizzle_orm_1.desc)(schema_1.stories.createdAt))];
            case 2:
                rawStories = _e.sent();
                grouped = {
                    userId: userId,
                    firstname: ((_b = rawStories[0]) === null || _b === void 0 ? void 0 : _b.firstname) || '',
                    lastname: ((_c = rawStories[0]) === null || _c === void 0 ? void 0 : _c.lastname) || '',
                    email: ((_d = rawStories[0]) === null || _d === void 0 ? void 0 : _d.email) || '',
                    stories: rawStories.map(function (story) {
                        var _a, _b;
                        return ({
                            id: story.id,
                            content: story.content,
                            type: story.type,
                            createdAt: (_a = story.createdAt) !== null && _a !== void 0 ? _a : new Date(0),
                            expiresAt: (_b = story.expiresAt) !== null && _b !== void 0 ? _b : new Date(0),
                        });
                    }),
                };
                console;
                res.status(200).json({ userStories: grouped });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _e.sent();
                console.error('Get my stories error:', error_5);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getMyStories = getMyStories;
// Delete a story uploaded by the user
var deleteStory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, storyId, story, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                storyId = Number(req.params.storyId);
                if (!userId || !storyId) {
                    res.status(400).json({ error: 'Missing user or story ID' });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(schema_1.stories)
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.stories.id, storyId), (0, drizzle_orm_1.eq)(schema_1.stories.userId, userId)))];
            case 2:
                story = _b.sent();
                if (story.length === 0) {
                    res.status(403).json({ error: 'Not your story or story not found' });
                    return [2 /*return*/];
                }
                //  delete all story views associated with this story
                return [4 /*yield*/, db_1.db.delete(schema_1.storyViews).where((0, drizzle_orm_1.eq)(schema_1.storyViews.storyId, storyId))];
            case 3:
                //  delete all story views associated with this story
                _b.sent();
                // Then delete the story itself
                return [4 /*yield*/, db_1.db.delete(schema_1.stories).where((0, drizzle_orm_1.eq)(schema_1.stories.id, storyId))];
            case 4:
                // Then delete the story itself
                _b.sent();
                res.status(200).json({ message: 'Story deleted successfully' });
                return [3 /*break*/, 6];
            case 5:
                error_6 = _b.sent();
                console.error('Delete story error:', error_6);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteStory = deleteStory;
//# sourceMappingURL=storyController.js.map