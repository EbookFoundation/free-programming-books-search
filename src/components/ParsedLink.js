import React, { useState, useEffect } from "react";

function ParsedLink({ node, children, className, sect, props }) {
  const [folder, setFolder] = useState();
  const [file, setFile] = useState();

  useEffect(() => {
    let hrefSplit = props.href.split("/");

    if (hrefSplit.length == 2) {
      setFolder(hrefSplit[0]);
      const fileName = hrefSplit[1].split(".")[0];
      setFile(fileName);
    } else {
      setFile(hrefSplit[0].split(".")[0]);
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
