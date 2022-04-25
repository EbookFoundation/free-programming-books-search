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
        if (sect && file) {
          // Both sect and file exist so construct the URL with both parameters
          result = await axios.get(
            `https://raw.githubusercontent.com/EbookFoundation/free-programming-books/main/${sect}/${file}`
          );
        } else if (!sect && file) {
          // Occurs when getting a file from the root directory
          result = await axios.get(
            `https://raw.githubusercontent.com/EbookFoundation/free-programming-books/main/${file}`
          );
        } else {
          // Default to getting the README
          result = await axios.get(
            `https://raw.githubusercontent.com/EbookFoundation/free-programming-books/main/README.md`
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

  if (!markdown) {
    return <p>Error: Could not retrieve data.</p>;
  }

  return (
    <section>
      <ReactMarkdown
        children={markdown}
        remarkRehypeOptions={{ allowDangerousHtml: true }} // HTML is required for the all ids to be targetable
        rehypePlugins={[rehypeSlug, rehypeRaw]}
        components={{
          // Replaces relative links in a markdown file with a parsed version of the link
          // All other links are left untouched
          a({ className, children, href, id}) {
            if (href.startsWith("http") || href.charAt(0) === "#") {
              return (
                <a className={className} href={href} id={id}>
                  {children}
                </a>
              );
            }
            return <ParsedLink children={children} className={className} sect={sect} href={href} id={id}/>;
          },
        }}
      />
    </section>
  );
}

export default MarkdownParser;
