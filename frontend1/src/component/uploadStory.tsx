import { useState, useRef, useEffect } from 'react';
import { useStoryStore } from '@/store/storyStore';
import { X, Camera, Type, Upload, Eye, Trash2, Plus, ImageIcon } from 'lucide-react';
import Image from 'next/image';

const UploadStoryModal = () => {
  const { 
    uploadStory, 
    setUploadModalOpen, 
    myStoryGroup, 
    fetchMyStories, 
    getStoryViewers,
    loading, 
    error ,
    deleteStory 
  } = useStoryStore();
  
  const [activeTab, setActiveTab] = useState<'view' | 'upload'>('view');
  const [type, setType] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewersMap, setViewersMap] = useState<{ [storyId: number]: any[] }>({});
  const [showViewers, setShowViewers] = useState(false);
  const [activeStoryId, setActiveStoryId] = useState<number | null>(null);

  useEffect(() => {
    fetchMyStories();
  }, [fetchMyStories]);

  // Fetch all viewers on stories load
  useEffect(() => {
    const fetchViewersForAllStories = async () => {
      if (myStoryGroup && myStoryGroup.stories) {
        const viewersResults: { [storyId: number]: any[] } = {};
        await Promise.all(
          myStoryGroup.stories.map(async (story: any) => {
            const viewers = await getStoryViewers(story.id);
      
            viewersResults[story.id] = Array.isArray(viewers) ? viewers : [];
          })
        );
        setViewersMap(viewersResults);
      }
    };

    fetchViewersForAllStories();
  }, [myStoryGroup, getStoryViewers]);

  // Handle file selection
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (type === 'text' && !text.trim()) return;
    if (type === 'image' && !file) return;

    setUploading(true);
    const form = new FormData();
    form.append('type', type);
    if (type === 'text') form.append('content', text);
    if (type === 'image' && file) form.append('image', file);

    try {
      await uploadStory(form);
      setUploadModalOpen(false);
      setText('');
      setFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle delete story
  const handleDeleteStory = async(storyId: number) => {
    await deleteStory(storyId);
    // Clean up viewersMap
    setViewersMap((prev) => {
      const newMap = { ...prev };
      delete newMap[storyId];
      return newMap;
    });
    console.log('Delete story:', storyId);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const userStories = myStoryGroup?.stories || [];

  // When user clicks "Viewers"
  const handleShowViewers = async (storyId: number) => {
    // Always refetch to get up-to-date viewers
    const viewers = await getStoryViewers(storyId);
    setViewersMap((prev) => ({
      ...prev,
      [storyId]: Array.isArray(viewers) ? viewers : [],
    }));
    setActiveStoryId(storyId);
    setShowViewers(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md h-[600px] text-white relative overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">Your Stories</h2>
          <button
            onClick={() => setUploadModalOpen(false)}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${
              activeTab === 'view'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Eye size={16} className="inline mr-2" />
            View Stories
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-all ${
              activeTab === 'upload'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Plus size={16} className="inline mr-2" />
            Add Story
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'view' ? (
            /* View Stories Tab */
            <div className="h-full overflow-y-auto p-6">
              {loading ? (
                <p className="text-center text-gray-400">Loading...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : userStories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Camera size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-2">No stories yet</p>
                  <p className="text-sm text-gray-500">Share your first story with friends</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all"
                  >
                    Create Story
                  </button>
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[400px] scrollbar-thin">
                  {userStories.map((story) => (
                    <div key={story.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm">
                            👤
                          </div>
                          <div>
                            <p className="font-medium text-sm">Your Story</p>
                            <p className="text-gray-400 text-xs">{formatTimeAgo(story.createdAt)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="text-gray-400 hover:text-red-400 p-1 hover:bg-gray-700 rounded transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {story.type === 'text' ? (
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-4 mb-3">
                          <p className="text-white text-center font-medium">{story.content}</p>
                        </div>
                      ) : (
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3">
                          <Image
                            src={story.content}
                            fill
                            alt="Story"
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <button onClick={() => handleShowViewers(story.id)} className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{viewersMap[story.id]?.length ?? 0} views</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Upload Story Tab */
            <div className="h-full flex flex-col p-6">
              {/* Story Type Selector */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => {
                    setType('text');
                    setFile(null);
                    setPreviewUrl(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                    type === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Type size={18} />
                  <span className="font-medium">Text</span>
                </button>
                <button
                  onClick={() => {
                    setType('image');
                    setText('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${
                    type === 'image'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <ImageIcon size={18} />
                  <span className="font-medium">Image</span>
                </button>
              </div>

              {/* Content Input */}
              <div className="flex-1 mb-6">
                {type === 'text' ? (
                  <div className="h-full">
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full h-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Share what's on your mind..."
                      maxLength={280}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        {text.length}/280 characters
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) handleFileSelect(selectedFile);
                      }}
                      className="hidden"
                    />
                    
                    {previewUrl ? (
                      <div className="relative h-full rounded-xl overflow-hidden">
                        <Image
                          src={previewUrl}
                          fill
                          alt="Preview"
                          className="object-cover"
                        />
                        <button
                          onClick={() => {
                            setFile(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="h-full border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-800/50 transition-all"
                      >
                        <Camera size={48} className="text-gray-400 mb-4" />
                        <p className="text-gray-400 font-medium mb-2">Choose a photo</p>
                        <p className="text-sm text-gray-500 text-center">
                          Tap to select an image from your device
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                onClick={handleSubmit}
                disabled={uploading || (type === 'text' && !text.trim()) || (type === 'image' && !file)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Share Story
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Story Viewers Modal */}
        {showViewers && activeStoryId !== null && (
          <div className="absolute inset-0 bg-black/90 z-20 flex items-end">
            <div className="w-full max-w-md mx-auto bg-gray-900 rounded-t-3xl p-6 max-h-96 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">
                  Viewed by {viewersMap[activeStoryId]?.length ?? 0}
                </h3>
                <button
                  onClick={() => setShowViewers(false)}
                  className="text-white/70 hover:text-white p-1"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {(viewersMap[activeStoryId] || []).map((viewer) => (
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
                {(viewersMap[activeStoryId] || []).length === 0 && (
                  <div className="text-center text-gray-400">No viewers yet</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default UploadStoryModal;