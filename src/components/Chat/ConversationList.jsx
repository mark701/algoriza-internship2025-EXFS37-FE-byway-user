// src/components/chat/ConversationList.jsx

import UserSearch from "./UserSearch";

export default function ConversationList({ conversations, onSelectUser }) {
  const formatTime = (dateString) => {
    debugger
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
        <svg className="w-20 h-20 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-lg font-medium text-gray-700 mb-1">No conversations yet</p>
        <p className="text-sm text-center">Search for users above to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <div
          key={conv.userID}
          onClick={() => onSelectUser(conv)}
          className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b transition group"
        >
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {conv.firstName?.[0]?.toUpperCase() +conv.lastName?.[0]?.toUpperCase() || '?'}
            </div>
            {conv.isOnline && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900 truncate">
                {conv.firstName} {conv.lastName}
              </span>
              {conv.lastMessageTime && (
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {formatTime(conv.lastMessageTime)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 truncate flex-1">
                {conv.lastMessage || 'Start a conversation'}
              </p>
              {conv.unreadCount > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-semibold flex-shrink-0">
                  {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                </span>
              )}
            </div>
          </div>
          
          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      ))}
    </div>
  );
}