import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses } from '../../features/classes/classesThunks';
import { useNavigate, Link } from 'react-router-dom';
import { addToCartThunk } from '../../features/cart/cartThunks';

const Classes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classesState = useSelector((state) => state.classes);
  const user = useSelector((state) => state.auth.user);

  const [selectedClass, setSelectedClass] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 6; // Adjust the number of classes per page

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
    } else {
      if (user.userId && selectedClass?._id && selectedClass?.name) {
        dispatch(addToCartThunk({
          userId: user.userId,
          classId: selectedClass._id,
          email: user.email,
          name: selectedClass.name
        }));
      } else {
        console.error("Missing required fields for adding to cart");
      }
    }
  };

  const handleHover = (index) => {
    setHoveredCard(index);
  };

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
  };

  const handleClassClose = () => {
    setSelectedClass(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(classesState.classes.length / classesPerPage);
  const startIndex = (currentPage - 1) * classesPerPage;
  const currentClasses = classesState.classes.slice(startIndex, startIndex + classesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  

  if (classesState.status === 'loading') {
    return <div className="text-center py-10 text-lg text-blue-600">در حال بارگذاری...</div>;
  }

  if (classesState.status === 'failed') {
    return <div className="text-center py-10 text-lg text-red-600">خطا: {classesState.error}</div>;
  }

  if (!classesState.classes || classesState.classes.length === 0) {
    return <div className="text-center py-10 text-lg text-red-600">هیچ کلاسی یافت نشد.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-indigo-100">
      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mt-20 pt-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-800 mb-8">کلاس‌ها</h1>
          </div>

          <div className="my-16 w-full max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {currentClasses.map((cls, index) => (
              <div
                key={cls._id}
                className={`relative transition-all duration-300 hover:scale-105 hover:ring-4 hover:ring-indigo-500 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer flex flex-col`}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={() => handleHover(null)}
                onClick={() => handleClassSelect(cls)}
              >
                <div className="relative w-full h-48 sm:h-60 lg:h-64 flex-shrink-0">
                  <div className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ${hoveredCard === index ? "opacity-50" : ""}`} />
                  <img src={cls.image || 'https://via.placeholder.com/300x200'} alt={cls.name} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-indigo-900 mb-2">{cls.name}</h2>
                    <p className="text-gray-600 mb-2"><strong>مربی:</strong> {cls.instructorName}</p>
                    <p className="text-gray-600 mb-2"><strong>سطح:</strong> {cls.difficultyLevel}</p>
                    {cls.equipmentRequired?.length > 0 && (
                      <p className="text-gray-600 mb-2"><strong>تجهیزات مورد نیاز:</strong> {cls.equipmentRequired.join(', ')}</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-base sm:text-lg font-semibold text-indigo-900">{cls.price ? `${cls.price} تومان` : 'رایگان'}</span>
                    <Link
                      to={`/class/${cls._id}`}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                      مشاهده
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 mx-2 text-white rounded-lg ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300'}`}
            >
              قبلی
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 mx-2 text-white rounded-lg ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300'}`}
            >
              بعدی
            </button>
          </div>

          {selectedClass && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={handleClassClose}
            >
              <div
                className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md sm:max-w-lg mx-auto p-4 sm:p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  onClick={handleClassClose}
                >
                  &times;
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-4">{selectedClass.name}</h2>
                <img src={selectedClass.image || 'https://via.placeholder.com/300x200'} alt={selectedClass.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <p className="text-gray-600 mb-4">{selectedClass.description}</p>
                <p className="text-sm sm:text-base text-gray-500 mb-2"><strong>سطح:</strong> {selectedClass.difficultyLevel}</p>
                <p className="text-sm sm:text-base text-gray-500 mb-2"><strong>تعداد جلسات:</strong> {selectedClass.packageDuration}</p>
                <p className="text-sm sm:text-base text-gray-500 mb-2"><strong>اهداف:</strong> {selectedClass.packageGoals}</p>
                {selectedClass.equipmentRequired?.length > 0 && (
                  <p className="text-sm sm:text-base text-gray-500 mb-2"><strong>تجهیزات مورد نیاز:</strong> {selectedClass.equipmentRequired.join(', ')}</p>
                )}
                <p className="text-sm sm:text-base text-gray-500 mb-2"><strong>قیمت:</strong> {selectedClass.price ? `${selectedClass.price} تومان` : 'رایگان'}</p>
                <div className="flex justify-between">
                  <button
                    onClick={handleAddToCart}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                  >
                    افزودن به کارت
                  </button>
                  <Link
                    to={`/class/${selectedClass._id}`}
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                  >
                    اطلاعات بیشتر
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Classes;
