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
  const taxPrice = tax * totalPrice / 100
  const isFormIncomplete = !formData.country || !formData.state ||
    (paymentMethod === "Credit Card" && (!formData.cardName || !formData.cardNumber || !formData.expiryDate || !formData.cvc)) ||
    (paymentMethod === "paypal" && !formData.paypalEmail);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cardNumber") {
      // Remove non-digits
      newValue = newValue.replace(/\D/g, "");
      // Limit to 12 digits
      newValue = newValue.slice(0, 16);
      // Format XXXX XXXX XXXX
      newValue = newValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    }





    if (name === "expiryDate") {
      // Allow only digits and slash
      newValue = newValue.replace(/[^0-9/]/g, "");

      // Handle different input scenarios
      if (!newValue.includes("/")) {
        // If user types single digit 2-9, prepend 0 and add slash
        if (newValue.length === 1 && newValue >= "2" && newValue <= "9") {
          newValue = "0" + newValue + "/";
        }
        // If user types 2 digits without slash
        else if (newValue.length === 2) {
          const month = parseInt(newValue);
          // Validate month is between 01-12
          if (month < 1 || month > 12) {
            return; // Invalid month
          }
          newValue = newValue + "/";
        }
        // Block more than 2 digits without slash
        else if (newValue.length > 2) {
          return;
        }
      } else {
        // Handle input with slash
        const parts = newValue.split("/");

        // Validate month part (first 2 digits: 01-12)
        if (parts[0].length > 0) {
          const month = parseInt(parts[0]);
          if (parts[0].length === 2 && (month < 1 || month > 12)) {
            return; // Invalid month
          }
          if (parts[0].length > 2) {
            return; // Month too long
          }
        }

        // Validate year part (last 2 digits: 01-31)
        if (parts[1] && parts[1].length > 0) {
          const year = parseInt(parts[1]);
          if (parts[1].length === 2 && (year < 1 || year > 31)) {
            return; // Invalid year
          }
          // Limit year to 2 digits
          if (parts[1].length > 2) {
            return;
          }
        }

        // Prevent multiple slashes
        if (parts.length > 2) {
          return;
        }
      }

      // Limit total length to 5 (MM/YY)
      newValue = newValue.slice(0, 5);
    }



    if (name === "cvc") {
      // Only digits, max 3
      newValue = newValue.replace(/\D/g, "").slice(0, 3);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };


  const handleCheckout = async () => {
    debugger
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
      const IsDataSucess = await UserCoursesServices.UserCourses(payload)
      if (IsDataSucess) {
        setCart([]);
        setIsSuccess(IsDataSucess);

      }
    } catch (error) {
      console.error("Error fetching Data:", error);
    }
  };

  return (
    <>
      {isSuccess ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl w-full text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-10">
              <div className="bg-green-500 rounded-full w-32 h-32 flex items-center justify-center shadow-lg">

                <img className='w-16' src={`${process.env.PUBLIC_URL}/Assets/Icons/Sucess.png`} alt='Sucess' />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
              Purchase Complete
            </h1>

            {/* Subtext */}
            <p className="text-lg text-gray-600 mb-12">
              You will receive a confirmation email soon!
            </p>

            {/* Button */}
            <Link
              to="/"
              className="bg-gray-900 text-white px-10 py-5 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-lg w-full block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (



        <div className="p-10  ">
          {/* Header */}
          <div className="mb-10">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-start h-16">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <div className="text-sm  text-gray-500 mt-4 ml-10">
                  <span className=" font-medium">
                    Details{" "}
                  </span> 
                  &gt;{" "}

                  <Link to="/cart" state={{ from }} className=" font-medium hover:underline">
                    Shopping Cart{" "}
                  </Link>
                 

                  &gt;{" "}
                  <Link to="/checkout" state={{ from }} className="text-blue-600 font-medium hover:underline">
                    Checkout{""}
                  </Link>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 bg-gray-50 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2  rounded-lg shadow-sm p-6">
              {/* Country and State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>

                {/* Credit/Debit Card */}
                <div className="border border-gray-300 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center justify-between w-full cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Credit Card"
                          checked={paymentMethod === "Credit Card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-5 w-5 text-blue-600"
                        />
                        <span className="ml-3 text-base font-medium text-gray-900">
                          Credit/Debit Card
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                          alt="Visa"
                          className="h-6"
                        />
                      </div>
                    </label>


                  </div>

                  {paymentMethod === 'Credit Card' && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name of Card
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          placeholder="Name of card"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="Card Number"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="Enter Country"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVC/CVV
                          </label>
                          <input
                            type="text"
                            name="cvc"
                            placeholder="Enter Country"
                            value={formData.cvc}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <label className="flex items-center justify-between w-full cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-5 w-5 text-blue-600"
                      />
                      <span className="ml-3 text-base font-medium text-gray-900">
                        PayPal
                      </span>
                    </div>
                    <img
                      src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                      alt="PayPal"
                      className="h-6"
                    />
                  </label>

                  {/* Show PayPal Email Input when selected */}
                  {paymentMethod === "paypal" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PayPal Email
                      </label>
                      <input
                        type="email"
                        name="paypalEmail"
                        placeholder="Enter your PayPal email"
                        value={formData.paypalEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className=" rounded-lg shadow-sm p-6  top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details  ({cart.length})</h2>

                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div
                      key={item.courseID}
                      className="text-sm text-gray-700 w-48 truncate"
                      title={item.courseName} // tooltip with full name
                    >
                      {item.courseName}
                    </div>
                  ))}
                </div>

                {/* Coupon Code */}
                <button className="w-full flex items-center justify-center gap-2 py-3 mb-6 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
                  {/* <CreditCard className="w-5 h-5" /> */}
                  <span className="text-sm font-medium">APPLY COUPON CODE</span>
                </button>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Price</span>
                    <span className="font-semibold">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Discount</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span className="font-semibold">${taxPrice}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>${totalPrice + taxPrice}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCartEmpty || isFormIncomplete}
                  className={`w-full py-4 rounded-lg font-semibold transition-colors ${isCartEmpty || isFormIncomplete
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

}