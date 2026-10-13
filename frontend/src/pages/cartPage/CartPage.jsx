import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartByEmail } from '../../features/cart/cartThunks';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { deleteCartItem as deleteCartItemThunk } from '../../features/cart/cartThunks';
import { clearCart } from '../../features/cart/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.user?.email);
  const items = useSelector((state) => state.cart.items);
  const status = useSelector((state) => state.cart.status);
  const error = useSelector((state) => state.cart.error);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (email) {
      dispatch(fetchCartByEmail(email)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, email]);

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  };

  const handleDeleteClick = (itemId) => {
    dispatch(deleteCartItemThunk(itemId))
      .then((result) => {
        if (deleteCartItemThunk.fulfilled.match(result)) {
          console.log('Item removed successfully');
        } else {
          console.error('Failed to remove item:', result.payload);
        }
      });
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleApplyDiscount = () => {
    if (discountCode === 'DISCOUNT10') {
      setDiscount(0.1);
    } else {
      alert('Invalid discount code');
      setDiscount(0);
    }
  };

  const totalPrice = calculateTotalPrice();
  const discountedPrice = totalPrice * (1 - discount);

  if (loading) {
    return <div className="text-center py-10 text-lg text-blue-600">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-lg text-red-600">خطا: {error.message || error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-4 md:p-8">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">سبد خرید</h1>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => window.history.back()}
          >
            <XMarkIcon aria-hidden="true" className="h-6 w-6 md:h-8 md:w-8" />
            <span className="sr-only">بستن</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center text-lg text-gray-600">سبد خرید شما خالی است</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 border rounded-lg shadow-md bg-white">
                <div className="flex-1 flex flex-col md:flex-row items-start md:items-center">
                  <div className="w-360 h-200 flex-shrink-0 overflow-hidden rounded-3xl border border-gray-200">
                    <img
                      alt={item.name}
                      src={item.image || 'https://via.placeholder.com/360x200'}
                      className="w-[360px] h-[200px] object-cover object-center"
                    />
                  </div>
                  <div className="mt-4 md:mt-0 md:mr-4 flex flex-col">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-600 text-sm mt-1 md:mt-2">مدرس: {item.instructorName}</p>
                    <p className="text-gray-600 text-sm">تعداد ثبت‌نام شده: {item.totalEnrolled}</p>
                    <p className="text-gray-600 text-sm mt-1 md:mt-2">توضیحات: {item.description}</p>
                    <p className="text-gray-600 text-sm mt-1 md:mt-2">قیمت: {parseFloat(item.price).toLocaleString()} تومان</p>
                    <a href={item.videoLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 mt-2 text-sm">مشاهده ویدئو</a>
                  </div>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <button onClick={() => handleDeleteClick(item._id)} className="text-red-500 hover:text-red-700 text-lg">حذف</button>
                </div>
              </div>
            ))}

            <div className="mt-6 border-t pt-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-800">مجموع قیمت:</span>
                  <span className="text-lg font-semibold text-gray-800">{totalPrice.toLocaleString()} تومان</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-800">تخفیف:</span>
                    <span className="text-lg font-semibold text-gray-800">-{(totalPrice * discount).toLocaleString()} تومان</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">قیمت نهایی:</span>
                  <span className="text-xl font-bold text-gray-900">{discountedPrice.toLocaleString()} تومان</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-center">
          <div className="flex flex-col space-y-4 md:w-1/2 lg:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="کد تخفیف"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="border mr-3 border-gray-300 rounded-lg px-4 py-2 w-full pr-12"
              />
              <button
                onClick={handleApplyDiscount}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-indigo-600 rounded-r-lg hover:bg-indigo-700"
              >
                <CheckIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <a
            href="#"
            className="bg-indigo-600 text-white rounded-md px-6 py-3 text-base font-medium shadow-sm hover:bg-indigo-700 text-center w-full md:w-auto"
          >
            پرداخت
          </a>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
