'use client'

const Stories = () => {
  const stories = [
    { id: 1, name: 'Your Story', avatar: '📷', isYour: true },
    { id: 2, name: 'Sarah', avatar: '👩‍🎨', hasStory: true },
    { id: 3, name: 'Mike', avatar: '👨‍💻', hasStory: true },
    { id: 4, name: 'Emma', avatar: '👩‍🔬', hasStory: true },
  ];

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Stories</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {stories.map(story => (
          <div key={story.id} className="flex-shrink-0 text-center cursor-pointer">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg mb-1 ${
              story.isYour 
                ? 'bg-gray-600 border-2 border-dashed border-gray-500' 
                : story.hasStory 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 p-0.5'
                  : 'bg-gray-600'
            }`}>
              {story.hasStory && !story.isYour ? (
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                  {story.avatar}
                </div>
              ) : (
                story.avatar
              )}
            </div>
            <p className="text-xs text-gray-400 truncate w-12">{story.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Stories
