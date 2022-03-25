import React, { useState, useEffect } from "react";

function LangDropdown({ changeParameter, data }) {
  const [languages, setLanguages] = useState([]);
  const [selected, setSelected] = useState("");
  let options = null;

  const handleChange = (e) => {
    changeParameter("lang.code", e.target.value);
    setSelected(e.target.value);
  };

  useEffect(
    // run whenever data changes
    () => {
      if (data) {
        let langArray = [];
        data.children[0].children.forEach((document) => {
          if (typeof document.language.name === "string" && document.language.name.length > 0) {
            //make sure the language is valid and not blank
            //console.log("LANGUAGE: " + document.language.name)
            if (document.language.code !== "en-US") {
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
          {/* {console.log(language)} */}
        </label>
      </div>
    );
  };

  options =
    languages &&
    languages.map((language) => {
      return createOption(language);
    });
  // console.log(options);
  return (
    <div>
      <h3>Select Language:</h3>
      <form class="filters">
        <label>
          <input type="radio" className="sect-select" value="" onChange={handleChange} checked={"" == selected} />
          All Languages
        </label>
        {options}
      </form>
    </div>
  );
}

export default LangDropdown;
