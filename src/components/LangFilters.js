import { useState, useEffect } from "react";
const queryString = require("query-string");

function LangFilters({ changeParameter, data, langCode }) {
  const [languages, setLanguages] = useState([]);
  const [selected, setSelected] = useState(langCode);
  const [showFilters, setShow] = useState(false);
  let options = null;

  const handleChange = (e) => {
    changeParameter("lang.code", e.target.value);
    setSelected(e.target.value);
  };

  useEffect(() => {
    let queries = queryString.parse(document.location.search);
    if (queries.lang) {
      if (queries.lang == "langs" || queries.lang == "subjects") {
        changeParameter("lang.code", "en");
        setSelected("en");
      } else {
        changeParameter("lang.code", queries.lang);
        setSelected(queries.lang);
      }
    }
  }, []);

  useEffect(
    // run whenever data changes
    () => {
      if (data) {
        let langArray = [{ code: "en", name: "English" }];
        data.children[0].children.forEach((document) => {
          if (typeof document.language.name === "string" && document.language.name.length > 0) {
            //make sure the language is valid and not blank
            //console.log("LANGUAGE: " + document.language.name)
            if (document.language.code !== "en") {
              // used to ensure only one English is listed
              langArray.push(document.language);
            }
          }
        });
        langArray.sort((a, b) => a.name > b.name);
        setLanguages(langArray);
      }
    },
    [data]
  );

  const createOption = (language) => {
    return (
      <div>
        <label>
          <input
            type="radio"
            className="lang"
            key={language.code}
            value={language.code}
            onChange={handleChange}
            checked={language.code == selected}
          />
          {language.name}
        </label>
      </div>
    );
  };

  options =
    languages &&
    languages.map((language) => {
      return createOption(language);
    });

  let filterList = (
    <form className="filters">
      <label>
        <input
          type="radio"
          key="all"
          className="sect-select"
          value=""
          onChange={handleChange}
          checked={"" == selected}
        />
        All Languages
      </label>
      {options}
    </form>
  );

  return (
    <div className="langFilters">
      <div className="filterHeader">
        <h3>Filter by Language</h3>
        <button onClick={() => setShow(!showFilters)}>{showFilters ? "-" : "+"}</button>
      </div>
      {showFilters ? filterList : ""}
    </div>
  );
}

export default LangFilters;
