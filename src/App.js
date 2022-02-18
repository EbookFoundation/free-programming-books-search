import React, { useState, useEffect } from "react";
import LangDropdown from "./components/LangDropdown";
import SectDropdown from "./components/SectDropdown";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";
import LightSwitch from "./components/LightSwitch";
import axios from "axios";
import Fuse from "fuse.js";

import SunImg from "./img/sun.png"
import MoonImg from "./img/moon.png"

const fpb = null;

// eslint-disable-next-line
function makeBook(author, hLang, cLang, title, url) {
  //returns a struct with basic book info (author, human language, computer language, book title, url)
  return {
    author: author,
    hLang: hLang, //human language
    cLang: cLang, //computer language
    title: title,
    url: url,
  };
}

// eslint-disable-next-line
function forEachBook(func, json) {
  //Runs func on each section, entry, and book in json, which is a list of entries
  if (typeof func !== "function") {
    // eslint-disable-next-line
    throw "ERROR in forEachBook: parameter not a fucntion";
  }

  for (const hLang in json) {
    //for each human language
    if (Array.isArray(hLang.sections)) {
      //check if sections is an array
      hLang.sections.forEach(
        (
          cLang //for each computer lanuage
        ) => {
          if (Array.isArray(cLang.entries)) {
            //verify is entries is an array
            cLang.entries.forEach(
              (
                book //for each book
              ) => {
                if (typeof book === "object") {
                  //verify that book is an object
                  func(json[hLang], cLang, book); //run the function
                }
              }
            );
          }
        }
      );
    }
  }
}

// Sorts search results by their score
// eslint-disable-next-line
function sortByScore(results) {
  results.sort(function (a, b) {
    return a.score - b.score;
  });
  return results;
}

function jsonToArray(json) {
  let arr = [];
  let sections = [];
  json.children[0].children.forEach((document) => {
    document.sections.forEach((section) => {
      if (!sections.includes(section.section)) sections.push(section.section);
      section.entries.forEach((entry) => {
        arr.push({
          author: entry.author,
          title: entry.title,
          url: entry.url,
          lang: document.language,
          section: section.section,
        });
      });
      section.subsections.forEach((subsection) => {
        subsection.entries.forEach((entry) => {
          arr.push({
            author: entry.author,
            title: entry.title,
            url: entry.url,
            lang: document.language,
            section: section.section,
            subsection: subsection.section,
          });
        });
      });
    });
  });
  return { arr: arr, sections: sections };
}

function App() {
  const [data, setData] = useState(undefined); // keeps the state of the json
  const [dataArray, setDataArray] = useState([]); // put everything into one array. uses more memory, but search is faster and less complex
  // eslint-disable-next-line
  const [index, setIndex] = useState([]); // used for "table of contents". currently unused
  const [loading, setLoading] = useState(true); // Determines whether to show spinner
  const [searchParams, setSearchParams] = useState({ title: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [sectionResults, setSectionResults] = useState([]);
 	const [lightMode, setLightMode] = useState(true);

  // eslint-disable-next-line
  const [error, setError] = useState("");

  let resultsList = null; // the html string containing the search results
  let sectionResultsList = null;

  const changeParameter = (param, value) => {
    // Lets a child component set the value of the search term
    setSearchParams({ ...searchParams, [param]: value });
  };

  // fetches data the first time the page renders
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let result = await axios.get(
          "https://raw.githubusercontent.com/FreeEbookFoundationBot/free-programming-books-json/main/fpb.json"
        );
        setData(result.data);
        let { arr, sections } = jsonToArray(result.data);
        console.log(arr);
        setDataArray(arr);
        setIndex(sections);
      } catch (e) {
        // setError("Couldn't get data. Please try again later")
        setData(fpb);
        let { arr, sections } = jsonToArray(fpb);
        setIndex(sections);
        setDataArray(arr);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // fires when searchTerm changes
  // THIS IS THE MAIN SEARCH FUNCTION CURRENTLY
  useEffect(() => {
    if (dataArray) {
      // Finds most relevant titles
      const fuseOptions = {
        useExtendedSearch: true,
        findAllMatches: true,
        shouldSort: true,
        includeScore: true,
        threshold: 0.2,
        keys: ["title", "lang.code", "section"],
      };

      let fuse = new Fuse(dataArray, fuseOptions);
      let query = [];
      for (const [key, value] of Object.entries(searchParams)) {
        if (value === null || value === "") continue;
        if (key === "lang.code") {
          query.push({ "lang.code": `^${value}` });
          continue;
        }
        if (key === "section"){
          query.push({"section": `^${value}`});
          continue;
        }
        query.push({ [key]: value });
      }
      let result = fuse.search({
        $and: query,
      });
      result = result.slice(0, 40);
      setSearchResults(result);

      let sResults = []; // section results
      // Finds the most relevant sections
      result.forEach((entry) => {
        let section = entry.item.section;
        if (!sResults.includes(section)) sResults.push(section);
      });
      setSectionResults(sResults);
    }
  }, [searchParams, dataArray]);

  if (loading) {
    // if still fetching resource
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>Error: {error}</h1>;
  }
  if (searchParams.title && searchResults.length !== 0) {
    resultsList =
      searchResults &&
      searchResults.map((entry) => {
        return <SearchResult data={entry.item} />;
      });
    sectionResultsList =
      sectionResults &&
      sectionResults.map((section) => {
        return <button onClick={() => {changeParameter("section", section); }}>{section}</button>;
      });
  }
  return (
    <div className="frontPage" style={{color: lightMode ? "black" : "white", backgroundColor: lightMode ? "white" : "black"}}>
	<img src={lightMode ? SunImg: MoonImg}
	onClick = {()=>setLightMode(!lightMode)} style={{width: "100px", height: "100px",display: "block",
													  marginLeft: "auto",
													  marginRight: "auto",
													  }}/>
	 <h1>Free Programming Books</h1>
      <div>
        <SearchBar changeParameter={changeParameter} />
        <LangDropdown changeParameter={changeParameter} data={data} />
      </div>
      <h2>Section Results</h2>
      {sectionResultsList && (
        <p>
          This feature is not complete! For now, use this to help reference the
          markdown documents on the main respository.
        </p>
      )}
      <SectDropdown className="sect-drop" changeParameter={changeParameter} data={data} value={searchParams['section'] || "allSects"}/>
      <div className="search-results section-results">{sectionResultsList}</div>
      <h2>Top Results</h2>
      <div className="search-results">{resultsList}</div>
    </div>
  );
}

export default App;
