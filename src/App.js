import React, { useState, useEffect, Component } from 'react';
import LangDropdown from './components/LangDropdown';
import axios from 'axios';

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

function App() {
	const [ data, setData ] = useState(undefined);
	const [ loading, setLoading ] = useState(true); //Determines whether to show spinner

	useEffect( // runs the first time the page renders
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

	if(loading){ //still fetching resource
		return(
			<h1>Loading...</h1>
		);
	}
	else{ // resource fetched
		console.log(data);
		return(
			<div>
				<div id="frontPage">
					<h1>Free Programming Books</h1>
					<input type="text"></input>
					<LangDropdown data={data}/>
					<SubmitButton/>
				</div>
			</div>
		);
	}
}

 
export default App;