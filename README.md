<h1 align="center">
free-programming-books-search
  </a>
</h1>

The 
free-programming-books-search is a companion project of [
free-programming-books](https://ebookfoundation.github.io/free-programming-books/). It allows users to search by book title or author and filter by language. 

## Contents
- [Installation](#installation)
- [Deployment](#deployment)

## Installation

### NPM Installation
	1. Make sure you have [Node.js](https://nodejs.org/en/) installed. If you already do, skip to [Running the Website](#running-the-website.)
	2. Otherwise, download the LTS installer from [Node.js](https://nodejs.org/en/) website.
	3. Follow the instructions of the installer, make sure npm is listed as a package to be installed.
	4. Click Install.
	5. Verify that Node.Js has been installed by going to command line and typing in `node`. It should show the current version.
	6. Close out of Node by either closing and reopening the command line or with Ctrl + C.
	7. Make sure to check out the [NPM website](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for more info.
### Running the Website
	1. Make sure you have [Git](https://git-scm.com/downloads) installed. 
	2. Clone the repo from Github with Git.
	3. Navigate to the folder using command line. (easy way is to type "cd" and then drag and drop the folder into command line)
	4. Type `npm install -g`
	5. Type `npm install react-scripts`
	6. Type `npm start`. At this point, the commnand prompt should start up the server, and a tab in your default browser should open up to localhost.

## Deployment
	1. First, make sure that you the local folder containing the files has a remote configured called "origin".
		a. If you aren't sure, navigate to the folder using Git (type "cd", then drag and drop folder in to Git command line.).
		b. Type `git init` 
		c. Type `git remote add origin <repo url>`,replacing <repo url> with the url of your github repository.
	2. Now, run `npm run deploy`.
	3. This should deploy your code to "https:<username>.github.io/free-programming-books-search/"
	