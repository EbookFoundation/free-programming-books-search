import React, { useState, useEffect, Component } from 'react';
import LangDropdown from './components/LangDropdown';
import SearchBar from './components/SearchBar';
import SearchResult from './components/SearchResult';
import axios from 'axios';
import Fuse from 'fuse.js';

const fpb = require('./fpb.json');

function makeBook(author, hLang, cLang, title, url)
{
	//returns a struct with basic book info (author, human language, computer language, book title, url)
	return {'author': author,
			'hLang': hLang, //human language
			'cLang': cLang, //computer language
			'title': title,
			'url': url
			}
}

function forEachBook(func, json) //Runs func on each section, entry, and book in json, which is a list of entries
{
	if (typeof func !== 'function')
	{
		throw "ERROR in forEachBook: parameter not a fucntion"
	}
	
	for (const hLang in json) //for each human language
	{
		if (Array.isArray(hLang.sections)) //check if sections is an array 
		{
			hLang.sections.forEach( 
			(cLang) => //for each computer lanuage
				{if (Array.isArray(cLang.entries)) //verify is entries is an array
					{
						cLang.entries.forEach( 
						(book) =>  //for each book
							{if (typeof book === "object") //verify that book is an object
								{
									func(json[hLang],cLang,book) //run the function
								}}
						)
					}}
			)
		}
	}
	
}

function searchByLanguage(lang, json)
{
	let answer =[] //list of books to return
	for (const obj in json)
	{
			/*obj.sections.forEach((section) => section.forEach((entry) => entry.forEach((book) => answer.push(makeBook(book.author,lang,section.section,book.title,book.url)))))*/
			
		forEachBook((hLang,cLang,book) => {
			if (hLang.language !== undefined && hLang.language.name !== undefined && hLang.language.name.toLowerCase() === lang.toLowerCase())
			{
			answer.push(makeBook(book.author,hLang.language.name,cLang.section,book.title,book.url))
			}
				},json)
}
	console.log(answer)
}

class SubmitButton extends Component{
	constructor(props)
	{
		super(props);
	}
	async click()
	{
		let result = await fetch('https://raw.githubusercontent.com/FreeEbookFoundationBot/free-programming-books-json/main/fpb.json')
		if (result.ok)
		{
			let json = await result.json();
			console.log(json.children[0])
			searchByLanguage("Arabic",json.children[0].children)
		}
		else
		{
			console.log("ERROR in fetching json: " + result.status.toString() + " " + result.statusText)
		}

	}
	render()
	{
		return (
			<button onClick = {this.click}>Submit</button>
		)
	}
}

// Sorts search results by their score
function sortByScore(results){
	results.sort(function(a,b){
		return a.score - b.score;
	});
	return results;
}


function jsonToArray(json){
	let arr = [];
	let sections = [];
	json.children[0].children.forEach(
		(document) => {
			document.sections.forEach(
				(section) => {
					if(!sections.includes(section.section))
						sections.push(section.section);
					section.entries.forEach(
						(entry) => {
							arr.push({author: entry.author, title: entry.title, url: entry.url, lang: document.language, section: section.section});
						}
					)
					section.subsections.forEach(
						(subsection) => {
							subsection.entries.forEach(
								(entry) => {
									arr.push({author: entry.author, title: entry.title, url: entry.url, lang: document.language, section: section.section, subsection: subsection.section});
								}
							)
						}
					)
				}
			)
		}
	)
	return {arr: arr, sections: sections};
}

function App() {
	const [ data, setData ] = useState(undefined); // keeps the state of the json
	const [ dataArray, setDataArray ] = useState([]); // put everything into one array. uses more memory, but search is faster and less complex
	const [ index, setIndex ] = useState([]);
	const [ loading, setLoading ] = useState(true); //Determines whether to show spinner
	const [ searchParams, setSearchParams ] = useState({title: ''});
	const [ searchResults, setSearchResults ] = useState([]);
	const [ error, setError ] = useState('');

	let resultsList = null; // the html string containing the search results
	let sectionResults = null;

	const changeParameter = (param, value) => { // Lets a child set the value of the search term
		setSearchParams({...searchParams, [param]: value});
	};

	// fetches data the first time the page renders
	useEffect( 
		() => {
			async function fetchData() {
				try{
					setLoading(true);
					let result = await axios.get('https://raw.githubusercontent.com/FreeEbookFoundationBot/free-programming-books-json/main/fpb.json');
					setData(result.data);
					let { arr, sections } = jsonToArray(result.data);
					setDataArray(arr);
					setIndex(sections);
				}
				catch(e){
					// setError("Couldn't get data. Please try again later")
					setData(fpb);
					let { arr, sections } = jsonToArray(fpb);
					setIndex(sections);
					setDataArray(arr);
				}
				setLoading(false);
			}
			fetchData();
		},
		[]
	);
	
	// fires when searchTerm changes
	// THIS IS THE MAIN SEARCH FUNCTION CURRENTLY
	useEffect(
		() => {
			if(dataArray){
				const fuseOptions = {
					useExtendedSearch: true,
					findAllMatches: true, 
					shouldSort: true, 
					includeScore: true, 
					threshold: 0.2, 
					keys: ['title', 'lang.code']
				}
				
				let fuse = new Fuse(dataArray, fuseOptions);
				let query = [];
				for (const [key, value] of Object.entries(searchParams)) {
					if(value == null || value == '') continue;
					if(key == 'lang.code'){
						query.push({'lang.code': `^${value}`});
						continue
					}
					query.push({[key]: value});
				}
				let result = fuse.search({
					$and: query
				});
				setSearchResults(result.slice(0, 40));
			}
		},
		[ searchParams ]
	)

	if(loading){ // if still fetching resource
		return(
			<h1>Loading...</h1>
		);
	}
	if(error){
		return(
			<h1>Error: {error}</h1>
		)
	}
	if(searchParams.title && searchResults.length !== 0){
		resultsList =
			searchResults &&
			searchResults.map((entry) => {
				return <SearchResult data={entry.item}/>
				// return (<li><a href={entry.item.url}>{entry.item.title}</a></li>)
			});
	}
	return(
		<div className="frontPage">
			<h1>Free Programming Books</h1>
			<div>
				<SearchBar changeParameter={changeParameter}/>
				<LangDropdown changeParameter={changeParameter} data={data}/>
			</div>
			<h2>Section Results</h2>
			<div className="search-results">
				{sectionResults}
			</div>
			<h2>Top Results</h2>
			<div className="search-results">
				{resultsList}
			</div>
		</div>
	);
}

 
export default App;