import { useAtom } from 'jotai';
import { authAtom } from '../utils/authAtom';
import { Link, useLocation } from 'react-router-dom';
import Counter from "../utils/counter";
import PopImage from "../components/PopImage";
import { CategoriesServices } from '../services/CategoriesServices';
import { CourseServices } from '../services/CourseServices'
import { InstructorServices } from '../services/InstructorServices';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/ApiUrl';
import CourseCard from '../components/CourseCard';

const MainPage = () => {
  const location = useLocation();

  const [token] = useAtom(authAtom);
  const [categoryCountData, setcategoryCountData] = useState([]);
  const [courseCountData, setCourseCountData] = useState([]);
  const [instructorData, setInstructorData] = useState([]);

  const [categoryStartIndex, setCategoryStartIndex] = useState(0);
  const [instructorStartIndex, setInstructorStartIndex] = useState(0);

  const visibleCount = 4;

  const handleCategoryPrev = () => {
    setCategoryStartIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleCategoryNext = () => {
    setCategoryStartIndex((prev) =>
      prev < categoryCountData.length - visibleCount ? prev + 1 : prev
    );
  };

  const handleInstructorPrev = () => {
    setInstructorStartIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleInstructorNext = () => {
    setInstructorStartIndex((prev) =>
      prev < instructorData.length - visibleCount ? prev + 1 : prev
    );
  };

  useEffect(() => {
    const GetIntialWithUpdate = async () => {
      try {
        const CategoryData = await CategoriesServices.categoryCourseCounts();
        const CourseData = await CourseServices.GetTopCourses();
        const instructorData = await InstructorServices.GetTopInstructors();

        setcategoryCountData(CategoryData)
        setCourseCountData(CourseData)
        setInstructorData(instructorData)
      } catch (error) {
        console.error("Error fetching Data :", error);
      }
    };

    GetIntialWithUpdate();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="flex-1 max-w-lg text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Unlock Your Potential with Byway
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Welcome to Byway, where learning knows no bounds. We believe that education is the key to personal and professional growth, and we're here to guide you on your journey to success.
            </p>
            {!token && (
              <div className="flex justify-center lg:justify-start">
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Start your journey
                </Link>
              </div>
            )}
          </div>

          <div className="hidden lg:block relative w-64 h-64 flex-shrink-0">
            <img src={`${process.env.PUBLIC_URL}/Assets/Images/Dots.png`} alt='Dots' />
            <div className='bg-black w-10 h-10 mt-40 ml-8 rounded-full flex items-center justify-center'>
              <div className='w-4 h-4 bg-white rotate-45 rounded-sm'></div>
            </div>

            <div className='flex mb-60 -mt-32 -ml-64'>
              <img className='-rotate-[80deg]' src={`${process.env.PUBLIC_URL}/Assets/Images/Dots.png`} alt='Dots' />
            </div>

            <div className="absolute -top-16 -left-48 transform -translate-x-7">
              <div className="absolute top-64 right-[58px] ">
                <img className='rotate-[107deg] w-36 ' src={`${process.env.PUBLIC_URL}/Assets/Images/Arc1.png`} alt='Dots' />

              </div>
              <PopImage BackgroundColor="#F87171" ImagePath={`${process.env.PUBLIC_URL}/Assets/Images/Image1.png`} />
            </div>

            {/* Arc positioned between top and middle images */}

            <div className="absolute bottom-0 -left-4">
              <div className="absolute top-52 -right-0 ">
                <img className='rotate-[5deg] w-36 ' src={`${process.env.PUBLIC_URL}/Assets/Images/Arc1.png`} alt='Dots' />

              </div>
              <PopImage BackgroundColor="#60A5FA" ImagePath={`${process.env.PUBLIC_URL}/Assets/Images/Image2.png`} />
            </div>

            <div className="absolute -bottom-60 -right-3">
              <div className="absolute top-64 right-6 ">
                <img className='rotate-[69deg] w-36 ' src={`${process.env.PUBLIC_URL}/Assets/Images/Arc1.png`} alt='Dots' />

              </div>
              <PopImage BackgroundColor="#FACC15" ImagePath={`${process.env.PUBLIC_URL}/Assets/Images/Image3.png`} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 mt-8 sm:mt-16 lg:mt-52 py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-9 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                <Counter target={250} />
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Courses by our best mentors</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                <Counter target={1000} />
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Students enrolled</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                <Counter target={15} />
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Years of experience</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                <Counter target={2400} />
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Successful graduates</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 lg:mt-24 px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between mb-6 sm:mb-9">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Categories</h2>
          <div className="hidden sm:flex space-x-4 lg:space-x-6 mt-1">
            <button
              onClick={handleCategoryPrev}
              className="w-10 h-10 sm:w-12 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-colors"
            >
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/arrowLeft.png`} alt="Left arrow" className="w-4 h-4" />
            </button>
            <button
              onClick={handleCategoryNext}
              className="w-10 h-10 sm:w-12 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-colors"
            >
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/arrowRight.png`} alt="Right arrow" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto lg:overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            className="flex gap-4 sm:gap-6 lg:gap-8 transition-transform duration-500 ease-in-out pb-4 lg:pb-0"
            style={{
              transform: window.innerWidth >= 1024 ? `translateX(-${categoryStartIndex * 409}px)` : 'none'
            }}
          >
            {categoryCountData.map((category) => (
              <div
                key={category.categoryID}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center min-w-[280px] sm:min-w-[320px] lg:w-[409px] flex-shrink-0 relative hover:z-10"
              >
                <div className="bg-gray-100 rounded-full flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-4 group-hover:scale-110 transition-transform">
                  <img
                    src={`${API_BASE_URL}${category.categoryImagePath}`}
                    alt="category"
                    className="max-w-[60%] max-h-[60%] object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                  {category.categoryName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {category.courseCount} Courses
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 lg:mt-24 px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between mb-6 sm:mb-9">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Courses</h2>
          <div className="flex text-blue-400 mt-1">
            <Link
              to="/courses"
              state={{ from: location.pathname }}
              className="text-sm sm:text-base hover:text-blue-600 transition-colors"
            >
              See all
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto lg:overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 sm:gap-6 lg:gap-8 transition-transform duration-500 ease-in-out pb-4 lg:pb-0">
            {courseCountData.slice(0, 4).map((course) => (
              <div
                key={course.courseID}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col min-w-[280px] sm:min-w-[320px] lg:w-[409px] flex-shrink-0 relative hover:z-10"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 lg:mt-24 px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between mb-6 sm:mb-9">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Instructors</h2>
          <div className="hidden sm:flex space-x-4 lg:space-x-6 mt-1">
            <button
              onClick={handleInstructorPrev}
              className="w-10 h-10 sm:w-12 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-colors"
            >
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/arrowLeft.png`} alt="Left arrow" className="w-4 h-4" />
            </button>
            <button
              onClick={handleInstructorNext}
              className="w-10 h-10 sm:w-12 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-colors"
            >
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/arrowRight.png`} alt="Right arrow" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto lg:overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            className="flex gap-4 sm:gap-6 lg:gap-8 transition-transform duration-500 ease-in-out pb-4 lg:pb-0"
            style={{
              transform: window.innerWidth >= 1024 ? `translateX(-${instructorStartIndex * 410}px)` : 'none'
            }}
          >
            {instructorData.map((instructor) => (
              <div
                key={instructor.instructorID}
                className="p-6 sm:p-8 lg:p-11 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all overflow-hidden min-w-[280px] sm:min-w-[320px] lg:w-[410px] flex-shrink-0 relative hover:z-10"
              >
                <img
                  src={`${API_BASE_URL}${instructor.instructorImagePath}`}
                  alt="instructor"
                  className="w-full h-48 sm:h-56 lg:h-64 object-contain rounded-lg"
                />
                <div className="mt-4 text-center">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {instructor.instructorName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {instructor.jobTilteName}
                  </p>
                  <div className="flex pt-3 mt-4 border-t border-gray-200 justify-between text-sm">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="ml-1 text-gray-900 font-medium">{instructor.courseRate}</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">{instructor.studentsCount}</span> Students
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 lg:mt-24 px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between mb-6 sm:mb-9">
          <h2 className="max-w-xs sm:max-w-md text-xl sm:text-2xl font-bold text-gray-900">
            What Our Customer Say About Us
          </h2>
          <div className="hidden sm:flex space-x-4 lg:space-x-6 mt-1">
            <button
              onClick={handleCategoryPrev}
              className="w-10 h-10 sm:w-12 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-colors"
            >
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/arrowLeft.png`} alt="Left arrow" className="w-4 h-4" />
            </button>
            <button
              onClick={handleCategoryNext}
              className="w-10 h-10 sm:w-12 sm:h-10 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center transition-colors"
            >
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/arrowRight.png`} alt="Right arrow" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="py-6 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 sm:p-6 shadow-sm bg-white hover:shadow-xl transition-all relative hover:z-10">
                <div className="text-blue-500 text-xl sm:text-2xl mb-3">
                  <img src={`${process.env.PUBLIC_URL}/Assets/Icons/Tag.png`} alt="Tag" className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p className="text-sm sm:text-base text-gray-700 font-semibold mb-4">
                  "Byway's tech courses are top-notch!
                  As someone who's always looking to stay ahead in the rapidly evolving tech world
                  I appreciate the up-to-date content and engaging multimedia."
                </p>
                <div className="flex items-center mt-4">
                  <img
                    src={`${process.env.PUBLIC_URL}/Assets/Icons/Girl.png`}
                    alt="Jane Doe"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Jane Doe</h4>
                    <p className="text-gray-500 text-xs sm:text-sm">Designer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 lg:px-72 mt-12 sm:mt-16 lg:mt-20 gap-8">
        <div className="w-full lg:w-auto px-4 sm:px-12 lg:px-24 py-6 sm:py-10">
          <img
            src={`${process.env.PUBLIC_URL}/Assets/Images/image10.png`}
            alt="image10"
            className="w-full h-auto max-w-md mx-auto"
          />
        </div>
        <div className="max-w-xl py-5 text-center lg:text-left lg:mr-32 lg:pl-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Become an Instructor</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Instructors from around the world teach millions of students on Byway.
            We provide the tools and skills to teach what you love.
          </p>
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition text-sm sm:text-base">
            Start Your Instructor Journey
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row-reverse items-center justify-between px-4 sm:px-8 lg:px-72 mt-12 sm:mt-16 lg:mt-20 gap-8 pb-12">
        <div className="w-full lg:w-auto px-4 sm:px-12 lg:px-24 py-6 sm:py-10">
          <img
            src={`${process.env.PUBLIC_URL}/Assets/Images/image11.png`}
            alt="image11"
            className="w-full h-auto max-w-md mx-auto"
          />
        </div>
        <div className="max-w-xl py-5 text-center lg:text-left lg:mr-32 lg:pl-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Transform your life through education</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Learners around the world are launching new careers,
            advancing in their fields, and enriching their lives.
          </p>
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition text-sm sm:text-base">
            Checkout Courses
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;