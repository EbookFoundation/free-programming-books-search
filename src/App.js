import React, { useState, useEffect } from "react";
import axios from "axios";
import Fuse from "fuse.js";

import LangFilters from "./components/LangFilters";
import SectDropdown from "./components/SectDropdown";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";
import LightSwitch from "./components/LightSwitch";
import Default from "./components/Default";

import SunImg from "./img/sun.png";
import MoonImg from "./img/moon.png";

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
  const [searchParams, setSearchParams] = useState({ searchTerm: "" });
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
   // Finds most relevant title or author
  // THIS IS THE MAIN SEARCH FUNCTION
  useEffect(() => {
    if (dataArray) {
      const fuseOptions = {
        useExtendedSearch: true, // see fuse.js documentation
        findAllMatches: true, //continue searching after first match
        shouldSort: true, // sort by proximity score
        includeScore: true, // includes score in results
        threshold: 0.2, // threshold for fuzzy-search,
        keys: ["author", "title", "lang.code", "section"],
      };

      // create new fuse given the array of books and the fuse options from above
      let fuse = new Fuse(dataArray, fuseOptions);
      let andQuery = []; // for filters that MUST be matched, like language
      let orQuery = []; // filters where any may be matched, like author or title

      // for each search param
      for (const [key, value] of Object.entries(searchParams)) {
        if (value === null || value === "") continue;
        if (key === "lang.code" || key === "section") {
          // the '^' means it must be an exact match at the beginning
          // this is because lang.code and section are strict filters 
          andQuery.push({ [key]: `^${value}` });
        }
        if(key === "searchTerm") {
          orQuery.push({ "author": value});
          orQuery.push({ "title": value});
        }
      }
      // Nest the 'or' query inside the 'and' query
      // Necessary step, a quirk with fuse.js
      andQuery.push({$or: orQuery})
      // Perform the search
      let result = fuse.search({
        $and: andQuery,
      });
      // filter to top results
      result = result.slice(0, 40);

      // Goes through the list of results
      let relevantLists = [];
      result.forEach((entry) => {
        // Checks if a new entry has already been made with the given programming language and human language.
        let obj = relevantLists.find(
          (o) => o.item.section === entry.item.section && o.item.lang.code === entry.item.lang.code
        );
        if (!obj && entry.item.lang.code) {
          let langCode = entry.item.lang.code;
          let section = entry.item.subsection ? entry.item.subsection : entry.item.section;
          // English is split into the subjects and langs file. The parser flags which type of entry it is to use here
          if (langCode === "en") {
            if (entry.item.lang.isSubject) {
              langCode = "subjects";
            } else {
              langCode = "langs";
            }
          }

          let id = section;
          
          // Some ids are in HTML tags, so this will extract that id to form proper links
          if (id.includes("<a")) {
            let x = id.match(/"(.*?)"/)[0];
            id = x ? x.replaceAll(/\"/g, "") : "FAIL";
            section = id;
          }

          // List of id properties fixed with this line:
          // 1. Must be all lowercase
          // 2. Spaces are hyphens
          // 3. Parentheses, ampersands, and slashes aren't allowed at all
          id = id
            .toLowerCase()
            .replaceAll(" ", "-")
            .replaceAll(/\(|\)|\&|\/|\./g, "");

          // Creates a listing for the broader list of entries
          let listing = {
            item: {
              author: "",
              lang: entry.item.lang,
              section: entry.item.section,
              title: `List of all ${section} resources in ${entry.item.lang.name}`,
              url: `https://ebookfoundation.github.io/free-programming-books/books/free-programming-books-${langCode}.html#${id}`,
            },
          };

          relevantLists.push(listing);
        }
      });
      // Keep only the first 5 as more than that became cumbersome with broad searches
      relevantLists = relevantLists.slice(0, 5);
      result = relevantLists.concat(result);
      setSearchResults(result);
      // console.log(result);

      // No longer needed as the sections aren't being used
      // let sResults = []; // section results
      // // Finds the most relevant sections
      // result.forEach((entry) => {
      //   let section = entry.item.section;
      //   if (!sResults.includes(section)) sResults.push(section);
      // });
      // setSectionResults(sResults);
    }
  }, [searchParams, dataArray]);

  if (loading) {
    // if still fetching resource
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>Error: {error}</h1>;
  }
  if (searchParams.searchTerm && searchResults.length !== 0) {
    resultsList =
      searchResults &&
      searchResults.map((entry) => {
        return <SearchResult data={entry.item} />;
      });
    // Getting rid of the section results UI renders this irrelevant
    // sectionResultsList =
    //   sectionResults &&
    //   sectionResults.map((section) => {
    //     return (
    //       <button
    //         onClick={() => {
    //           changeParameter("section", section);
    //         }}
    //       >
    //         {section}
    //       </button>
    //     );
    //   });
  }
  return (
    <div className="wrapper">
      <header className="header">
        <h1>
          <a href="https://ebookfoundation.github.io/free-programming-books/" target="_blank" rel="noreferrer">
            free-programming-books
          </a>
        </h1>

        <p>
          <img
            className="emoji"
            title=":books:"
            alt=":books:"
            src="https://github.githubassets.com/images/icons/emoji/unicode/1f4da.png"
            height="20"
            width="20"
          />{" "}
          Freely available programming books
        </p>

        <p className="view">
          <a href="https://github.com/EbookFoundation/free-programming-books" target="_blank" rel="noreferrer">
            View the Project on GitHub <small>EbookFoundation/free-programming-books</small>
          </a>
        </p>
        <p>
          Does a link not work?
          <br />
          <a href="https://github.com/EbookFoundation/free-programming-books/issues/" target="_blank" rel="noreferrer">
            Report an error on GitHub
          </a>
        </p>

        <div>
          <SearchBar changeParameter={changeParameter} />
          {/* Filters */}
          <LangFilters changeParameter={changeParameter} data={data} />
          {/* Keeping sections commented out just in case */}
          {/* <SectDropdown
            className="sect-drop"
            changeParameter={changeParameter}
            data={data}
            value={searchParams["section"] || "allSects"}
          /> */}
          {/* {sectionResultsList && <h3>Suggestions based on your search</h3>}
          <div className="search-results section-results">{sectionResultsList}</div> */}
        </div>
      </header>

      <section className="search-results">
        {resultsList ? (
          <div>
            <br />
            <h2>Search Results</h2>
            <ul>{resultsList}</ul>
          </div>
        ) : searchParams.searchTerm ? (
          <div>
            <br />
            <h2>No results found.</h2>
          </div>
        ) : (
          <Default />
        )}
      </section>

      <footer>
        <p>
          This project is maintained by{" "}
          <a href="https://github.com/EbookFoundation" target="_blank" rel="noreferrer">
            EbookFoundation
          </a>
        </p>
        <p>
          <small>
            Hosted on GitHub Pages — Theme by{" "}
            <a href="https://github.com/orderedlist" target="_blank" rel="noreferrer">
              orderedlist
            </a>
          </small>
        </p>
      </footer>
    </div>
  );
}

export default App;
