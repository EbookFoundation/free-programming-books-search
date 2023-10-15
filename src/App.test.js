import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders header text', () => {
  render(<App />);
  const headerElement = screen.getByText(/free-programming-books/i);
  expect(headerElement).toBeInTheDocument();
});
