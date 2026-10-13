import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import instructorImage from '../../assets/gallary/image3.jpg';
import { XMarkIcon, CheckIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

const ClassDetail = () => {
  const { id } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [discountMessage, setDiscountMessage] = useState('');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const axiosFetch = useAxiosFetch();

  useEffect(() => {
    axiosFetch.get(`/class/${id}`)
      .then(res => setClassDetail(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const applyDiscount = () => {
    axiosFetch.post('/apply-discount', { classId: id, discountCode })
      .then(res => {
        setDiscountedPrice(res.data.discountedPrice);
        setDiscountMessage(res.data.message);
      })
      .catch(err => setDiscountMessage(err.response?.data?.message || 'خطا در اعمال تخفیف'));
  };

  const handleVideoPlay = () => setVideoPlaying(true);

  if (loading) {
    return <div className="text-center py-10 text-lg text-blue-600">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-lg text-red-600">خطا: {error}</div>;
  }

  if (!classDetail) {
    return <div className="text-center py-10 text-lg text-gray-600">کلاس پیدا نشد</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 mt-16 py-8 lg:py-16">
      {/* Header */}
      <div className="text-center my-6 lg:my-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">جزئیات دوره</h1>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Right Side */}
        <div className="lg:col-span-4 col-span-12 space-y-6 lg:space-y-8">
         {/* Video Card */}
         <div className="relative rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 group">
            {!videoPlaying && (
              <PlayCircleIcon className="absolute inset-0 w-14 h-14 text-white m-auto cursor-pointer transition-opacity opacity-80 group-hover:opacity-100" onClick={handleVideoPlay} />
            )}
            <video
              className="object-cover w-full h-[200px] sm:h-[250px] lg:h-[350px]"
              controls
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              src={classDetail.videoLink}
              type="video/mp4"
            >
              مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.
            </video>
          </div>
          {/* Course Details Card */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">جزئیات دوره</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li>💰 قیمت: <span className="font-bold">{(classDetail.price ?? 0).toLocaleString()} تومان</span></li>
              <li>🎯 مخاطب هدف: <span className="font-bold">{classDetail.targetAudience}</span></li>
              <li>🎥 فرمت بسته: <span className="font-bold">{classDetail.packageFormat}</span></li>
              <li>🥗 برنامه تغذیه: <span className="font-bold">{classDetail.nutritionalPlan || 'ندارد'}</span></li>
              <li>⏳ مدت دسترسی: <span className="font-bold">{classDetail.accessDuration}</span></li>
              <li>📅 مدت دوره: <span className="font-bold">{classDetail.packageDuration}</span></li>
              <li>⚙️ سطح دشواری: <span className="font-bold">{classDetail.difficultyLevel}</span></li>
            </ul>
          </div>

          {/* Instructor Info Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">اطلاعات مربی</h3>
            <p>👨‍🏫 نام: <span className="font-bold text-gray-800 dark:text-white">{classDetail.instructorName}</span></p>
            <p>📧 ایمیل: <span className="font-bold text-gray-800 dark:text-white">{classDetail.instructorEmail}</span></p>
          </div>

          {/* Enroll Button */}
          <div className="text-center">
            <div id="enroll" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {discountedPrice !== null ? `${discountedPrice.toLocaleString()} تومان` : `${(classDetail.price ?? 0).toLocaleString()} تومان`}
              </p>
              <div className="my-4">
                <input
                  type="text"
                  placeholder="کد تخفیف"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs"
                />
                <button
                  onClick={applyDiscount}
                  className="mt-2 inline-block mr-2 text-white py-2 px-6 rounded-lg bg-emerald-900 hover:bg-gray-800"
                >
                  اعمال تخفیف
                </button>
              </div>
              {discountMessage && (
                <p className="text-lg text-red-600 mt-4">{discountMessage}</p>
              )}
            </div>
            <button className="w-full bg-emerald-900 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-lg">
              افزودن به کارت
            </button>
          </div>
        </div>

        {/* Left Side */}
        <div className="lg:col-span-8 col-span-12 space-y-6 lg:space-y-8">
            {/* Course Main Image */}
            <div className="rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <img src={classDetail.image} alt={classDetail.name} className="w-full h-[300px] sm:h-[550px] object-cover" />
          </div>


          {/* Course Title */}
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">{classDetail.name}</h2>

          {/* Author and Update Info */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <img src={instructorImage || 'https://via.placeholder.com/100'} alt={classDetail.instructorName} className="h-14 w-14 rounded-full object-cover" />
              <div className='px-4'>
                <p className="text-gray-600 dark:text-gray-300">👨‍🏫 مربی: <span className="font-bold text-gray-900 dark:text-white">{classDetail.instructorName}</span></p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">🕒 آخرین آپدیت: <span className="font-bold text-gray-900 dark:text-white">22 مهر</span></p>
          </div>

          {/* Course Description */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">توضیحات دوره</h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">{classDetail.description}</p>
          </div>

          {/* Course Goals */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">هدف این دوره</h3>
            <ul className="list-disc pl-6 space-y-2">
              {(classDetail.packageGoals || '').split('\n').filter(Boolean).map((goal, index) => (

                <li key={index} className="flex items-center space-x-3">
                  <CheckIcon className="h-6 w-6 text-green-700" />
                  <span className="text-gray-600 dark:text-gray-300">{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Equipment */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">تجهیزات مورد نیاز</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(classDetail.equipmentRequired || []).map((equipment, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-md">
                  <CheckIcon className="h-6 w-6 text-green-700" />
                  <span className="text-gray-600 dark:text-gray-300">{equipment}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
