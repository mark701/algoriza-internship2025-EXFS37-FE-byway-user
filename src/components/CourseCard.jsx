import { cartAtom, isCourseInCartAtom } from "../utils/CartAtom";
import { authAtom } from "../utils/authAtom";
import { useAtom } from "jotai";
import { API_BASE_URL } from "../utils/ApiUrl";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function CourseCard({ course }) {
  const [cart, setCart] = useAtom(cartAtom);
  const [isCourseInCart] = useAtom(isCourseInCartAtom);
  const [authToken] = useAtom(authAtom);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!authToken;



  const addToCart = () => {
    debugger
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location, } });
      return;
    }

    if (!isCourseInCart(course.courseID) && !course.isBought) {
      setCart([...cart, course]);
    }
  };

  const getButtonContent = () => {
    if (!isLoggedIn) {
      return "Login to Add";
    }
    if (course.isBought) {
      return "Already Purchased";
    } else if (isCourseInCart(course.courseID)) {
      return "In Cart";
    } else {
      return "Add to Cart";
    }
  };

  const getButtonStyles = () => {
    if (!isLoggedIn) {
      return "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer";
    }
    if (course.isBought) {
      return "bg-green-500 text-white cursor-not-allowed";
    } else if (isCourseInCart(course.courseID)) {
      return "bg-gray-400 text-white cursor-not-allowed";
    } else {
      return "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer";
    }
  };

  return (
    <div className="max-w-md  bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={`${API_BASE_URL}/${course.courseImagePath}`}
          alt={course.courseName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gray-200 bg-opacity-90 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
            {course ? course.categoryName : "Unknown"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {course.courseName}
        </h2>
        <p>By {course.instructorName}</p>

        <div className="flex items-center mb-3 pointer-events-none space-x-1 text-xl">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`${i < course.courseRate ? "text-yellow-500" : "text-gray-300"} cursor-pointer`}
            >
              ★
            </span>
          ))}
        </div>

        <p className="text-gray-600 text-sm mb-4">
          {course.courseHours} Hours • {course.lectureSum} Lectures • {course.courseLevel}
        </p>

        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900">${course.coursePrice}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={addToCart}
            disabled={isLoggedIn && (course.isBought || isCourseInCart(course.courseID))}
            className={`flex-1 py-1 px-2 text-md rounded-lg font-medium transition-colors ${getButtonStyles()}`}
          >
            {getButtonContent()}
          </button>

          {/* View Details Button */}
          <Link
            to={`/courses/${course.courseID}`}
            onClick={() => window.scrollTo(0, 0)}
            className="flex-1 py-1 px-2 text-md rounded-lg font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}