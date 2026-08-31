import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileHeader() {
  const { user } = useAuth();

  const getLevelColor = (level) => {
    const colors = {
      100: 'bg-blue-100 text-blue-800',
      200: 'bg-green-100 text-green-800',
      300: 'bg-yellow-100 text-yellow-800',
      400: 'bg-purple-100 text-purple-800',
      500: 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-2xl font-medium text-gray-800 dark:text-white">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.first_name} {user.last_name}
          </h1>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getLevelColor(user.level)}`}>
              Level {user.level}
            </span>
            {user.is_course_rep && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Course Rep
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}