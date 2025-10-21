import React from 'react';
import { cartAtom, isCartEmptyAtom } from "../utils/CartAtom";
import { useAtom } from "jotai";
import { API_BASE_URL } from '../utils/ApiUrl';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function ShoppingCart() {
    const [cart, setCart] = useAtom(cartAtom);
    const [isCartEmpty] = useAtom(isCartEmptyAtom);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || location.state?.from || "/";

    const removeItem = (id) => {
        setCart(cart.filter(item => item.courseID !== id));
    };
    
    const handleCheckout = () => {
        if (!isCartEmpty) {
            navigate("/checkout", { state: { from: location, } });
        }
    };

    const subtotal = cart.reduce((sum, item) => sum + item.coursePrice, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                        Shopping Cart
                    </h1>
                    <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-1">
                        <Link to="/courses" state={{ from }} className="font-medium hover:underline">
                            Courses
                        </Link>
                        <span>&gt;</span>
                        <span className="font-medium">Details</span>
                        <span>&gt;</span>
                        <Link to="/cart" state={{ from }} className="text-blue-600 font-medium hover:underline">
                            Shopping Cart
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Cart Items */}
                    <div className="flex-1">
                        <div className="mb-4 sm:mb-6">
                            <p className="text-sm sm:text-base text-blue-600">
                                {cart.length} Course{cart.length !== 1 ? 's' : ''} in cart
                            </p>
                        </div>

                        {cart.length === 0 ? (
                            <div className="bg-white rounded-lg p-8 sm:p-12 shadow-sm border text-center">
                                <div className="text-gray-400 mb-4">
                                    <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                                <p className="text-sm sm:text-base text-gray-600 mb-6">Add some courses to get started!</p>
                                <Link
                                    to="/courses"
                                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Browse Courses
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4 sm:space-y-6">
                                {cart.map((item) => (
                                    <div key={item.courseID} className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border">
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                            {/* Course Image */}
                                            <div className="w-full sm:w-48 h-40 sm:h-28 rounded-lg flex-shrink-0 overflow-hidden">
                                                <img
                                                    src={`${API_BASE_URL}/${item.courseImagePath}`}
                                                    alt={item.courseName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                                                        {item.courseName}
                                                    </h3>
                                                    <div className="text-xl sm:text-2xl font-bold text-gray-900 sm:text-right">
                                                        ${item.coursePrice.toFixed(2)}
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                                                    By {item.instructorName}
                                                </p>

                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <span className='text-yellow-500 font-semibold text-sm'>{item.courseRate}</span>
                                                        {[...Array(5)].map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className={`${i < item.courseRate ? "text-yellow-500" : "text-gray-300"} text-sm`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <span className="text-gray-500 text-xs sm:text-sm">
                                                        {item.courseHours} Total Hours • {item.lectureSum} Lectures • {item.courseLevel}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.courseID)}
                                                    className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-80 xl:w-96">
                        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border lg:sticky lg:top-8">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                                Order Details
                            </h2>

                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-gray-600">Price</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-semibold">$0.00</span>
                                </div>
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-semibold">${tax.toFixed(2)}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between text-base sm:text-lg">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <button
                                disabled={isCartEmpty}
                                onClick={handleCheckout}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${!isCartEmpty
                                    ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}