import axios from 'axios';

// Backend has no explicit transactions route in the repo; provide a small wrapper
// in case you add a `/transactions` route later. Adjust `BACKEND_URL` if needed.
const BACKEND_URL = process.env.BACKEND_URL || 'http://192.168.100.23:5000';
const api = axios.create({ baseURL: `${BACKEND_URL}/transactions` });

const authHeader = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

export const createTransaction = async (payload, token) => {
	const res = await api.post('/', payload, { headers: authHeader(token) });
	return res.data;
};

export const getTransactions = async (token) => {
	const res = await api.get('/', { headers: authHeader(token) });
	return res.data;
};

export const getTransactionById = async (id, token) => {
	const res = await api.get(`/${id}`, { headers: authHeader(token) });
	return res.data;
};

export default {
	createTransaction,
	getTransactions,
	getTransactionById,
};
