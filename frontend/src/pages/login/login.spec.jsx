/* eslint-disable no-undef */
import Login from './index';
import { render, screen } from '@testing-library/react';

describe('Login', ()=>{
	it('teste para ver se o componente existe', () =>{
		render(<Login/>);
		expect(screen.getByTestId('login')).toBeInTheDocument();
	});
});