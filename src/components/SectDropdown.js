import React, { useState, useEffect } from "react";

function SectDropdown({ changeParameter, data, value}) {
  const [sections, setSections] = useState([]);
  let options = null;

  const handleChange = (e) => {
    changeParameter("section", e.target.value);
  };

  useEffect(
    // run whenever data changes
    () => {
      if (data) {
        let sectArray = [];
        data.children[0].children.forEach((document) => {
            // console.log(document)
          if (
            Array.isArray(document.sections) &&
            document.sections.length > 0
          ); {
            //   console.log(document.sections.length);
            //   console.log(Array.isArray(document.sections));
            for (let i = 0; i < document.sections.length; i++) {
                // console.log("h")
                // console.log(document.sections[i]);
                if(sectArray.indexOf(document.sections[i].section) == -1){
                    sectArray.push(document.sections[i].section.trim());
                }
                // sectArray.push(document.sections[i].section);
            }
          }
        })
        sectArray.sort((a, b) => a.localeCompare(b));
        setSections(sectArray);
      }
    },
    [data]
  );
// key={section} value={section}
  const createOption = (section) => {
    return (
      <option className="sect-drop" key={section} value={section}>
        {section}
      </option>
    );
  };

  options =
    sections &&
    sections.map((section) => {
      return createOption(section);
    });
  // console.log(options);
  return (
    <select value={value} className="sect-drop" onChange={handleChange} name="sections" id="sections">
      <option key="allSects" value="">
        Section Results
      </option>
      {options}
    </select>
  );
}

export default SectDropdown;
