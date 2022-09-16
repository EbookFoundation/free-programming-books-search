import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders EbookFoundation/free-programming-books link", () => {
  render(<App />);
  const linkElement = screen.getByText(
    /EbookFoundation\/free-programming-books/i
  );
  expect(linkElement).toBeInTheDocument();
});
