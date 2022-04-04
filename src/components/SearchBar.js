import React, {useEffect} from "react";
const queryString = require("query-string");

function SearchBar(props) {
  useEffect(() => {
    let queries = queryString.parse(document.location.search);
    if (queries.search) {
      document.getElementById("searchBar").value = queries.search;
      props.changeParameter("searchTerm", queries.search);
    }
  }, [props]);

  const handleChange = (e) => {
    props.changeParameter("searchTerm", e.target.value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      name="searchBar"
      className="searchbar"
    >
      <input
        id="searchBar"
        autoComplete="off"
        type="text"
        name="searchTerm"
        placeholder={"Search Book or Author"}
        className="searchterm"
        onChange={handleChange}
      />
    </form>
  );
}

export default SearchBar;
