export default function UserLevelIndicator({ levelId, compact = false }) {
    const levelData = {
      100: { name: '100L', color: 'bg-blue-100 text-blue-800' },
      200: { name: '200L', color: 'bg-green-100 text-green-800' },
      300: { name: '300L', color: 'bg-yellow-100 text-yellow-800' },
      400: { name: '400L', color: 'bg-purple-100 text-purple-800' },
      500: { name: '500L', color: 'bg-red-100 text-red-800' },
      600: { name: 'Alumni', color: 'bg-gray-100 text-gray-800' }
    };
  
    const currentLevel = levelData[levelId] || levelData[600];
  
    return (
      <span className={`inline-flex items-center ${
        compact ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } rounded-full font-medium ${currentLevel.color}`}>
        {currentLevel.name}
      </span>
    );
  }