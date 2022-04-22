import React, { useState, useEffect } from "react";
import LangFilters from "./components/LangFilters";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";
import axios from "axios";
import Fuse from "fuse.js";
import { ThemeContext, themes, swapMode } from "./darkMode";
import { useCookies } from "react-cookie";

import Default from "./components/Default";

import SunImg from "./img/sun.png";
import MoonImg from "./img/moon.png";
import MarkdownParser from "./components/MarkdownParser";
const queryString = require("query-string");


function jsonToArray(json) {
  // list of all books
  let arr = [];
  // list of all topics (sections)
  let sections = [];
  // for each markdown document
  for (let i = 0; i < json.children.length; i++) {
    json.children[i].children.forEach((document) => {
      // for each topic in the markdown
      // these are typically h2 and h3 tags in the markdown
      document.sections.forEach((section) => {
        // Add section to master list if it's not there
        if (!sections.includes(section.section)) sections.push(section.section);
        // Add new entries that were under an h2 tag
        section.entries.forEach((entry) => {
          arr.push({
            author: entry.author,
            title: entry.title,
            url: entry.url,
            lang: document.language,
            section: section.section,
          });
        });
        // Add new entries that were under an h3 tag
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
  }
  return { arr: arr, sections: sections };
}

function App() {
  // keeps the state of the json
  const [data, setData] = useState(undefined); 
  // put all books into one array. uses more memory, but search is faster and less complex
  const [dataArray, setDataArray] = useState([]);
  // Keeps track if all resources are loaded
  const [loading, setLoading] = useState(true);
  // State keeping track of all search parameters
  // use the changeParameter function to set, NOT setSearchParams
  // changeParameter will retain the rest of the state
  let defaultSearch = queryString.parse(document.location.search).search || "";
  const [searchParams, setSearchParams] = useState({ searchTerm: defaultSearch, "lang.code": "" });
  // array of all search results
  const [searchResults, setSearchResults] = useState([]);
  // array of the topics the search results fall under
  const [sectionResults, setSectionResults] = useState([]);
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(["lightMode"]);
  const [queries, setQueries] = useState({ lang: "", subject: "" });

  // eslint-disable-next-line
  const [error, setError] = useState("");

  let resultsList = null; // the html string containing the search results

  // Used to change the search parameters state
  // Heavily used in child components to set the state 
  const changeParameter = (param, value) => {
    setSearchParams({ ...searchParams, [param]: value });
  };

  // fetches data the first time the page renders
  useEffect(() => {  
    swapMode(cookies.lightMode ? themes.lightMode : themes.darkMode);
    async function fetchData() {
      try {
        setQueries(queryString.parse(document.location.search));
    if (queries.lang) {
      if (queries.lang === "langs" || queries.lang === "subjects") {
        changeParameter("lang.code", "en");
      } else {
        changeParameter("lang.code", queries.lang);
      }
    }
        // setLoading(true);
        let result = await axios.get(
          "https://raw.githubusercontent.com/EbookFoundation/free-programming-books-search/main/fpb.json"
        );
        setData(result.data);
        // eslint-disable-next-line
        let { arr, sections } = jsonToArray(result.data);
        setDataArray(arr);
      } catch (e) {
        setError("Couldn't get data. Please try again later")
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
        includeMatches: true,
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
        if (key === "searchTerm") {
          orQuery.push({ author: value });
          orQuery.push({ title: value });
        }
      }
      // Nest the 'or' query inside the 'and' query
      // Necessary step, a quirk with fuse.js
      andQuery.push({ $or: orQuery });
      // Perform the search
      let result = fuse.search({
        $and: andQuery,
      });
      // filter to top results
      result = result.slice(0, 40);
      // console.log(result)

      // Goes through the list of results
      // let relevantLists = [];
      // result.forEach((entry) => {
      //   // Checks if a new entry has already been made with the given programming language and human language.
      //   let obj = relevantLists.find(
      //     (o) => o.item.section === entry.item.section && o.item.lang.code === entry.item.lang.code
      //   );
      //   if (!obj && entry.item.lang.code) {
      //     let langCode = entry.item.lang.code;
      //     let section = entry.item.subsection ? entry.item.subsection : entry.item.section;
      //     // English is split into the subjects and langs file. The parser flags which type of entry it is to use here
      //     if (langCode === "en") {
      //       if (entry.item.lang.isSubject) {
      //         langCode = "subjects";
      //       } else {
      //         langCode = "langs";
      //       }
      //     }

      //     // Consider moving function out of here
      //     let id = section;

      //     // Some ids are in HTML tags, so this will extract that id to form proper links
      //     if (id.includes("<a")) {
      //       let x = id.match(/"(.*?)"/)[0];
      //       id = x ? x.replaceAll(/\"/g, "") : "FAIL";
      //       section = id;
      //     }

      //     // List of id properties fixed with this line:
      //     // 1. Must be all lowercase
      //     // 2. Spaces are hyphens
      //     // 3. Parentheses, ampersands, and slashes aren't allowed at all
      //     id = id
      //       .toLowerCase()
      //       .replaceAll(" ", "-")
      //       .replaceAll(/\(|\)|\&|\/|\./g, "");

      //     // Creates a listing for the broader list of entries
      //     let listing = {
      //       item: {
      //         author: "",
      //         lang: entry.item.lang,
      //         section: entry.item.section,
      //         title: `List of all ${section} books in ${entry.item.lang.name}`,
      //         url: `/free-programming-books-search?sect=books&lang=${langCode}&file=free-programming-books-${langCode}#${section}`,
      //         samePage: true,
      //       },
      //     };

      //     relevantLists.push(listing);
      //   }
      // });
      // // Keep only the first 5 as more than that became cumbersome with broad searches
      // relevantLists = relevantLists.slice(0, 5);
      // result = relevantLists.concat(result);
      setSearchResults(result);
      // console.log(result);
    }
  }, [searchParams, dataArray]);

  // if (loading) {
  //   // if still fetching resource
  //   return <h1>Loading...</h1>;
  // }
  if (error) {
    return <h1>Error: {error}</h1>;
  }
  if (searchParams.searchTerm && searchResults.length !== 0) {
    resultsList =
      searchResults &&
      searchResults.map((entry) => {
        return <SearchResult data={entry.item} />;
      });
  }

  return (
    <div className="wrapper">
      <ThemeContext.Consumer>
        {({ changeTheme }) => {
          let willBeDarkMode = cookies.lightMode && cookies.lightMode.toLowerCase() !== "true"; //whether or not we are currently light mode and will become dark mode
          changeTheme(willBeDarkMode ? themes.light : themes.dark);
          return (
            <img
              alt="Toggle light/dark mode"
              src={willBeDarkMode ? MoonImg : SunImg}
              onClick={() => {
                setCookie("lightMode", willBeDarkMode);
                changeTheme(willBeDarkMode ? themes.light : themes.dark);
              }}
              style={{ width: "20px", height: "20px", display: "block", marginLeft: "auto" }}
            />
          );
        }}
      </ThemeContext.Consumer>
      <header className="header">
        <h1>
          <a href="/free-programming-books-search/">free-programming-books</a>
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
          {loading ? (
            <p />
          ) : (
            <div>
              <SearchBar changeParameter={changeParameter} defaultTerm={searchParams.searchTerm} />{" "}
              <LangFilters changeParameter={changeParameter} data={data} langCode={searchParams["lang.code"]} />{" "}
            </div>
          )}
        </div>
      </header>

      <section className="search-results">
        {loading ? (
          <p>Loading</p>
        ) : resultsList ? (
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
        ) : 
          <MarkdownParser file={queries.file} sect={queries.sect} />
        }
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
