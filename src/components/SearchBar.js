import React, {useEffect} from "react";

function SearchBar(props) {
  useEffect(() => {
    document.getElementById("searchBar").value = props.defaultTerm
  }, []);

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
        required
        className="searchterm"
        onChange={handleChange}
      />
    </form>
  );
}

export default SearchBar;
