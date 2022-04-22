import React, { useState, useEffect } from "react";

function ParsedLink({ children, sect, props }) {
  const [folder, setFolder] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Splits the original link into the folder and file names
    // If there is only one entry then the folder is the root directory and the entry is the file
    let hrefSplit = props.href.split("/");

    if (hrefSplit.length === 2) {
      // Case when the
      // Some docs reference back to the root directory which would give the folder ".."
      // When that happens, skip setting the folder as it should stay null.
      if (hrefSplit[0] !== "..") {
        setFolder(hrefSplit[0]);
      }
      setFile(hrefSplit[1]);
    } else {
      // Only a file is given
      setFile(hrefSplit[0]);
      // When the current section is docs, all relative links stay in docs
      if (sect === "docs") {
        setFolder(sect);
      } else {
        setFolder(null);
      }
    }
  }, [props.href]);

  if (folder) {
    return <a href={`/?&sect=${folder}&file=${file}`}>{children}</a>;
  } else {
    return <a href={`/?file=${file}`}>{children}</a>;
  }
}

export default ParsedLink;
