import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';

test('renders the home page with the correct text', () => {
  render(<Home />);
  const headingElement = screen.getByText(/Coming Soon/i);
  expect(headingElement).toBeInTheDocument();
});
