import React from 'react';
import Login from './index';
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { postUser } from '../../services/api';
import { useMessage } from '../../hooks/AlertMessage';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn()
}));

jest.mock('../../services/api', () => ({
	postUser: jest.fn().mockResolvedValue({ auth: true, name: 'Admin', token: 'abc123' })
}));

const localStorageMock = (() => {
	let store = {};

	return {
		getItem: key => store[key],
		setItem: (key, value) => {
			store[key] = value.toString();
		},
		removeItem: () => {
			store = {};
		}
	};
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock('../../hooks/AlertMessage', () => ({
	useMessage: jest.fn()
}));

describe('Login component', () => {
	it('must render the components that have inside the Login', () => {
		const { setMessage, AlertMessage } = { setMessage: jest.fn(), AlertMessage: jest.fn() };

		useNavigate.mockReturnValue(jest.fn());
		useMessage.mockReturnValue({ setMessage, AlertMessage });

		render(<Login />);
		expect(screen.getByTestId('login')).toBeInTheDocument();
		expect(screen.getByTestId(/email/i).querySelector('input')).toBeInTheDocument();
		expect(screen.getByTestId(/password/i).querySelector('input')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'ENTRAR' })).toBeInTheDocument();
	});

	it('must handle form submission', async () => {
		const { setMessage, AlertMessage } = { setMessage: jest.fn(), AlertMessage: jest.fn() };

		useNavigate.mockReturnValue(jest.fn());
		useMessage.mockReturnValue({ setMessage, AlertMessage });
		render(<Login />);

		const email = screen.getByTestId(/email/i).querySelector('input');
		const password = screen.getByTestId(/password/i).querySelector('input');
		const button = screen.getByRole('button', { name: 'ENTRAR' });

		await fireEvent.change(email, { target: { value: 'admin@admin.com.br' } });
		await fireEvent.change(password, { target: { value: 'Admin7242' } });
		fireEvent.click(button);

		await waitFor(() => expect(postUser).toHaveBeenCalledTimes(1));

		await waitFor(() => {
			expect(postUser).toHaveBeenCalledWith('admin@admin.com.br', 'Admin7242');
		});

		await waitFor(() => {
			expect(localStorage.getItem('user')).not.toBeNull();
		});
	});

	fit('displays error message on invalid credentials', async () => {
		const { setMessage, AlertMessage } = { setMessage: jest.fn(), AlertMessage: jest.fn() };

		useNavigate.mockReturnValue(jest.fn());
		useMessage.mockReturnValue({ setMessage, AlertMessage });
		render(<Login />);

		const email = screen.getByTestId(/email/i).querySelector('input');
		const password = screen.getByTestId(/password/i).querySelector('input');
		const button = screen.getByRole('button', { name: 'ENTRAR' });

		await act(async () => {
			fireEvent.change(email, { target: { value: 'test@test.com' } });
			fireEvent.change(password, { target: { value: 'invalidPassword' } });
			fireEvent.click(button);
		});

		await act(async () => {
			expect(postUser).toHaveBeenCalledTimes(1);
		});

		await act(async () => {
			expect(setMessage).toHaveBeenCalledTimes(1);
			expect(setMessage).toHaveBeenCalledWith({
				content: 'Invalid email or password',
				display: true,
				severity: 'error'
			});
			expect(AlertMessage).toHaveBeenCalledTimes(1);
		});
	});
});
