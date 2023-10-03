import React from "react";
import {
  render,
  cleanup,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";

afterEach(cleanup);

test('should render "free-programming-books" link', async () => {
  const { getByText, queryByText } = render(<App />);
  await waitForElementToBeRemoved(() => queryByText("Loading"));
  const linkElement = await waitFor(() => getByText("free-programming-books"));
  expect(linkElement).not.toBeNull();
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute(
    "href",
    "/free-programming-books-search/"
  );
});

test('should render "EbookFoundation/free-programming-books" link', async () => {
  const { getByText, queryByText } = render(<App />);

  await waitForElementToBeRemoved(() => queryByText("Loading"));
  const linkElement = await waitFor(() =>
    getByText("EbookFoundation/free-programming-books").closest("a")
  );
  expect(linkElement).not.toBeNull();
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute(
    "href",
    "https://github.com/EbookFoundation/free-programming-books"
  );
});

it("should display loading state", async () => {
  const { getByText, queryByText } = render(<App />);

  expect(getByText("Loading")).toBeInTheDocument();
  await waitFor(() => {
    expect(queryByText("Loading")).not.toBeInTheDocument();
  });
});

test('renders "Filter by Language" component', async () => {
  const { getByText, queryByText } = render(<App />);

  await waitForElementToBeRemoved(() => queryByText("Loading"));
  const component = await waitFor(() => getByText("Filter by Language"));
  expect(component).toBeInTheDocument();
});

test('renders "SearchBar" input component', async () => {
  const { getByPlaceholderText, queryByText } = render(<App />);

  await waitForElementToBeRemoved(() => queryByText("Loading"));
  const component = await waitFor(() =>
    getByPlaceholderText("Search Book or Author")
  );
  expect(component).toBeInTheDocument();
  expect(component).toHaveAttribute("id", "searchBar");
  expect(component.nodeName).toBe("INPUT");
  expect(component).toHaveAttribute("type", "text");
});

test('renders Markdown "List of Free Learning Resources In Many Languages" H1 component', async () => {
  const { getByText, queryByText } = render(<App />);

  await waitForElementToBeRemoved(() => queryByText("Loading"));
  const component = await waitFor(() =>
    getByText(/List of Free Learning Resources In Many Languages/i)
  );
  expect(component).toBeInTheDocument();
  expect(component.nodeName).toBe("H1");
});
