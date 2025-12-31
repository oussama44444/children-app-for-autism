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
	// Hardcoded login for testing
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				success: true,
				token: 'fake-jwt-token-12345',
				user: {
					id: '1',
					name: 'Test User',
					email: credentials.email,
					phone: '+216 20 123 456',
					age: 25,
					avatar: '🦁',
				},
			});
		}, 500);
	});
};

export const register = async (data) => {
	// Hardcoded register for testing
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				success: true,
				message: 'Compte créé avec succès',
				token: 'fake-jwt-token-12345',
				user: {
					id: '1',
					name: data.name,
					email: data.email,
					phone: data.phone || '',
					age: data.age || 0,
					avatar: '🦁',
				},
			});
		}, 500);
	});
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
