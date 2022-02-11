import React from "react";

function SearchResult({ data }) {
  return (
    <li class="result">
        <a href={data.url} target="_blank">
        ({data.lang.code}) {data.title} by {data.author ? data.author : "Unknown Author"}
        </a>
    </li>
  );
}

export default SearchResult;
