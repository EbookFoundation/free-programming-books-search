import React, { useEffect, useState } from "react";
import axios from "axios";

import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";

import ParsedLink from "./ParsedLink";

function MarkdownParser({ file, sect }) {
  let [markdown, setMarkdown] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // console.log({sect: sect, file: file});
        setLoading(true);
        let result = null;
        if (!sect && !file) { // Default to getting the README
          result = await axios.get( 
            `https://raw.githubusercontent.com/EbookFoundation/free-programming-books/main/README.md`
          );
        } else if (!sect && file) { // Should only occur when getting a file in root directory
          result = await axios.get( 
            `https://raw.githubusercontent.com/EbookFoundation/free-programming-books/main/${file}`
          );
        } else {
          result = await axios.get( // Both sect and file exist so construct a full URL
            `https://raw.githubusercontent.com/EbookFoundation/free-programming-books/main/${sect}/${file}`
          );
        }

        setMarkdown(result.data);
      } catch (e) {
        console.log("Couldn't get data. Please try again later");
      }
      setLoading(false);
    }
    fetchData();
  }, [file, sect]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!sect || sect === "docs") {
    return (
      <section>
        <ReactMarkdown
          children={markdown}
          remarkRehypeOptions={{ allowDangerousHtml: true }} // HTML is required for the all ids to be properly applied
          rehypePlugins={[rehypeSlug, rehypeRaw]}
          components={{
            a({ node, inline, className, children, ...props }) {
              if (props.href.startsWith("http") || props.href.charAt(0) === '#') {
                return (
                  <a className={className} {...props}>
                    {children}
                  </a>
                );
              }
              return <ParsedLink children={children} className={className} sect={sect} props={props} />;
            },
          }}
        />
      </section>
    );
  }

  return (
    <section>
      <ReactMarkdown
        children={markdown}
        remarkRehypeOptions={{ allowDangerousHtml: true }} // HTML is required for the all ids to be properly applied
        rehypePlugins={[rehypeSlug, rehypeRaw]}
      />
    </section>
  );
}

export default MarkdownParser;
