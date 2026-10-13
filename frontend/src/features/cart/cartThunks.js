// src/features/cart/cartThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Define the thunk for adding an item to the cart
export const addToCartThunk = createAsyncThunk(
    'cart/addToCartThunk',
    async (item, { rejectWithValue }) => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        
        // Ensure the item has all required fields
        const payload = {
            userId: item.userId, // Ensure userId is included
            name: item.name,     // Ensure name is included
            classId: item.classId, // Ensure classId is included
            email: item.email    // Ensure email is included
        };

        try {
            const response = await axios.post('http://localhost:3000/add-to-cart', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true // Ensure cookies are sent
            });
            return response.data; // Return the data to be used in the fulfilled action
        } catch (error) {
            console.error('Error response:', error.response); // Debugging line
            return rejectWithValue(error.response.data || { message: 'Unknown error' }); // Return error to be used in the rejected action
        }
    }
);


export const deleteCartItem = createAsyncThunk(
    'cart/deleteCartItem',
    async (id, { rejectWithValue }) => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
  
      try {
        const response = await axios.delete(`http://localhost:3000/delete-cart-item/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the header
            'Content-Type': 'application/json'
          },
          withCredentials: true // Ensure cookies are sent if required
        });
        console.log(response)
        return id; // Return the id of the deleted item
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );


  export const fetchCartByEmail = createAsyncThunk(
    'cart/fetchCartByEmail',
    async (email, { rejectWithValue }) => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        try {
            const response = await axios.get(`http://localhost:3000/cart-by-email/${email}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token in the header
                    'Content-Type': 'application/json'
                },
                withCredentials: true // Ensure cookies are sent
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data || { message: 'Unknown error' });
        }
    }
);
