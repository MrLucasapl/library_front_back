import React from 'react';
import Login from '.';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
	useNavigate: () => mockedUsedNavigate
}));

describe('Integrating unit tests into the login page', () => {
	it('should render Login component', () => {
		render(<Login />);
		expect(screen.getByTestId('login')).toBeInTheDocument();
	});

  fit('testing if formik is being called', async () => {
    const handleSubmit = jest.fn();
    render(<Login onSubmit={handleSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId(/email/i).querySelector('input'), 'admin@admin.com.br');
    await user.type(screen.getByTestId(/password/i).querySelector('input'), 'Admin7242');
    await user.click(screen.getByRole('button', {type: /submit/i}));

    await waitFor(()=> expect(handleSubmit).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'admin@admin.com.br',
        password: 'Admin7242',
      }),
    )

  })
});
