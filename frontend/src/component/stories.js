"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const storyStore_1 = require("@/store/storyStore");
const uploadStory_1 = __importDefault(require("./uploadStory"));
const image_1 = __importDefault(require("next/image"));
const lucide_react_1 = require("lucide-react");
const Stories = () => {
    const { stories, fetchFriendStories, isUploadModalOpen, setUploadModalOpen, loading, error, markViewed, } = (0, storyStore_1.useStoryStore)();
    const [selectedUserStoryGroup, setSelectedUserStoryGroup] = (0, react_1.useState)(null);
    const [activeStoryIndex, setActiveStoryIndex] = (0, react_1.useState)(0);
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [showViewers, setShowViewers] = (0, react_1.useState)(false);
    const [currentUserId, setCurrentUserId] = (0, react_1.useState)(null);
    // Get current user ID
    (0, react_1.useEffect)(() => {
        const getCurrentUserId = () => {
            const userId = localStorage.getItem('userId');
            setCurrentUserId(userId ? Number(userId) : null);
        };
        getCurrentUserId();
    }, []);
    (0, react_1.useEffect)(() => {
        fetchFriendStories();
    }, [fetchFriendStories]);
    // Mark story as viewed when user views a friend's story (not their own)
    (0, react_1.useEffect)(() => {
        if (!selectedUserStoryGroup || currentUserId === null) {
            return;
        }
        const story = selectedUserStoryGroup.stories[activeStoryIndex];
        const isOwnStory = selectedUserStoryGroup.userId === currentUserId;
        const isFriend = stories.some(s => s.userId === selectedUserStoryGroup.userId);
        if (story && story.id && !isOwnStory && isFriend) {
            markViewed(story.id);
            console.log('Story marked as viewed 1:', story.id);
        }
        else {
        }
    }, [selectedUserStoryGroup, activeStoryIndex, markViewed, currentUserId, stories]);
    // Handle next story
    const handleNext = (0, react_1.useCallback)(() => {
        if (!selectedUserStoryGroup)
            return;
        const maxIndex = selectedUserStoryGroup.stories.length - 1;
        if (activeStoryIndex < maxIndex) {
            setActiveStoryIndex((prev) => prev + 1);
        }
        else {
            setSelectedUserStoryGroup(null);
            setActiveStoryIndex(0);
        }
    }, [selectedUserStoryGroup, activeStoryIndex]);
    // Get last story preview for a user
    function getLastStoryPreview(userStory) {
        if (!userStory.stories || userStory.stories.length === 0)
            return null;
        const lastStory = userStory.stories[userStory.stories.length - 1];
        return lastStory;
    }
    (0, react_1.useEffect)(() => {
        if (!selectedUserStoryGroup)
            return;
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + 2; // Adjust speed as needed
            });
        }, 100);
        return () => clearInterval(timer);
    }, [selectedUserStoryGroup, activeStoryIndex, handleNext]);
    // Reset progress when story changes
    (0, react_1.useEffect)(() => {
        setProgress(0);
    }, [activeStoryIndex]);
    // Handle previous story
    const handlePrev = () => {
        if (activeStoryIndex > 0) {
            setActiveStoryIndex((prev) => prev - 1);
        }
        else {
            // Go to previous user's stories if available
            setSelectedUserStoryGroup(null);
            setActiveStoryIndex(0);
        }
    };
    const handleStoryClick = (x, width) => {
        const clickPosition = x / width;
        if (clickPosition < 0.5) {
            handlePrev();
        }
        else {
            handleNext();
        }
    };
    const handleStorySelect = async (userStory) => {
        await markViewed(userStory.stories[0].id); // Mark the first story as viewed
        setSelectedUserStoryGroup(userStory);
        setActiveStoryIndex(0);
        setProgress(0);
        setShowViewers(false); // Reset viewers modal
    };
    // Check if current story belongs to the current user
    const isOwnStory = selectedUserStoryGroup && currentUserId !== null && selectedUserStoryGroup.userId === currentUserId;
    return (<div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Stories</h3>

      {loading && <p className="text-gray-400 text-sm">Loading...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-5 overflow-x-auto pb-2">
        {/* Upload Your Story */}
        <div className="flex-shrink-0 text-center cursor-pointer group" onClick={() => setUploadModalOpen(true)}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl mb-1 bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-dashed border-gray-500 group-hover:border-gray-400 transition-all duration-200">
            📷
          </div>
          <p className="text-xs text-gray-400 truncate w-20">Your Story</p>
        </div>

        {/* Friend Stories */}
      {stories?.map((userStory) => {
            const lastStory = getLastStoryPreview(userStory);
            return (<div key={`story-${userStory.userId}`} className="flex-shrink-0 text-center cursor-pointer group" onClick={() => handleStorySelect(userStory)}>
              <div className="w-20 h-20 rounded-full border-secondary border   p-0.5 mb-1 group-hover:scale-105 transition-transform duration-200 relative overflow-hidden">
                {lastStory && lastStory.type === 'image' ? (<image_1.default src={lastStory.content} alt="Preview" fill className="object-cover rounded-full"/>) : (<div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-2xl relative">
                    👤
                    {lastStory && lastStory.type === 'text' && (<span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/80 bg-black/60 px-2 rounded">
                        {lastStory.content.length > 12
                            ? lastStory.content.slice(0, 12) + '...'
                            : lastStory.content}
                      </span>)}
                  </div>)}
              </div>
              <p className="text-xs text-gray-400 truncate w-20 group-hover:text-gray-300 transition-colors">
                {userStory.firstname} {userStory.lastname}
              </p>
            </div>);
        })}
      </div>

      {/* Story Viewer Modal */}
      {selectedUserStoryGroup && (<div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto bg-black">
            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
              {selectedUserStoryGroup.stories.map((_, index) => (<div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-100 ease-linear" style={{
                    width: index < activeStoryIndex ? '100%' :
                        index === activeStoryIndex ? `${progress}%` : '0%'
                }}/>
                </div>))}
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-sm">
                    👤
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {selectedUserStoryGroup.firstname} {selectedUserStoryGroup.lastname}
                  </p>
                  <p className="text-white/70 text-xs">
                    {new Date(selectedUserStoryGroup.stories[activeStoryIndex]?.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })}
                  </p>
                </div>
              </div>
              <button className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all" onClick={() => setSelectedUserStoryGroup(null)}>
                <lucide_react_1.X size={20}/>
              </button>
            </div>

            {/* Story Content */}
            <div className="w-full h-full flex items-center justify-center cursor-pointer relative" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                handleStoryClick(x, rect.width);
            }}>
              {/* Invisible click areas for navigation */}
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full"/>
                <div className="w-1/2 h-full"/>
              </div>

              {(() => {
                const story = selectedUserStoryGroup.stories[activeStoryIndex];
                if (!story)
                    return null;
                return story.type === 'text' ? (<div className="flex items-center justify-center h-full px-8">
                    <p className="text-white text-xl text-center leading-relaxed font-medium">
                      {story.content}
                    </p>
                  </div>) : (<div className="relative w-full h-full">
                    <image_1.default src={story.content} fill alt="Story" className="object-cover" priority/>
                  </div>);
            })()}
            </div>

            {/* Bottom Actions - Only show for friend stories, not own stories */}
            {!isOwnStory && (<div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="flex items-center justify-between">
               
                  
                  <div className="flex gap-2">
                    <button onClick={handlePrev} disabled={activeStoryIndex === 0} className="text-white/80 hover:text-white disabled:text-white/30 p-2 hover:bg-white/10 rounded-full transition-all disabled:cursor-not-allowed">
                      <lucide_react_1.ChevronLeft size={20}/>
                    </button>
                  </div>
                </div>
              </div>)}
          </div>

       

   
        </div>)}

      {/* Upload Modal */}
      {isUploadModalOpen && <uploadStory_1.default />}
    </div>);
};
exports.default = Stories;
