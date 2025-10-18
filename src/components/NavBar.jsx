import React, { useEffect, useState, useRef } from 'react';
import { authAtom } from '../utils/authAtom';
import { cartAtom } from '../utils/CartAtom';
import { useAtom } from "jotai";
import { isTokenExpired } from '../utils/TokenExpire';
import { UserServices } from '../services/UserServices';
import { API_BASE_URL } from '../utils/ApiUrl';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CourseServices } from '../services/CourseServices';
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [token, setToken] = useAtom(authAtom);
    const [cart, setCart] = useAtom(cartAtom);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);


    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartRef = useRef(null);

    useEffect(() => {
        if (token && isTokenExpired(token)) {
            setToken(null);
            navigate("/login", { replace: true });
        }
    }, [token, setToken, navigate]);



    useEffect(() => {
        const handleTokenExpired = () => {
            setToken(null);
        };

        window.addEventListener('auth-token-expired', handleTokenExpired);

        return () => {
            window.removeEventListener('auth-token-expired', handleTokenExpired);
        };
    }, [setToken]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (token && isTokenExpired(token)) {
                setToken(null);
                navigate("/login", { replace: true });
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [token, setToken, navigate]);

    // Close cart dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // For Chat Comoponet
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const removeFromCart = (courseId) => {

        const updatedCart = cart.filter(course => course.courseID !== courseId);

        setCart(updatedCart);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, course) => total + course.coursePrice, 0).toFixed(2);
    };

    const getTotalItems = () => {
        return cart.length;
    };

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
            const response = await CourseServices.GetPagesUser(trimmed);

            // ✅ Handle cases where API returns null or undefined
            if (response && Array.isArray(response) && response.length > 0) {
                setSearchResults(response);
            } else {
                setSearchResults([]); // ensures "No users found" appears
            }
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    const handleSelectUser = (user) => {
        //   onSelectUser(user); 
        setShowSearch(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm relative">
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                    <Link
                        to="/"
                        state={{ from }}
                        className="flex items-center justify-between w-full"
                    >
                        <img src={`${process.env.PUBLIC_URL}/Assets/Icons/logo.png`} alt="Logo" className="w-6 h-6" />
                        <span className="font-semibold text-lg text-gray-800">Byway</span>
                    </Link>
                </div>
            </div>

            <div className="flex-1  z-10 max-w-4xl mx-8 flex items-center">
                <div className="relative flex-1" ref={searchRef}>
                    <div>
                        <div >
                            <img src={`${process.env.PUBLIC_URL}/Assets/Icons/search.png`} alt="Search" className="w-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search For Courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"


                            />

                        </div>
                    </div>
                    {showSearch && (
                        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
                            {searchResults.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-12 h-12 mx-auto mb-2 text-blue-500"
                                    >
                                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                                        <path d="M20 22H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2H20v20z" />
                                    </svg>

                                    <p className="font-medium">No Course found</p>
                                    <p className="text-sm">Try searching with a different name or Description</p>
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
                <div className="ml-4  text-gray-600 hover:text-gray-800">
                    <Link
                        to="/courses"
                        state={{ from }}
                        className="text-blue-600  font-medium hover:underline"
                    >
                        Courses
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {token ? (
                    <>
                        {/* Cart Dropdown */}
                        <div className="relative z-20" ref={cartRef}>
                            <button
                                onClick={() => setIsCartOpen(!isCartOpen)}
                                className="relative hover:opacity-80 transition-opacity"
                            >
                                <img src={`${process.env.PUBLIC_URL}/Assets/Icons/Cart.png`} alt='Cart' className="w-6 h-6" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </button>

                            {/* Cart Dropdown Menu */}
                            {isCartOpen && (
                                <div className="absolute  right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Shopping Cart</h3>
                                            <span className="text-sm text-gray-500">
                                                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                                            </span>
                                        </div>

                                        {cart.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500 mb-4">Your cart is empty</p>
                                                <Link
                                                    to="/courses"
                                                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                                    onClick={() => setIsCartOpen(false)}
                                                >
                                                    Browse Courses
                                                </Link>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="max-h-64 overflow-y-auto mb-4">
                                                    {cart.map((course) => (
                                                        <div key={course.courseID} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                                                            <img
                                                                src={`${API_BASE_URL}${course.courseImagePath}`}
                                                                alt={course.courseName}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                    {course.courseName}
                                                                </h4>
                                                                <p className="text-xs text-gray-500">
                                                                    {course.instructorName} • {course.courseLevel}
                                                                </p>
                                                                <p className="text-sm font-semibold text-blue-600">
                                                                    ${course.coursePrice}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFromCart(course.courseID)}
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                                title="Remove from cart"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="border-t border-gray-200 pt-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-lg font-semibold text-gray-900">Total Before Tax:</span>
                                                        <span className="text-lg font-bold text-blue-600">${getTotalPrice()}</span>
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <Link
                                                            to="/cart"
                                                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-center font-medium"
                                                            onClick={() => setIsCartOpen(false)}
                                                        >
                                                            View Cart
                                                        </Link>
                                                        <Link
                                                            to="/checkout"
                                                            onClick={() => setIsCartOpen(false)}

                                                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600 transition font-medium">
                                                            Checkout
                                                        </Link>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setToken(null)}
                            className=" z-20 px-3 py-1 text-sm text-white rounded-lg hover:bg-red-600 transition"
                        >
                            <img src={`${process.env.PUBLIC_URL}/Assets/Icons/Logoout.png`} alt='Logout' />
                        </button>

                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm">
                            U
                        </div>
                    </>
                ) : (
                    <>
                        {location.pathname !== "/login" && (
                            <Link
                                to="/login"
                                state={{ from }}
                                className="px-3 py-1 z-10 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Login
                            </Link>
                        )}
                        {location.pathname !== "/register" && (
                            <Link
                                to="/register"
                                state={{ from }}
                                className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                            >
                                Register
                            </Link>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;