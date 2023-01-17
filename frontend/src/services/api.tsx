import axios from 'axios';
import { Ibooks, IUser } from 'global';

const url = 'http://localhost:4002/';

const Api = axios.create({
	baseURL: url,
	transformRequest: [
		(data, headers) => {
			const user: IUser = JSON.parse(localStorage.getItem('user'));
			if (user) {
				headers.authorization = `Bearer ${user.token}`;
			}
			return data;
		},
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		...axios.defaults.transformRequest,
	],
});

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
		const formData = new FormData();
		formData.append('image', book.image);
		formData.append('book', JSON.stringify(book));
		
		const response = await Api.put('/books/' + id, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}});
		return Promise.resolve(response.data);
	} catch (error) {
		return Promise.reject(error);
	}
};

export const postBook = async (Newbook: Ibooks) => {
	try {
		const formData = new FormData();
		formData.append('image', Newbook.image);
		formData.append('book', JSON.stringify(Newbook));
		const response = await Api.post('/books', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}});
		return Promise.resolve(response);
	} catch (error) {
		return Promise.reject(error);
	}
};