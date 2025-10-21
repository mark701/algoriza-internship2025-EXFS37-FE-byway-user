import { useEffect, useState } from "react";
import { CourseServices } from "../services/CourseServices";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Loading from '../components/Loading'
import { API_BASE_URL } from "../utils/ApiUrl";
import { authAtom } from "../utils/authAtom";
import { cartAtom, isCourseInCartAtom } from "../utils/CartAtom";
import { useAtom } from "jotai";
import CourseCard from "../components/CourseCard";
import parse from 'html-react-parser';

const CourseDetails = () => {
  const { courseID } = useParams();
  const [cart, setCart] = useAtom(cartAtom);
  const [isCourseInCart] = useAtom(isCourseInCartAtom);
  const [topCourses, SetTopCourses] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [authToken] = useAtom(authAtom);
  const [activeTab, setActiveTab] = useState("description");


  const isLoggedIn = !!authToken;



  const from = location.state?.from?.pathname || location.state?.from || "/";


  useEffect(() => {
    const fetchCourse = async () => {

      try {
        debugger
        const data = await CourseServices.GetInclude(courseID);
        const categoryFilter = [data.categoryName]; // get category from data

        const filters = {
          courseRate: 0,
          MinLecture: 0,
          MaxLecture: 0,
          MinPrice: 0,
          MaxPrice: 0,
          Category: categoryFilter, // send category here
        };

        const TopCoursesdata = await CourseServices.GetPagesUser(1, 4, filters, true);
        SetTopCourses(TopCoursesdata.data);
        setCourseData(data);
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };

    fetchCourse();
  }, [courseID]);

  const addToCart = () => {
    debugger

    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname }, replace: true });
      return;
    }

    if (!isCourseInCart(courseData.courseID) && !courseData.isBought) {
      setCart([...cart, courseData]);
    }
  };
  const getButtonContent = () => {
    if (!isLoggedIn) {
      return "Login to Add";
    }
    if (courseData.isBought) {
      return "Already Purchased";
    } else if (isCourseInCart(courseData.courseID)) {
      return "In Cart";
    } else {
      return "Add to Cart";
    }
  };

  const getButtonStyles = () => {
    if (!isLoggedIn) {
      return "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer";
    }
    if (courseData.isBought) {
      return "bg-green-500 text-white cursor-not-allowed";
    } else if (isCourseInCart(courseData.courseID)) {
      return "bg-gray-400 text-white cursor-not-allowed";
    } else {
      return "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer";
    }
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveTab(id);
    }
  };
  const BuyNow = () => {


    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname }, replace: true });
      return;
    }

    if (!isCourseInCart(courseData.courseID)) {
      setCart([...cart, courseData]);

    }
    navigate('/cart', { state: { from: location.pathname }, replace: true });

  }


return (
  <div className="max-w-[1920px] mx-auto">
    {!courseData ? (
      <Loading />
    ) : (
      <div>
        {/* Hero Section */}
        <div className="mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-12 lg:py-16 bg-gray-50 relative">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <Link to="/" state={{ from }} className="font-medium hover:underline">
              Home{" "}
            </Link>
            &gt;{" "}
            <Link to="/courses" state={{ from }} className="font-medium hover:underline">
              Courses
            </Link>{" "}
            &gt;{" "}
            <span className="text-black font-medium">{courseData.courseName}</span>
          </div>

          <div className="grid py-6 sm:py-10 grid-cols-1 lg:grid-cols-3 gap-6 relative">
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{courseData.courseName}</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                {parse(courseData.courseDescription)}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <img
                  src={`${API_BASE_URL}/${courseData.instructorImagePath}`}
                  alt={courseData.courseName}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-sm">
                  Created by{" "}
                  <span className="text-blue-600 font-medium">
                    {courseData.instructorName}
                  </span>
                </span>
              </div>

              <div className="mb-6">
                <span className="mr-2 text-yellow-500">{courseData.courseRate}</span>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`${i < courseData.courseRate ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
                <span className="mx-2">|</span>
                <span className="text-sm">
                  {courseData.courseHours} Total Hours. {courseData.lectureSum} Lectures.{" "}
                  {courseData.courseLevel}
                </span>
              </div>

              <div className="flex col-auto gap-3">
                <img
                  className="max-w-9 w-8 h-8"
                  src={`${API_BASE_URL}/${courseData.categoryImagePath}`}
                  alt={courseData.courseName}
                />
                <span className="px-3 py-1 bg-gray-100 rounded-md">
                  {courseData.categoryName}
                </span>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="lg:relative">
              <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-sm lg:absolute lg:-top-16 lg:right-0 xl:right-16">
                <img
                  src={`${API_BASE_URL}/${courseData.courseImagePath}`}
                  alt={courseData.courseName}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold mb-3">${courseData.coursePrice}</h2>
                <button
                  onClick={addToCart}
                  disabled={isLoggedIn && (courseData.isBought || isCourseInCart(courseData.courseID))}
                  className={`w-full bg-black text-white py-2 rounded-lg mb-2 ${getButtonStyles()}`}
                >
                  {getButtonContent()}
                </button>

                {!courseData.isBought && (
                  <button
                    onClick={BuyNow}
                    className="w-full border py-2 rounded-lg hover:bg-gray-100"
                  >
                    Buy Now
                  </button>
                )}

                <div className="border-t border-gray-200 m-4"></div>

                <div className="justify-start p-1">
                  <span className="text-lg">Share</span>
                  <img
                    className="py-3"
                    src={`${process.env.PUBLIC_URL}/Assets/Icons/FullContact.png`}
                    alt="FullContact"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details Tabs */}
        <div className="px-4 sm:px-6 lg:px-16 py-8 sm:py-12">
          <div className="max-w-5xl">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-4 mb-6">
              {["description", "instructor", "content", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => scrollToSection(tab)}
                  className={`px-4 py-2 rounded-lg border transition-colors duration-200 text-sm sm:text-base
                    ${activeTab === tab
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-blue-100"}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-200 my-4"></div>

            {/* Description Section */}
            <div id="description" className="my-6">
              <div>
                <h2 className="text-xl font-semibold">Course Description</h2>
                <p className="text-gray-700 mt-2 text-sm sm:text-base">
                  {parse(courseData.courseDescription)}
                </p>
              </div>

              <div className="my-6">
                <h2 className="text-xl font-semibold">Course Certification</h2>
                <p className="text-gray-700 mt-2 text-sm sm:text-base">
                  {parse(courseData.courseCertification)}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            {/* Instructor Section */}
            <div className="p-4 sm:p-6 rounded-lg mb-6">
              <div id="instructor">
                <h2 className="text-2xl font-semibold">Instructor</h2>
                <h3 className="text-blue-600 text-xl font-bold mt-8">
                  {courseData.instructorName}
                </h3>
                <p className="text-black font-serif text-sm my-3">
                  {courseData.jobTitleName}
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <img
                  src={`${API_BASE_URL}/${courseData.instructorImagePath}`}
                  alt="Instructor"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                />

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={`${process.env.PUBLIC_URL}/Assets/Icons/Goal.png`}
                      alt="reviews"
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-500">40,445 Reviews</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={`${process.env.PUBLIC_URL}/Assets/Icons/Students.png`}
                      alt="students"
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-500">
                      {courseData.studentsCount} Students
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={`${process.env.PUBLIC_URL}/Assets/Icons/Courses.png`}
                      alt="courses"
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-500">
                      {courseData.courseCount} Courses
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-700 mt-2 text-sm sm:text-base">
                  With over a decade of industry experience, Ronald brings a wealth of
                  practical knowledge to the classroom...
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div id="content">
              <h3 className="text-xl font-semibold">Content</h3>
              <div className="mt-4 bg-white p-4 sm:p-6 rounded-lg shadow-lg space-y-4">
                {courseData.contents.map((content, index) => (
                  <div
                    key={content.contentID}
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 gap-2 ${
                      index !== courseData.contents.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <p className="text-base sm:text-lg font-semibold">
                      {content.contentName}
                    </p>
                    <span className="text-sm sm:text-base text-gray-500">
                      {content.lecturesNumber} Lecture
                      {content.lecturesNumber > 1 ? "s" : ""} | {content.contentHour} hour
                      {content.contentHour > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="px-4 sm:px-6 lg:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Learner Reviews</h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">4.6</span>
                <span className="text-gray-500">146,951 reviews</span>
              </div>

              <div className="mt-4 space-y-2">
                {[5, 4, 3, 2, 1].map((stars, idx) => (
                  <div key={stars} className="flex items-center gap-2">
                    <div className="flex text-xl">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`${
                            i < stars ? "text-yellow-500" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">
                      {[80, 10, 5, 3, 2][idx]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {[1, 2, 3].map((review) => (
                <div key={review} className="bg-white shadow rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex items-center sm:items-start gap-4 sm:flex-col sm:min-w-[150px]">
                    <img
                      src={`${process.env.PUBLIC_URL}/Assets/Images/Man21.png`}
                      alt="Man21"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <h3 className="font-semibold text-gray-800">Mark Doe</h3>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-yellow-500 text-2xl">★</span>
                      <span className="text-lg font-bold">5</span>
                      <p className="text-sm text-gray-500">
                        Reviewed on 22nd March, 2024
                      </p>
                    </div>
                    <p className="text-gray-700 text-sm">
                      I was initially apprehensive, having no prior design experience...
                    </p>
                  </div>
                </div>
              ))}

              <button className="border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
                View more Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        <div className="px-4 sm:px-6 lg:px-16 pb-12">
          <h1 className="font-semibold text-xl sm:text-2xl mb-6">
            More Courses Like This:
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topCourses
              .filter((course) => course.courseID !== Number(courseID))
              .map((course) => (
                <div
                  key={course.courseID}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-shadow"
                >
                  <CourseCard course={course} />
                </div>
              ))}
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default CourseDetails;
