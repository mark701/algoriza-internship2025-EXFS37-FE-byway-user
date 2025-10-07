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
      let orderBy = "CourseID";  // default = latest
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

      setCourseCount(courseData.totalCount)
      setCourseList(courseData.data);
    };

    if (filterCourse.MaxPrice > 0) {
      GetCoursePages();
    }
  }, [filterCourse, sortOrder,pageNumber]); 

    const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <FilterSideBar
        filterCourse={filterCourse}
        setFilterCourse={setFilterCourse}
      />

      {/* Main content */}
      <div className="flex-1">
        {/* Top bar with sorting - reduced padding */}
        <div className="flex justify-end  items-center px-24 pt-6 pb-2">
          <label className="text-gray-700 font-medium mr-3 text-sm">Sort By</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border bg-gray-100 border-black rounded-lg px-3 py-2 hover:bg-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>The latest</option>
            <option>The oldest</option>
            <option>Highest price</option>
            <option>Lowest price</option>
          </select>
        </div>

        {/* Courses grid - reduced top padding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10 pb-10 w-full">
          {courseList.map((course) => (
            <div
              key={course.courseID}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-shadow group flex flex-col"
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
        <Pagination
          currentPage={pageNumber}
          totalItems={courseCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />

      </div>
    </div>
  );
};

export default Courses;