import React from 'react';
import Login from './index';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { postUser } from '../../services/api';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockedUsedNavigate
}));

jest.mock('../../services/api', () => ({
	postUser: jest.fn().mockResolvedValue({ auth: true, name: 'John Doe', token: 'abc123' })
}));

/* jest.mock('formik', () => {
  return {
    useFormik: jest.fn().mockReturnValue({
      values: {
        email: 'admin@admin.com.br',
        password: 'Admin7242',
      },
    })
  };
}); */

describe('Integrating unit tests into the login page', () => {
	it('should render Login component', () => {
		render(<Login />);
		expect(screen.getByTestId('login')).toBeInTheDocument();
	});

	fit('testing if formik is being called', async () => {
		render(<Login />);
		const email = screen.getByTestId(/email/i).querySelector('input');
		const password = screen.getByTestId(/password/i).querySelector('input');
		const submitButton = screen.getByTestId('submit-form');

		await fireEvent.change(email, { target: { value: 'admin@admin.com.br' } });
		await fireEvent.change(password, { target: { value: 'Admin7242' } });
		fireEvent.submit(submitButton);

		await waitFor(() => expect(postUser).toHaveBeenCalledTimes(1));
		await waitFor(() =>
			expect(postUser).toHaveBeenCalledWith('admin@admin.com.br', 'Admin7242')
		);
	});
});
