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
        <div className="min-h-screen p-10 bg-gray-50">
            <div className="">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-start h-16">
                        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                        <div className="text-sm  text-gray-500 mt-4 ml-10">
                            <Link to="/courses" state={{ from }} className=" font-medium hover:underline">
                                Courses{" "}
                            </Link>
                            &gt;{" "}
                            <span className=" font-medium">
                                Details
                            </span>{" "}
                            &gt;{" "}
                            <Link to="/cart" state={{ from }} className="text-blue-600 font-medium hover:underline">
                                Shopping Cart{""}
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    <div className="flex-1">
                        <div className="mb-6">
                            <p className="text-blue-600">
                                {cart.length} Courses in cart
                            </p>
                        </div>

                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div key={item.courseID} className="bg-white rounded-lg p-4 shadow-sm border">
                                    <div className="flex gap-4">
                                        {/* Course Image */}
                                        <div className="w-48 h-28 rounded-lg flex-shrink-0 overflow-hidden">
                                            <img
                                                src={`${API_BASE_URL}/${item.courseImagePath}`}
                                                alt={item.courseName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                                                    {item.courseName}
                                                </h3>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        ${item.coursePrice.toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-3">
                                                By {item.instructorName}
                                            </p>

                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <span className='text-yellow-500 font-semibold'>{item.courseRate}</span>
                                                    {[...Array(5)].map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`${i < item.courseRate ? "text-yellow-500" : "text-gray-300"} text-sm cursor-pointer`}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>

                                                <span className="text-gray-500 text-sm">
                                                    {item.courseHours} Total Hours. {item.lectureSum} Lectures. {item.courseLevel}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.courseID)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-80">
                        <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Price</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-semibold">$0.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-semibold">${tax.toFixed(2)}</span>
                                </div>
                                <hr />
                                <div className="flex justify-between text-lg">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                disabled={isCartEmpty}
                                onClick={handleCheckout}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors  ${!isCartEmpty
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
