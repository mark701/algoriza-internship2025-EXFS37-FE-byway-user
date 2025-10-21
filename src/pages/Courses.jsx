import { useState, useEffect } from 'react';
import { CourseServices } from '../services/CourseServices';
import FilterSideBar from '../components/FilterSideBar';
import CourseCard from '../components/CourseCard';
import Pagination from "../components/Pagination";

const Courses = () => {
  const [courseList, setCourseList] = useState([]);
  const [courseCount, setCourseCount] = useState(0);
  const [sortOrder, setSortOrder] = useState("The latest");
  const [pageNumber, setPageNumber] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 9;
  const [filterCourse, setFilterCourse] = useState({
    courseRate: 0,
    MinLecture: 0,
    MaxLecture: 0,
    MinPrice: 0,
    MaxPrice: 0,
    Category: []
  });

  useEffect(() => {
    const GetCoursePages = async () => {
      let orderBy = "CourseID";
      let ascending = false;

      if (sortOrder === "The latest") {
        orderBy = "CreateDateAndTime";
        ascending = false;
      } else if (sortOrder === "The oldest") {
        orderBy = "CreateDateAndTime";
        ascending = true;
      } else if (sortOrder === "Highest price") {
        orderBy = "CoursePrice";
        ascending = false;
      } else if (sortOrder === "Lowest price") {
        orderBy = "CoursePrice";
        ascending = true;
      }

      const courseData = await CourseServices.GetPagesUser(pageNumber, itemsPerPage, filterCourse, orderBy, ascending);

      setCourseCount(courseData.totalCount);
      setCourseList(courseData.data);
    };

    if (filterCourse.MaxPrice > 0) {
      GetCoursePages();
    }
  }, [filterCourse, sortOrder, pageNumber]);

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  return (
    <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row w-full">
      {/* Filter Sidebar */}
      <FilterSideBar
        filterCourse={filterCourse}
        setFilterCourse={setFilterCourse}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar with filter button and sorting */}
        <div className="flex justify-between items-center gap-4 px-4 sm:px-6 lg:px-12 xl:px-24 pt-6 pb-4 bg-white sticky top-0 z-10 shadow-sm">
          {/* Filter Button (Mobile/Tablet) */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>

          {/* Spacer for desktop when filter button is hidden */}
          <div className="hidden lg:block"></div>

          {/* Sort Dropdown - Always on the right */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 font-medium text-sm whitespace-nowrap">Sort By</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border bg-gray-100 border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
            >
              <option>The latest</option>
              <option>The oldest</option>
              <option>Highest price</option>
              <option>Lowest price</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="px-4 sm:px-6 lg:px-12 xl:px-24 py-2">
          <div className="flex flex-wrap gap-2">
            {filterCourse.courseRate > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Rating: {filterCourse.courseRate}★
                <button onClick={() => setFilterCourse(prev => ({ ...prev, courseRate: 0 }))} className="ml-1 hover:text-blue-900">×</button>
              </span>
            )}
            {filterCourse.MinLecture > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Lectures: {filterCourse.MinLecture}-{filterCourse.MaxLecture || "∞"}
                <button onClick={() => setFilterCourse(prev => ({ ...prev, MinLecture: 0, MaxLecture: 0 }))} className="ml-1 hover:text-blue-900">×</button>
              </span>
            )}
            {filterCourse.Category.length > 0 && filterCourse.Category.map(cat => (
              <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {cat}
                <button onClick={() => setFilterCourse(prev => ({ ...prev, Category: prev.Category.filter(c => c !== cat) }))} className="ml-1 hover:text-blue-900">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Courses grid */}
        <div className="px-4 sm:px-6 lg:px-12 xl:px-24 py-6">
          {courseList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {courseList.map((course) => (
                <div
                  key={course.courseID}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-shadow group flex flex-col"
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No courses found matching your filters.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 lg:px-12 xl:px-24 pb-12">
          <Pagination
            currentPage={pageNumber}
            totalItems={courseCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Courses;