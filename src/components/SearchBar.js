import React from 'react';

function SearchBar(props){
    const handleChange = (e) => {
        props.changeParameter('title', e.target.value);
    }

    return(
        <form
            onSubmit={(e) => {
                e.preventDefault();
            }}
            name="searchBar"
        >
            <input autoComplete="off" type="text" name="searchTerm" placeholder="Enter Book Name" onChange={handleChange} />
        </form>
    )
}

export default SearchBar;