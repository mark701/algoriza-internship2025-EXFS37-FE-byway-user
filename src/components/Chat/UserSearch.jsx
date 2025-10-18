// src/components/chat/UserSearch.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChatService } from '../../services/ChatService';

export default function UserSearch({ onSelectUser }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async () => {
        const trimmed = searchTerm.trim();
        if (!trimmed) {
            setSearchResults([]); // Clear previous results if input is empty
            setShowSearch(false);
            return;
        }


        setIsLoading(true);
        setShowSearch(true);
        setSearchResults([]); // Clear previous results immediately

        try {
            const data = await ChatService.searchUsers(searchTerm);
            if (data && Array.isArray(data) && data.length > 0) {
                setSearchResults(data);
            } else {
                setSearchResults([]); // ensures "No users found" appears
            }


        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectUser = (user) => {
        onSelectUser(user);
        setShowSearch(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <div className="relative mb-4" ref={searchRef}>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <svg
                        className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search users to chat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isLoading || !searchTerm.trim()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Searching...</span>
                        </>
                    ) : (
                        'Search'
                    )}
                </button>
            </div>

            {/* Search Results Dropdown */}
            {showSearch && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
                    {searchResults.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="font-medium">No users found</p>
                            <p className="text-sm">Try searching with a different name or email</p>
                        </div>
                    ) : (
                        searchResults.map((user) => (
                            <div
                                key={user.userID}
                                onClick={() => handleSelectUser(user)}
                                className="flex items-center gap-3 p-4 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                                    {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate">{user.userEmail}</div>
                                </div>
                                <div className="flex items-center gap-1 text-blue-500 text-sm font-medium">
                                    <span>Chat</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}