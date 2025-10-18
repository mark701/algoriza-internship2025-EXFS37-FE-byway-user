// src/components/chat/ChatWindow.jsx
import { useState, useRef, useEffect } from 'react';

export default function ChatWindow({
  selectedUser,
  messages,
  isTyping,
  isConnected,
  onBack,
  onSendMessage,
  onTyping,
  onStopTyping
}) {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Additional scroll management for zoom scenarios
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      const hasOverflow = container.scrollHeight > container.clientHeight;
      if (hasOverflow && messages.length > 0) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }
    }
  }, [messages, isTyping]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    onTyping();

    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending || !isConnected) return;

    setIsSending(true);
    try {
      await onSendMessage(messageText.trim());
      setMessageText('');
      onStopTyping();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full"> {/* Added h-full to root container */}
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 p-3 text-gray-600 hover:bg-gray-50 border-b transition flex-shrink-0" // Added flex-shrink-0
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back to conversations</span>
      </button>

      {/* Messages Area - Updated with better scrolling */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0" // Added min-h-0 for flexbox scrolling
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 min-h-[200px]"> {/* Added min-height */}
            <svg className="w-16 h-16 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="font-medium">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSender = msg.senderID !== selectedUser.userID;
            return (
              <div key={msg.messageID} className={`flex ${isSender ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`max-w-[75%] ${isSender ? 'bg-blue-500 text-white' : 'bg-white text-gray-900'} rounded-lg p-3 shadow-sm`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.messageText}</p>
                  <div className={`text-xs mt-1 ${isSender ? 'text-blue-100' : 'text-gray-500'} flex items-center justify-end gap-1`}>
                    <span>{formatTime(msg.sentDateTime)}</span>
                    {isSender && (
                      msg.isRead ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          <path d="M12.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-1-1a1 1 0 011.414-1.414l.293.293 7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t bg-white rounded-b-lg flex-shrink-0"> {/* Added flex-shrink-0 */}
        {!isConnected && (
          <div className="mb-2 text-xs text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Reconnecting...</span>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={!isConnected || isSending}
            rows="1"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || !isConnected || isSending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center"
            aria-label="Send message"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}