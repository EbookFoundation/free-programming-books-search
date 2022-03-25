import React from "react";

function SearchResult({ data }) {
  return (
    <li class="result">
        <a href={data.url} target="_blank" rel="noreferrer">
        ({data.lang.code}) {data.title}{data.author ? ` by ${data.author}` : ""}
        </a>
    </li>
  );
}

export default SearchResult;
