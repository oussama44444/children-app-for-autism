export default function StoryList({ stories, onEdit, onDelete, onView }) {
  if (stories.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-gray-500 text-base sm:text-lg">
          No stories found. Create your first story!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {stories.map((story) => (
        <div 
          key={story._id} 
          className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
        >
          {/* Story Image with View Button */}
          <div className="relative group">
            <img
              src={story.image}
              alt={typeof story.title === 'string' ? story.title : story.title?.fr || 'Story image'}
              className="w-full h-32 sm:h-36 lg:h-40 xl:h-44 object-cover"
            />
            {/* View Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                onClick={() => onView(story)}
                className="bg-white text-gray-800 py-2 px-4 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                View Story
              </button>
            </div>
          </div>
          
          <div className="p-3 sm:p-4">
            {/* Story Title */}
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
              {typeof story.title === 'string' 
                ? story.title 
                : story.title?.fr || 'Untitled Story'
              }
            </h3>
            
            {/* Available Languages */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
              {story.availableLanguages?.includes('fr') && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">🇫🇷 FR</span>
              )}
              {story.availableLanguages?.includes('tn') && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">🇹🇳 TN</span>
              )}
            </div>
            
            {/* Story Stats */}
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              {story.stages?.length || 0} stages • {story.stages?.reduce((acc, stage) => acc + (stage.segments?.length || 0), 0) || 0} segments
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2">
              <button
                onClick={() => onEdit(story)}
                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600 text-xs sm:text-sm transition-colors duration-200 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(story._id)}
                className="flex-1 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 text-xs sm:text-sm transition-colors duration-200 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}