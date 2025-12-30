import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://192.168.1.6:5000';
const api = axios.create({ baseURL: `${BACKEND_URL}/user` });

const authHeader = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

const profileApi = axios.create({ baseURL: `${BACKEND_URL}/profile` });

export const getProfileAllData = async (token) => {
	const res = await profileApi.get('/getalldata', { headers: authHeader(token) });
	return res.data;
};

export const profileForgetPassword = async (payload) => {
 	const res = await profileApi.post('/forget-password', payload);
 	return res.data;
};

export const profileResetPassword = async (payload) => {
 	const res = await profileApi.post('/reset-password', payload);
 	return res.data;
};

export const updateUserProfile = async (formData, token) => {
 	const res = await profileApi.put('/updateuser', formData, {
 		headers: { ...authHeader(token), 'Content-Type': 'multipart/form-data' },
 	});
 	return res.data;
};


export const login = async (credentials) => {
	try {
		const res = await api.post('/login', credentials);
		return res.data;
	} catch (err) {
		console.error('[userService.login] request failed', {
			url: api.defaults.baseURL + '/login',
			payload: credentials,
			status: err.response?.status,
			responseData: err.response?.data,
			message: err.message,
		});
		throw err;
	}
};

export const register = async (data) => {
	try {
		const res = await api.post('/register', data);
		return res.data;
	} catch (err) {
		console.error('[userService.register] request failed', {
			url: api.defaults.baseURL + '/register',
			payload: data,
			status: err.response?.status,
			responseData: err.response?.data,
			message: err.message,
		});
		throw err;
	}
};

export const forgetPassword = async (payload) => {
	const res = await api.post('/forget-password', payload);
	return res.data;
};

export const resetPassword = async (payload) => {
	const res = await api.post('/reset-password', payload);
	return res.data;
};

export const registerPushToken = async (pushToken, token) => {
	const res = await api.post('/push-token', { token: pushToken }, { headers: authHeader(token) });
	return res.data;
};

export const removePushToken = async (pushToken, token) => {
	const res = await api.delete('/push-token', { headers: authHeader(token), data: { token: pushToken } });
	return res.data;
};

export default {
 	login,
 	register,
 	forgetPassword,
 	resetPassword,
 	registerPushToken,
 	removePushToken,
	getProfileAllData,
	profileForgetPassword,
	profileResetPassword,
	updateUserProfile,
};
