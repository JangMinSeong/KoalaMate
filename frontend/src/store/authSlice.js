import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
	name: 'auth',
	initialState: {
		isLoggedIn: false,
		isLoading: false,
		user: null
	},
	reducers: {
		setAuthStatus: (state, action) => {
			state.isLoggedIn = action.payload;
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		setLoginStatus: (state, action) => {
			state.isLoggedIn = action.payload.isLoggedIn;
			state.user = action.payload.user;
		}
	}
});

export const { setAuthStatus, setLoading, setLoginStatus } = authSlice.actions;

export default authSlice.reducer;