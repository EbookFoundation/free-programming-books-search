import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useParams } from "react-router-dom";
import rehypeSlug from 'rehype-slug'

function BookList({changeParameter}) {
  let [markdown, setMarkdown] = useState(null);
  const [loading, setLoading] = useState(true);
  let params = useParams();

  useEffect(() => {
    changeParameter('lang.code', params.lang);
  }, [params.lang]);
    

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let result = await axios.get(
          `https://raw.githubusercontent.com/EbookFoundation/free-programming-books/main/books/free-programming-books-${params.lang}.md`
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
  console.log(markdown);
  return <section><ReactMarkdown children={markdown} rehypePlugins={[rehypeSlug]} /></section>;
}

export default BookList;
