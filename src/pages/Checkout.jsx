import { useState } from 'react';
import { cartAtom, isCartEmptyAtom } from "../utils/CartAtom";
import { useAtom } from "jotai";
import { UserCoursesServices } from '../services/UserCoursesServices';
import { Link, useLocation } from 'react-router-dom';

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cart, setCart] = useAtom(cartAtom);
  const [isCartEmpty] = useAtom(isCartEmptyAtom);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const from = location.state?.from?.pathname || location.state?.from || "/";

  const [formData, setFormData] = useState({
    country: '',
    state: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    paypalEmail: ""
  });

  const tax = 15.0;
  const discount = 0.0;
  const totalPrice = cart.reduce((sum, item) => sum + item.coursePrice, 0);
  const taxPrice = tax * totalPrice / 100;

  const isFormIncomplete = !formData.country || !formData.state ||
    (paymentMethod === "Credit Card" && (!formData.cardName || !formData.cardNumber || !formData.expiryDate || !formData.cvc)) ||
    (paymentMethod === "paypal" && !formData.paypalEmail);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cardNumber") {
      newValue = newValue.replace(/\D/g, "");
      newValue = newValue.slice(0, 16);
      newValue = newValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    if (name === "expiryDate") {
      newValue = newValue.replace(/[^0-9/]/g, "");

      if (!newValue.includes("/")) {
        if (newValue.length === 1 && newValue >= "2" && newValue <= "9") {
          newValue = "0" + newValue + "/";
        } else if (newValue.length === 2) {
          const month = parseInt(newValue);
          if (month < 1 || month > 12) return;
          newValue = newValue + "/";
        } else if (newValue.length > 2) {
          return;
        }
      } else {
        const parts = newValue.split("/");

        if (parts[0].length > 0) {
          const month = parseInt(parts[0]);
          if (parts[0].length === 2 && (month < 1 || month > 12)) return;
          if (parts[0].length > 2) return;
        }

        if (parts[1] && parts[1].length > 0) {
          const year = parseInt(parts[1]);
          if (parts[1].length === 2 && (year < 1 || year > 31)) return;
          if (parts[1].length > 2) return;
        }

        if (parts.length > 2) return;
      }

      newValue = newValue.slice(0, 5);
    }

    if (name === "cvc") {
      newValue = newValue.replace(/\D/g, "").slice(0, 3);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleCheckout = async () => {
    if (isCartEmpty || isFormIncomplete) return;

    const userId = 0;

    const payload = {
      UserCoursesHeaderID: 0,
      UserID: userId,
      Total: totalPrice,
      Tax: tax,
      Discount: discount,
      Payment: {
        PaymentID: 0,
        UserID: userId,
        Country: formData.country,
        State: formData.state,
        Amount: totalPrice + tax - discount,
        CreatedAt: new Date().toISOString(),
        PaymentType: paymentMethod,
        CardName: paymentMethod === "Credit Card" ? formData.cardName : null,
        CardNumber: paymentMethod === "Credit Card" ? formData.cardNumber : null,
        CVV: paymentMethod === "Credit Card" ? formData.cvc : null,
        ExpiryDate: paymentMethod === "Credit Card" ? formData.expiryDate : null,
        PaypalEmail: paymentMethod === "paypal" ? formData.paypalEmail : null
      },
      userCoursesDetails: cart.map((item) => ({
        UserCoursesDetailID: 0,
        UserCoursesHeaderID: 0,
        courseID: item.courseID,
        coursePrice: item.coursePrice
      }))
    };

    try {
      setIsSubmitting(true);
      const IsDataSuccess = await UserCoursesServices.UserCourses(payload);
      if (IsDataSuccess) {
        setCart([]);
        setIsSuccess(IsDataSuccess);
      }
    } catch (error) {
      console.error("Error fetching Data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSuccess ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 max-w-2xl w-full text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6 sm:mb-10">
              <div className="bg-green-500 rounded-full w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center shadow-lg">
                <img className='w-12 sm:w-16' src={`${process.env.PUBLIC_URL}/Assets/Icons/Sucess.png`} alt='Success' />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6">
              Purchase Complete
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12">
              You will receive a confirmation email soon!
            </p>

            {/* Button */}
            <Link
              to="/"
              className="bg-gray-900 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-base sm:text-lg w-full block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                Shopping Cart
              </h1>
              <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-1">
                <span className="font-medium">Details</span>
                <span>&gt;</span>
                <Link to="/cart" state={{ from }} className="font-medium hover:underline">
                  Shopping Cart
                </Link>
                <span>&gt;</span>
                <Link to="/checkout" state={{ from }} className="text-blue-600 font-medium hover:underline">
                  Checkout
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6">
                {/* Country and State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Enter Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      State/Union Territory
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Enter State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Payment Method
                  </h2>

                  {/* Credit/Debit Card */}
                  <div className="border border-gray-300 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <label className="flex items-center justify-between w-full cursor-pointer">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Credit Card"
                            checked={paymentMethod === "Credit Card"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
                          />
                          <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-gray-900">
                            Credit/Debit Card
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                            alt="Visa"
                            className="h-5 sm:h-6"
                          />
                        </div>
                      </label>
                    </div>

                    {paymentMethod === 'Credit Card' && (
                      <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Name of Card
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            placeholder="Name of card"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            placeholder="Card Number"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                              CVC/CVV
                            </label>
                            <input
                              type="text"
                              name="cvc"
                              placeholder="CVC"
                              value={formData.cvc}
                              onChange={handleInputChange}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PayPal */}
                  <div className="border border-gray-300 rounded-lg p-3 sm:p-4">
                    <label className="flex items-center justify-between w-full cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === "paypal"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
                        />
                        <span className="ml-2 sm:ml-3 text-sm sm:text-base font-medium text-gray-900">
                          PayPal
                        </span>
                      </div>
                      <img
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                        alt="PayPal"
                        className="h-5 sm:h-6"
                      />
                    </label>

                    {paymentMethod === "paypal" && (
                      <div className="mt-3 sm:mt-4">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          PayPal Email
                        </label>
                        <input
                          type="email"
                          name="paypalEmail"
                          placeholder="Enter your PayPal email"
                          value={formData.paypalEmail}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-8">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Order Details ({cart.length})
                  </h2>

                  {/* Order Items */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 max-h-40 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.courseID}
                        className="text-xs sm:text-sm text-gray-700 truncate"
                        title={item.courseName}
                      >
                        {item.courseName}
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code */}
                  <button className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 mb-4 sm:mb-6 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-xs sm:text-sm font-medium">APPLY COUPON CODE</span>
                  </button>

                  {/* Price Breakdown */}
                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-sm sm:text-base text-gray-700">
                      <span>Price</span>
                      <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base text-gray-700">
                      <span>Discount</span>
                      <span className="font-semibold">$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base text-gray-700">
                      <span>Tax</span>
                      <span className="font-semibold">${taxPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                    <span>Total</span>
                    <span>${(totalPrice + taxPrice).toFixed(2)}</span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCartEmpty || isFormIncomplete || isSubmitting}
                    className={`w-full py-3 sm:py-4 rounded-lg font-semibold transition-colors text-sm sm:text-base ${isCartEmpty || isFormIncomplete || isSubmitting
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                  >
                    {isSubmitting ? "Processing..." : "Proceed to Checkout"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}