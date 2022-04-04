import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useParams } from "react-router-dom";
import rehypeSlug from 'rehype-slug'

function BookList({changeParameter, langCode}) {
  let [markdown, setMarkdown] = useState(null);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     changeParameter('lang.code', langCode);
//   }, [langCode]);
    

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let result = await axios.get(
          `https://raw.githubusercontent.com/EbookFoundation/free-programming-books/main/books/free-programming-books-${langCode}.md`
        );
        setMarkdown(result.data);
      } catch (e) {
        console.log("Couldn't get data. Please try again later")
      }
      setLoading(false);
    }
    fetchData();
  }, []);
  if(loading){
      return <p>Loading...</p>
  }
//   console.log(markdown);
  return <section><ReactMarkdown children={markdown} rehypePlugins={[rehypeSlug]} skipHtml={true} /></section>;
}

export default BookList;
