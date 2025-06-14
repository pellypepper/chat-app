'use client';

import { useEffect, useState , useCallback} from 'react';
import { useStoryStore } from '@/store/storyStore';
import UploadStoryModal from './uploadStory';
import Image from 'next/image';
import { Eye, X, ChevronLeft } from 'lucide-react';

const Stories = () => {
  const {
    stories,
    viewers,
    fetchFriendStories,
    isUploadModalOpen,
    setUploadModalOpen,
    getStoryViewers,
    loading,
    error,
    markViewed, 
  } = useStoryStore();

  const [selectedUserStoryGroup, setSelectedUserStoryGroup] = useState<typeof stories[0] | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Get current user ID
  useEffect(() => {
    const getCurrentUserId = () => {
      const userId = localStorage.getItem('userId');

      setCurrentUserId(userId ? Number(userId) : null);
    };
    getCurrentUserId();
  }, []);

  useEffect(() => {
    fetchFriendStories();
  }, [fetchFriendStories]);

  // Mark story as viewed when user views a friend's story (not their own)
  useEffect(() => {
    if (!selectedUserStoryGroup || currentUserId === null) {
    
      return;
    }

    const story = selectedUserStoryGroup.stories[activeStoryIndex];
    const isOwnStory = selectedUserStoryGroup.userId === currentUserId;
    const isFriend = stories.some(s => s.userId === selectedUserStoryGroup.userId);

   

    // Only mark as viewed if:
    // 1. It's a valid story with an ID
    // 2. It's NOT the current user's own story
    // 3. It's a friend's story
    if (story && story.id && !isOwnStory && isFriend) {
 
      markViewed(story.id);
    } else {

    }
  }, [selectedUserStoryGroup, activeStoryIndex, markViewed, currentUserId, stories]);

  const handleNext = useCallback(() => {
    if (!selectedUserStoryGroup) return;
    const maxIndex = selectedUserStoryGroup.stories.length - 1;
    if (activeStoryIndex < maxIndex) {
      setActiveStoryIndex((prev) => prev + 1);
    } else {
      setSelectedUserStoryGroup(null);
      setActiveStoryIndex(0);
    }
  }, [selectedUserStoryGroup, activeStoryIndex]);

  useEffect(() => {
    if (!selectedUserStoryGroup) return;

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
  useEffect(() => {
    setProgress(0);
  }, [activeStoryIndex]);

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((prev) => prev - 1);
    } else {
      // Go to previous user's stories if available
      setSelectedUserStoryGroup(null);
      setActiveStoryIndex(0);
    }
  };

  const handleStoryClick = (x: number, width: number) => {
    const clickPosition = x / width;
    if (clickPosition < 0.5) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const handleStorySelect = (userStory: typeof stories[0]) => {

    setSelectedUserStoryGroup(userStory);
    setActiveStoryIndex(0);
    setProgress(0);
    setShowViewers(false); // Reset viewers modal
  };

  const handleViewersToggle = () => {
    const isOwnStory = selectedUserStoryGroup && currentUserId !== null && selectedUserStoryGroup.userId === currentUserId;
    
   
    // Only show viewers if it's not the current user's story
    if (selectedUserStoryGroup && !isOwnStory) {
      const currentStory = selectedUserStoryGroup.stories[activeStoryIndex];
      if (currentStory && currentStory.id) {
        // Fetch viewers when the eye button is clicked
       
        getStoryViewers(currentStory.id);
        setShowViewers(!showViewers);
      }
    } else {
     
    }
  };

  // Check if current story belongs to the current user
  const isOwnStory = selectedUserStoryGroup && currentUserId !== null && selectedUserStoryGroup.userId === currentUserId;



  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Stories</h3>

      {loading && <p className="text-gray-400 text-sm">Loading...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-5 overflow-x-auto pb-2">
        {/* Upload Your Story */}
        <div
          className="flex-shrink-0 text-center cursor-pointer group"
          onClick={() => setUploadModalOpen(true)}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl mb-1 bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-dashed border-gray-500 group-hover:border-gray-400 transition-all duration-200">
            📷
          </div>
          <p className="text-xs text-gray-400 truncate w-20">Your Story</p>
        </div>

        {/* Friend Stories */}
        {stories?.map((userStory) => (
          <div
            key={`story-${userStory.userId}`}
            className="flex-shrink-0 text-center cursor-pointer group"
            onClick={() => handleStorySelect(userStory)}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5 mb-1 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-2xl">
                👤
              </div>
            </div>
            <p className="text-xs text-gray-400 truncate w-20 group-hover:text-gray-300 transition-colors">
              {userStory.firstname} {userStory.lastname}
            </p>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {selectedUserStoryGroup && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto bg-black">
            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
              {selectedUserStoryGroup.stories.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                    style={{
                      width: index < activeStoryIndex ? '100%' : 
                             index === activeStoryIndex ? `${progress}%` : '0%'
                    }}
                  />
                </div>
              ))}
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
              <button
                className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all"
                onClick={() => setSelectedUserStoryGroup(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Story Content */}
            <div 
              className="w-full h-full flex items-center justify-center cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                handleStoryClick(x, rect.width);
              }}
            >
              {/* Invisible click areas for navigation */}
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full" />
                <div className="w-1/2 h-full" />
              </div>

              {(() => {
                const story = selectedUserStoryGroup.stories[activeStoryIndex];
                if (!story) return null;

                return story.type === 'text' ? (
                  <div className="flex items-center justify-center h-full px-8">
                    <p className="text-white text-xl text-center leading-relaxed font-medium">
                      {story.content}
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={story.content}
                      fill
                      alt="Story"
                      className="object-cover"
                      priority
                    />
                  </div>
                );
              })()}
            </div>

            {/* Bottom Actions - Only show for friend stories, not own stories */}
            {!isOwnStory && (
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleViewersToggle}
                    className="flex items-center gap-2 text-white/80 hover:text-white px-3 py-2 rounded-full hover:bg-white/10 transition-all"
                  >
                    <Eye size={16} />
                    <span className="text-sm">{viewers?.length || 0}</span>
                  </button>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={activeStoryIndex === 0}
                      className="text-white/80 hover:text-white disabled:text-white/30 p-2 hover:bg-white/10 rounded-full transition-all disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Story Viewers Modal - Only show for friend stories */}
          {showViewers && !isOwnStory && viewers && viewers.length > 0 && (
            <div className="absolute inset-0 bg-black/90 z-20 flex items-end">
              <div className="w-full max-w-md mx-auto bg-gray-900 rounded-t-3xl p-6 max-h-96 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Viewed by {viewers.length}</h3>
                  <button
                    onClick={() => setShowViewers(false)}
                    className="text-white/70 hover:text-white p-1"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {viewers.map((viewer) => (
                    <div key={viewer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg">
                          {viewer.firstname?.[0]?.toUpperCase()}{viewer.lastname?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{viewer.firstname} {viewer.lastname}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(viewer.viewedAt).toLocaleString([], { 
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Debug Panel - Remove this in production */}
          <div className="absolute top-20 right-4 bg-red-900/80 text-white p-2 text-xs rounded max-w-xs">
            <p>Debug Info:</p>
            <p>isOwnStory: {isOwnStory ? 'true' : 'false'}</p>
            <p>showViewers: {showViewers ? 'true' : 'false'}</p>
            <p>viewers: {viewers?.length || 'null/undefined'}</p>
            <p>currentUserId: {currentUserId}</p>
            <p>storyUserId: {selectedUserStoryGroup?.userId}</p>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && <UploadStoryModal />}
    </div>
  );
};

export default Stories;