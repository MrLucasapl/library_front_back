import React from 'react';
import Login from './index';
import { fireEvent, render, screen, act } from '@testing-library/react';
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

const mockUseMessage = () => {
	const { showMessage, AlertMessage } = { showMessage: jest.fn(), AlertMessage: jest.fn() };
	useMessage.mockReturnValue({ showMessage, AlertMessage });
};

const getElementsLogin = () => {
	const email = screen.getByTestId(/email/i).querySelector('input');
	const password = screen.getByTestId(/password/i).querySelector('input');
	const button = screen.getByRole('button', { name: 'ENTRAR' });

	return { email, password, button };
};

describe('Login component', () => {
	it('must render the components that have inside the Login', () => {
		mockUseMessage();
		render(<Login />);
		const { email, password, button } = getElementsLogin();

		expect(screen.getByTestId('login')).toBeInTheDocument();
		expect(email).toBeInTheDocument();
		expect(password).toBeInTheDocument();
		expect(button).toBeInTheDocument();
	});

	it('must handle form submission', async () => {
		mockUseMessage();
		useNavigate.mockReturnValue(jest.fn());
		render(<Login />);
		const { email, password, button } = getElementsLogin();

		await act(async () => {
			fireEvent.change(email, { target: { value: 'admin@admin.com.br' } });
			fireEvent.change(password, { target: { value: 'Admin7242' } });
			fireEvent.click(button);
		});

		await act(async () => {
			expect(postUser).toHaveBeenCalledTimes(1);
			expect(postUser).toHaveBeenCalledWith('admin@admin.com.br', 'Admin7242');
		});

		await act(async () => {
			expect(localStorage.getItem('user')).not.toBeNull();
		});
	});

	it('displays error message on invalid credentials', async () => {
		mockUseMessage();
		useNavigate.mockReturnValue(jest.fn());
		postUser.mockResolvedValue({ auth: false, message: 'Acesso negado!' });

		render(<Login />);
		const { email, password, button } = getElementsLogin();

		await act(async () => {
			fireEvent.change(email, { target: { value: 'test@test.com' } });
			fireEvent.change(password, { target: { value: 'invalidPassword' } });
			fireEvent.click(button);
		});

		await act(async () => {
			expect(screen.queryByText('Acesso negado!')).not.toBeInTheDocument();
		});
	});
});
