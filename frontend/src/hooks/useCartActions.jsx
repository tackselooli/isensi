// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const useCartActions = (userId) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [isChecking, setIsChecking] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Fetch initial cart items when the hook is mounted
//     if (userId) {
//       fetchCartItemsByUserId(userId);
//     }
//   }, [userId]);

//   const fetchCartItemsByUserId = async (userId) => {
//     try {
//       const response = await axios.get(`/cart-by-user/${userId}`);
//       setCartItems(response.data.cartItems);
//     } catch (error) {
//       setError('Failed to fetch cart items.');
//     }
//   };

//   const isItemInCart = (classId) => {
//     return cartItems.some((item) => item.classId === classId);
//   };

//   const addItemToCart = async (classId, email) => {
//     setIsChecking(true);
//     try {
//       // Check if the item is already in the cart
//       if (isItemInCart(classId)) {
//         setError('Item is already in the cart.');
//         setIsChecking(false);
//         return;
//       }

//       // Add the item to the cart
//       const response = await axios.post('/add-to-cart', {
//         userId,
//         classId,
//         email,
//       });

//       if (response.status === 200) {
//         // Update the cart items after successful addition
//         fetchCartItemsByUserId(userId);
//       } else {
//         setError('Failed to add item to cart.');
//       }
//     } catch (error) {
//       setError('An error occurred while adding item to cart.');
//     } finally {
//       setIsChecking(false);
//     }
//   };

//   return {
//     cartItems,
//     isChecking,
//     error,
//     addItemToCart,
//     isItemInCart,
//   };
// };

// export default useCartActions;
