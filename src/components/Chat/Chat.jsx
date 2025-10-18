// src/components/Chat.jsx
import { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { authAtom } from '../../utils/authAtom';
import { ChatService } from '../../services/ChatService';
import { signalRService } from '../../services/SignalRService';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import UserSearch from './UserSearch';

export default function Chat() {
  const [token] = useAtom(authAtom);
  const [isConnected, setIsConnected] = useState(false);

  // UI State
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatRef = useRef(null);

  // Initialize SignalR Connection
  useEffect(() => {
    debugger
    if (!token) return;

    const initializeConnection = async () => {
      try {
        await signalRService.startConnection(token);
        setIsConnected(true);
        setupSignalRListeners();
      } catch (err) {
        console.error('Failed to connect to chat:', err);
      }
    };


    initializeConnection();

    return () => {
      signalRService.stopConnection();
    };
  }, [token]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      // if chat is open and the click was outside the chat box
      if (isChatOpen && chatRef.current && !chatRef.current.contains(event.target)) {
        setIsChatOpen(false);
        setSelectedUser(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isChatOpen]);




  // Setup SignalR event listeners
  const setupSignalRListeners = () => {
    // Receive new message
    signalRService.on('ReceiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
      if (message.senderID !== selectedUser?.userID) {
        loadConversations();
        setUnreadCount(prev => prev + 1);
      }
    });

    // Message sent confirmation
    signalRService.on('MessageSent', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // User came online
    signalRService.on('UserOnline', (userId) => {
      setOnlineUsers(prev => [...new Set([...prev, userId])]);
      setConversations(prev => prev.map(conv =>
        conv.userID === userId ? { ...conv, isOnline: true } : conv
      ));
    });

    // User went offline
    signalRService.on('UserOffline', (userId) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
      setConversations(prev => prev.map(conv =>
        conv.userID === userId ? { ...conv, isOnline: false } : conv
      ));
    });

    // Online users list
    signalRService.on('OnlineUsers', (users) => {
      setOnlineUsers(users.map(u => u.userID));
    });

    // Typing indicator
    signalRService.on('UserTyping', (userId) => {
      if (selectedUser?.userID === userId) {
        setIsTyping(true);
      }
    });

    // Stop typing
    signalRService.on('UserStoppedTyping', (userId) => {
      if (selectedUser?.userID === userId) {
        setIsTyping(false);
      }
    });

    // Messages read
    signalRService.on('MessagesRead', (userId) => {
      setMessages(prev => prev.map(msg =>
        msg.receiverID === userId ? { ...msg, isRead: true } : msg
      ));
    });

    // Error handling
    signalRService.on('Error', (error) => {
      console.error('SignalR Error:', error);
    });

    // Connection status
    signalRService.on('connected', () => setIsConnected(true));
    signalRService.on('reconnecting', () => setIsConnected(false));
    signalRService.on('reconnected', () => {
      setIsConnected(true);
      loadConversations();
    });
    signalRService.on('disconnected', () => setIsConnected(false));
  };

  // Load conversations on connect
  useEffect(() => {
    if (isConnected) {
      loadConversations();
      loadUnreadCount();
    }
  }, [isConnected]);

  const loadConversations = async () => {
    try {
      const data = await ChatService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const data = await ChatService.getUnreadCount();
      setUnreadCount(data.count);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  const selectUserToChat = async (user) => {
    debugger

    setSelectedUser(user);
    setIsChatOpen(true);

    try {
      const chatHistory = await ChatService.getChatHistory(user.userID);
      setMessages(chatHistory);

      if (isConnected) {
        await signalRService.markAsRead(user.userID);
      }

      loadConversations();
      loadUnreadCount();
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  };

  const handleBackToConversations = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  if (!token) {
    return (
      <div className="p-4 text-center text-gray-500">
        Please login to use chat
      </div>
    );
  }

  return (
    <div className="relative">
      {/* User Search Component */}

      {/* Chat Button with Unread Badge */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all hover:scale-110 flex items-center justify-center z-40"
        aria-label="Open chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isChatOpen && (

        <div
          ref={chatRef}
          className="fixed bottom-4 right-4 w-[95vw] max-w-md h-[80vh] max-h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-40 animate-slideUp md:bottom-24 md:right-6 md:w-96"
        >
          {/* Header */}
          <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex items-center justify-between">
            <h3 className="font-semibold text-lg truncate">
              {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Messages'}
            </h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-gray-200 transition flex-shrink-0 ml-2"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!selectedUser ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Search users directly inside chat window */}
              <div className="p-3 border-b bg-gray-50">
                <UserSearch onSelectUser={selectUserToChat} />
              </div>

              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto">
                <ConversationList
                  conversations={conversations}
                  onSelectUser={selectUserToChat}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col">
              <ChatWindow
                selectedUser={selectedUser}
                messages={messages}
                isTyping={isTyping}
                isConnected={isConnected}
                onBack={handleBackToConversations}
                onSendMessage={(text) => {
                  return signalRService.sendMessage({
                    receiverID: selectedUser.userID,
                    messageText: text
                  });
                }}
                onTyping={() => signalRService.typing(selectedUser.userID)}
                onStopTyping={() => signalRService.stopTyping(selectedUser.userID)}
              />
            </div>
          )}
        </div>
      )}

      {/* Connection Status Indicator */}
      {!isConnected && token && (
        <div className="fixed  bottom-4 right-24 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-700"></div>
          <span>Connecting to chat...</span>
        </div>
      )}
    </div>
  );
}