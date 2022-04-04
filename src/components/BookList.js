import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";

function BookList({ langCode }) {
  let [markdown, setMarkdown] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let result = await axios.get(
          `https://raw.githubusercontent.com/EbookFoundation/free-programming-books/main/books/free-programming-books-${langCode}.md`
        );
        setMarkdown(result.data);
      } catch (e) {
        console.log("Couldn't get data. Please try again later");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <ReactMarkdown
        children={markdown}
        remarkRehypeOptions={{ allowDangerousHtml: true }}
        rehypePlugins={[rehypeSlug, rehypeRaw]}
      />
    </section>
  );
}

export default BookList;
