import React, { useState, useEffect, Component } from 'react';
import LangDropdown from './components/LangDropdown';
import SearchBar from './components/SearchBar';
import axios from 'axios';
import Fuse from 'fuse.js';

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
		if (Array.isArray(json[hLang].sections)) //check if sections is an array 
		{
			json[hLang].sections.forEach( 
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

function App() {
	const [ data, setData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true); //Determines whether to show spinner
	const [ searchTerm, setSearchTerm ] = useState('');
	const [ searchResults, setSearchResults ] = useState([]);
	let resultsList = null; // the html string containing the search results

	const setSearch = (term) => { // Lets a child set the value of the search term
		setSearchTerm(term);
	};

	// fetches data the first time the page renders
	useEffect( 
		() => {
			async function fetchData() {
				setLoading(true);
				let result = await axios.get('https://raw.githubusercontent.com/FreeEbookFoundationBot/free-programming-books-json/main/fpb.json');
				setData(result.data);
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
			if(data){
				let result = [];
				data.children[0].children.forEach( (document) => {
					document.sections.forEach( (section) => {
						const fuseOptions = {
							findAllMatches: true, 
							shouldSort: false, 
							includeScore: true, 
							threshold: 0.3, 
							keys: ['title']
						};
						let fuse = new Fuse(section.entries, fuseOptions);
						let fuseResult = fuse.search(searchTerm);
						result = result.concat(fuseResult);
						section.subsections.forEach( (subsection) => {
							let fuse = new Fuse(subsection.entries, fuseOptions);
							let fuseResult = fuse.search(searchTerm);
							result = result.concat(fuseResult);
						});
					});
				});
				result = sortByScore(result);
				setSearchResults(result);
			}
		},
		[ searchTerm ]
	)

	const buildList = () => {

	};
	
	if(loading){ // if still fetching resource
		return(
			<h1>Loading...</h1>
		);
	}
	if(searchTerm && searchResults.length !== 0){
		resultsList =
			searchResults &&
			searchResults.map((entry) => {
				return (<li><a href={entry.item.url}>{entry.item.title}</a></li>)
			});
	}
	console.log(data);
	return(
		<div>
			<div id="frontPage">
				<h1>Free Programming Books</h1>
				{/* <input type="text"></input> */}
				<SearchBar setSearch={setSearch}/>
				<LangDropdown data={data}/>
				<SubmitButton/>
				<ol>
					{resultsList}
				</ol>
			</div>
		</div>
	);
}

 
export default App;