import React, { useState, useEffect } from "react";

function ParsedLink({ children, sect, href, id }) {
  const appContextPath = process.env.PUBLIC_URL + "/";
  const [folder, setFolder] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Splits the original link into the folder and file names
    // If there is only one entry then the folder is the root directory and the entry is the file
    let hrefSplit = href.split("/");

    if (hrefSplit.length === 2) {
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
  }, [href]);

  if (folder && file) {
    return <a id={id} href={`${appContextPath}?&sect=${folder}&file=${file}`}>{children}</a>;
  } else if (file) {
    return <a id={id} href={`${appContextPath}?file=${file}`}>{children}</a>;
  } else { // Go to the homepage when there's a bad relative URL
    return <a id={id} href={`${appContextPath}`}>{children}</a>
  }
}

export default ParsedLink;
