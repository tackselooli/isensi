// src/hooks/useCartByEmail.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useCartByEmail = (email) => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`/cart-by-email/${email}`);
        setCartItems(response.data);
      } catch (error) {
        setError('Failed to fetch cart items.');
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchCartItems();
    }
  }, [email]);

  return { cartItems, error, loading };
};

export default useCartByEmail;
