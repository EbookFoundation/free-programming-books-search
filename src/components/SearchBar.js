import React from "react";

function SearchBar(props) {

  // call function to change search parameters in the parent
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
        autoComplete="off"
        type="text"
        name="searchTerm"
        placeholder="Search Book or Author"
        className="searchterm"
        onChange={handleChange}
      />
    </form>
  );
}

export default SearchBar;
