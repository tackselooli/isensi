// src/features/cart/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { addToCartThunk, deleteCartItem, fetchCartByEmail } from './cartThunks';

const initialState = {
    items: [],
    email: null,
    error: null,
    status: 'idle'
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setUserEmail(state, action) {
            state.email = action.payload;
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCartThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addToCartThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const item = action.payload;
                const existingItem = state.items.find(i => i._id === item._id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    state.items.push({ ...item, quantity: 1 });
                }
            })
            .addCase(addToCartThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to add item to cart';
            })
            .addCase(deleteCartItem.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = state.items.filter(item => item._id !== action.payload);
            })
            .addCase(deleteCartItem.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchCartByEmail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCartByEmail.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCartByEmail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { removeFromCart, clearCart, setUserEmail } = cartSlice.actions;
export default cartSlice.reducer;
