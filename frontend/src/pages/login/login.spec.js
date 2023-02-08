import React from 'react';
import Login from '.';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Integrating unit tests into the login page', ()=>{
    it('should render Login component', () => {
    render(<Login />);
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });
})