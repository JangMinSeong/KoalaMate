import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthStatus, setLoading } from 'store/authSlice';

const useAuthStatus = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const checkAuthStatus = async () => {
			dispatch(setLoading(true));
			try {
				await axios.get(`${process.env.REACT_APP_API_URL}/auth/status`, { withCredentials: true });
				dispatch(setAuthStatus(true));
			} catch (error) {
				dispatch(setAuthStatus(false));
			} finally {
				dispatch(setLoading(false));
			}
		};

		checkAuthStatus();
	}, [dispatch]);

	return;
};

export default useAuthStatus;
