import React, { useState, useEffect } from "react";

function SectDropdown({ changeParameter, data, value }) {
  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState("");
  let options = null;

  const handleChange = (e) => {
    changeParameter("section", e.target.value);
    setSelected(e.target.value);
  };

  useEffect(
    // run whenever data changes
    () => {
      if (data) {
        let sectArray = [];
        data.children[0].children.forEach((document) => {
          // console.log(document)
          if (Array.isArray(document.sections) && document.sections.length > 0);
          {
            //   console.log(document.sections.length);
            //   console.log(Array.isArray(document.sections));
            for (let i = 0; i < document.sections.length; i++) {
              // console.log("h")
              // console.log(document.sections[i]);
              if (sectArray.indexOf(document.sections[i].section) === -1) {
                sectArray.push(document.sections[i].section.trim());
              }
              // sectArray.push(document.sections[i].section);
            }
          }
        });
        sectArray.sort((a, b) => a.localeCompare(b));
        setSections(sectArray);
      }
    },
    [data]
  );
  // key={section} value={section}
  const createOption = (section) => {
    return (
      <div>
        <label>
          <input
            type="radio"
            className="sect-select"
            key={section}
            value={section}
            onChange={handleChange}
            checked={section === selected}
          />
          {section}
        </label>
      </div>
    );
  };

  options =
    sections &&
    sections.map((section) => {
      return createOption(section);
    });
  // console.log(options);
  return (
    <div>
      <h3>Select Programming Language:</h3>
      <form class="filters">
        <label>
          <input type="radio" className="sect-select" value="" onChange={handleChange} checked={"" === selected} />
          All Programming Languages
        </label>
        {options}
      </form>
    </div>
  );
}

export default SectDropdown;
