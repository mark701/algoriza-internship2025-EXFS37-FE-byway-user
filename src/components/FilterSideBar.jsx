import { useState, useRef, useEffect } from 'react';
import { CourseServices } from '../services/CourseServices'
import { CategoriesServices } from '../services/CategoriesServices';

const FilterSideBar = ({ filterCourse, setFilterCourse, isOpen, onClose }) => {
  const [ratingOpen, setRatingOpen] = useState(true);
  const [lecturesOpen, setLecturesOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [tempPrice, setTempPrice] = useState({ min: 0, max: 0 });

  const sliderRef = useRef(null);
  const minValue = 0;

  useEffect(() => {
    const GetInitialData = async () => {
      const MaxPrice = await CourseServices.GetMaxPrice();
      const categoryData = await CategoriesServices.GetNameID();
      setCategoryList(categoryData);
      if (MaxPrice) {
        setMaxPrice(MaxPrice);
        setTempPrice({ min: 0, max: MaxPrice });
        setFilterCourse(prev => ({
          ...prev,
          MinPrice: 0,
          MaxPrice: MaxPrice
        }));
      }
    };
    GetInitialData();
  }, []);

  const handleStarRating = (rating) => {
    if (filterCourse.courseRate === rating) return
    setFilterCourse(prev => ({ ...prev, courseRate: rating }));
  };

  const handleLecturesChange = (range) => {
    if (range === "reset" && filterCourse.MinLecture !== 0) {
      setFilterCourse(prev => ({ ...prev, MinLecture: 0, MaxLecture: 0 }));
      return;
    }
    if (range === "1-15") setFilterCourse(prev => ({ ...prev, MinLecture: 1, MaxLecture: 15 }));
    else if (range === "16-30") setFilterCourse(prev => ({ ...prev, MinLecture: 16, MaxLecture: 30 }));
    else if (range === "31-45") setFilterCourse(prev => ({ ...prev, MinLecture: 31, MaxLecture: 45 }));
    else if (range === "More than 45") setFilterCourse(prev => ({ ...prev, MinLecture: 46, MaxLecture: 0 }));
  };

  const toggleCategory = (cat) => {
    setFilterCourse(prev => {
      const newCats = prev.Category.includes(cat)
        ? prev.Category.filter(c => c !== cat)
        : [...prev.Category, cat];
      return { ...prev, Category: newCats };
    });
  };

  const handleMouseDown = (index) => (e) => {
    e.preventDefault();
    setIsDragging(index);
  };

  const handleTouchStart = (index) => (e) => {
    setIsDragging(index);
  };

  const getPositionFromEvent = (e) => {
    if (!sliderRef.current) return null;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    
    return Math.round(minValue + percent * (maxPrice - minValue));
  };

  const handleMouseMove = (e) => {
    if (isDragging === null) return;
    const value = getPositionFromEvent(e);
    if (value === null) return;

    setTempPrice(prev => {
      let newMin = prev.min;
      let newMax = prev.max;

      if (isDragging === 0) {
        newMin = Math.min(value, newMax);
      } else {
        newMax = Math.max(value, newMin);
      }
      return { min: newMin, max: newMax };
    });
  };

  const handleTouchMove = (e) => {
    handleMouseMove(e);
  };

  const handleMouseUp = () => {
    if (isDragging === null) return;
    setIsDragging(null);

    setTimeout(() => {
      if (tempPrice.min !== filterCourse.MinPrice || tempPrice.max !== filterCourse.MaxPrice) {
        setFilterCourse(prev => ({ ...prev, MinPrice: tempPrice.min, MaxPrice: tempPrice.max }));
      }
    }, 1);
  };

  useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, tempPrice, maxPrice]);

  const getPercentage = (value) => ((value - minValue) / (maxPrice - minValue)) * 100;

  const sidebarContent = (
    <div className="bg-white rounded-lg p-4 sm:p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <h2 className="text-xl font-bold">Filters</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <h2 className="text-lg sm:text-xl font-bold mb-1 hidden lg:block">Design Courses</h2>
      <p className="text-gray-600 mb-4 text-sm sm:text-base hidden lg:block">All Development Courses</p>

      {/* Rating */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div
          className="flex justify-between items-center cursor-pointer py-2"
          onClick={() => setRatingOpen(!ratingOpen)}
        >
          <span className="font-semibold text-gray-800 text-sm sm:text-base">Rating</span>
          <span className="text-gray-500 text-sm">{ratingOpen ? "▼" : "▲"}</span>
        </div>
        {ratingOpen && (
          <div className="flex flex-wrap gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                onClick={() => handleStarRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`select-none text-xl sm:text-2xl cursor-pointer transition-colors 
                  ${(hoverRating || filterCourse.courseRate) >= star ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </div>
            ))}
            <button
              onClick={() => handleStarRating(0)}
              className="ml-2 border bg-zinc-300 px-2 sm:px-3 py-1 rounded-md text-xs text-gray-500 underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Number of Lectures */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div
          className="flex justify-between items-center cursor-pointer py-2"
          onClick={() => setLecturesOpen(!lecturesOpen)}
        >
          <span className="font-semibold text-gray-800 text-sm sm:text-base">Number of Lectures</span>
          <span className="text-gray-500 text-sm">{lecturesOpen ? "▼" : "▲"}</span>
        </div>
        {lecturesOpen && (
          <div className="mt-3 flex flex-col gap-2 sm:gap-3">
            {["1-15", "16-30", "31-45", "More than 45"].map((range) => (
              <label key={range} className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="radio"
                  name="lectures"
                  value={range}
                  checked={
                    (range === "1-15" && filterCourse.MinLecture === 1) ||
                    (range === "16-30" && filterCourse.MinLecture === 16) ||
                    (range === "31-45" && filterCourse.MinLecture === 31) ||
                    (range === "More than 45" && filterCourse.MinLecture === 46)
                  }
                  onChange={() => handleLecturesChange(range)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 text-sm sm:text-base">{range}</span>
              </label>
            ))}
            <button
              onClick={() => handleLecturesChange("reset")}
              className="ml-3 border h-8 bg-zinc-300 w-14 rounded-md text-xs text-gray-500 underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div
          className="flex justify-between items-center cursor-pointer py-2"
          onClick={() => setPriceOpen(!priceOpen)}
        >
          <span className="font-semibold text-gray-800 text-sm sm:text-base">Price</span>
          <span className="text-gray-500 text-sm">{priceOpen ? "▼" : "▲"}</span>
        </div>
        {priceOpen && (
          <div className="mt-4">
            <div className="relative mb-6 px-2">
              <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded-full cursor-pointer touch-none">
                <div
                  className="absolute h-2 bg-blue-500 rounded-full"
                  style={{
                    left: `${getPercentage(tempPrice.min)}%`,
                    width: `${getPercentage(tempPrice.max) - getPercentage(tempPrice.min)}%`
                  }}
                />
                <div
                  className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-grab 
                             active:cursor-grabbing transform -translate-x-1/2 -translate-y-1.5 
                             shadow-md hover:scale-110 transition-transform touch-none"
                  style={{ left: `${getPercentage(tempPrice.min)}%` }}
                  onMouseDown={handleMouseDown(0)}
                  onTouchStart={handleTouchStart(0)}
                />
                <div
                  className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-grab 
                             active:cursor-grabbing transform -translate-x-1/2 -translate-y-1.5 
                             shadow-md hover:scale-110 transition-transform touch-none"
                  style={{ left: `${getPercentage(tempPrice.max)}%` }}
                  onMouseDown={handleMouseDown(1)}
                  onTouchStart={handleTouchStart(1)}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs sm:text-sm">
                <span className="text-gray-600">Min: </span>
                <span className="font-semibold text-gray-800">${tempPrice.min}</span>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="text-gray-600">Max: </span>
                <span className="font-semibold text-gray-800">${tempPrice.max}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <div
          className="flex justify-between items-center cursor-pointer py-2"
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
          <span className="font-semibold text-gray-800 text-sm sm:text-base">Category</span>
          <span className="text-gray-500 text-sm">{categoryOpen ? "▼" : "▲"}</span>
        </div>
        {categoryOpen && (
          <div className="mt-3 flex flex-col gap-2 sm:gap-3 max-h-48 sm:max-h-64 overflow-y-auto pr-2">
            {categoryList.map((category) => (
              <label key={category.categoryID} className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filterCourse.Category.includes(category.categoryName)}
                  onChange={() => toggleCategory(category.categoryName)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-gray-700 text-sm sm:text-base">{category.categoryName}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 lg:hidden shadow-xl">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
};

export default FilterSideBar;