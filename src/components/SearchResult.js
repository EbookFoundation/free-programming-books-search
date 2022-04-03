import React from "react";

function SearchResult({ data }) {
  return (
    <li className="result">
      // add a link to the given book
        <a href={data.url} target="_blank" rel="noreferrer">
          // put the book data in a readable format
        ({data.lang.code}) {data.title}{data.author ? ` by ${data.author}` : ""}
        </a>
    </li>
  );
}

export default SearchResult;
