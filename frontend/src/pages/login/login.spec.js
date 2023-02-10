import React from 'react';
import Login from './index';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
	useNavigate: () => mockedUsedNavigate
}));


jest.mock('formik', () => {
  return {
    useFormik: jest.fn().mockReturnValue({
      values: {
        email: 'admin@admin.com.br',
        password: 'Admin7242',
      },
      handleSubmit: jest.fn(),
    })
  };
});

describe('Integrating unit tests into the login page', () => {
	it('should render Login component', () => {
		render(<Login />);
		expect(screen.getByTestId('login')).toBeInTheDocument();
	});

  fit('testing if formik is being called', async () => {
    render(<Login onSubmit={handleSubmit} />);

    await userEvent.type(screen.getByTestId(/email/i).querySelector('input'), 'admin@admin.com.br');
    await userEvent.type(screen.getByTestId(/password/i).querySelector('input'), 'Admin7242');
    await userEvent.click(screen.getByRole('button', {type: /submit/i}));

    await waitFor(()=> expect(handleSubmit()).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(handleSubmit()).toHaveBeenCalledWith({
        email: 'admin@admin.com.br',
        password: 'Admin7242',
      }),
    )

  })
});
