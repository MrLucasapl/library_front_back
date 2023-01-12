import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Ibooks, IUser } from 'global';

const url = 'http://localhost:4002/';

const Api = axios.create({
	baseURL: url,
});

Api.interceptors.request.use(async config => {
	const user: IUser = JSON.parse(localStorage.getItem('user'));
	
	if (user) {
		Api.defaults.headers.authorization = `Bearer ${user.token}`;
	}
	return config;
});

/* export const checkIfAuthenticated = async ()=>{
	try {
		const response = await Api.post('/checkAuthorization', {});
		return Promise.resolve(response.data);
	} catch (error) {
		return Promise.reject(error);
	}
}; */

export const postUser = async (email: string, password: string) => {
	try {
		const response = await Api.post('/',{'email':email, 'password':password});
		return Promise.resolve(response.data);
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getAllBooks = async () => {
	try {
		const response = await Api.get('/books', {});
		return Promise.resolve(response.data);
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getBookId = async (id: string) => {
	try {
		const response = await Api.get('/books/' + id, {});
		return Promise.resolve(response.data);
	} catch (error) {
		return Promise.reject(error);
	}
};

export const putBookId = async (id: string, book: Ibooks ) => {
	try {
		const response = await Api.put('/books/' + id, book);
		return Promise.resolve(response.data);
	} catch (error) {
		return Promise.reject(error);
	} 
};

export const postBook = (Newbook: Ibooks) => {
	try {
		const response = Api.post('/books', Newbook);
		return Promise.resolve(response);
	} catch (error) {
		return Promise.reject(error);
	}
};