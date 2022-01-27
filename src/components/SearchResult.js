import React from "react";

function SearchResult({ data }) {
  return (
    <div class="result">
      <h3>
        <a href={data.url} target="_blank">
          {data.title}
        </a>
      </h3>
      <h4>by {data.author ? data.author : "Unknown Author"}</h4>
      <p>({data.lang.code})</p>
    </div>
  );
}

export default SearchResult;
