# free-programming-books-search

The free-programming-books-search is a companion project of [free-programming-books](https://ebookfoundation.github.io/free-programming-books/). It allows users to search by book title or author and filter by language. The search index is updated once per day, so changes made on [free-programming-books](https://ebookfoundation.github.io/free-programming-books/) may not be immediately reflected.

## Contents

- [Contents](#contents)
- [How It All Works](#how-it-all-works)
- [Installation](#installation)
	- [NPM Installation](#npm-installation)
	- [Running the Website](#running-the-website)
- [Deployment](#deployment)
- [FAQ](#faq)

## How It All Works

1. THERE IS NO DATABASE INVOLVED. Rather, the books are stored in a markdown on [free-programming-books](https://ebookfoundation.github.io/free-programming-books/) and is parsed daily by [free-programming-books-parser](https://github.com/EbookFoundation/free-programming-books-parser). The books and all info pertaining to them are stored in a JSON file called `fpb.json`.

2. This JSON is downloaded locally and searched locally when the actual search function is used.

## Installation

### NPM Installation

1. Make sure you have [Node.js](https://nodejs.org/en/) installed. If you already do, skip to [Running the Website](#running-the-website).
2. Otherwise, download the LTS installer from [Node.js](https://nodejs.org/en/) website.
3. Follow the instructions of the installer, make sure npm is listed as a package to be installed.
4. Click Install.
5. Verify that Node.Js has been installed by going to command line and typing in `node`. It should show the current version.
6. Close out of Node by either closing and reopening the command line or with <kbd>Ctrl + C</kbd>.
7. Make sure to check out the [NPM website](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for more info.

### Running the Website

1. Make sure you have [Git](https://git-scm.com/downloads) installed.
2. Clone the repo from Github with Git.
3. Navigate to the folder using command line. A easy way is to type "`cd`" and then drag and drop the folder into command line.
4. Type `npm install`.
5. Type `npm install react-scripts`.
6. Type `npm start`. At this point, the command prompt should start up the server, and a tab in your default browser should open up to localhost.

#### Serving the production build locally

Type `npm run serve` if you want run the optimized production build in a local server.

At this point, the command prompt should build the app and start up the server.

Open a tab in your default browser and go to `http://localhost:3000`.

## Deployment

MAKE SURE YOU HAVE COMPLETED THE INSTALLATION STEPS FIRST!

1. First, make sure that you the local folder containing the files has a remote configured called "`origin`".
	1. If you aren't sure, navigate to the folder using Git (type "`cd`", then drag and drop folder in to Git command line).
	2. Type `git init`.
	3. Type `git remote add origin <repo url>`, replacing `<repo url>` with the url of your github repository.
2. Now, run `npm install -g gh-pages`.
3. Run `npm run deploy`.
4. This should deploy your code to "`https://yourusername.github.io/free-programming-books-search/`".

## FAQ

- What database are we using to store the books?
	- NONE! The books are stored in a JSON file which is downloaded locally.

- I added a book but it's not showing up on search?
	- Give it some time. The parser is run once a day, so it may take up to 24 hours for the search to reflect that.
