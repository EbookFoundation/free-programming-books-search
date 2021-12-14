import React, { useState, useEffect } from 'react';

function SearchResult({ data }){
    return(
        <div>
            <button onClick={(e) => {
					if (data.url !== undefined)
					{
				  e.preventDefault();
				  window.location.href= data.url;
					}}}>
                <h3>{data.title} by {data.author}</h3>
                <p>({data.lang.code})</p>
            </button>
        </div>
    )
}

export default SearchResult;