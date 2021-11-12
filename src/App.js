import React, { Component } from 'react';
const axios = require('axios');
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        message: "Default Content"
    }
  }

  asyncCall = async () => {
    return axios.get('https://raw.githubusercontent.com/Senior-Design-2021-Ebook-Team/markdown-parser/main/fpb.json');
  }
 
  render() {
    console.log(this.asyncCall());
    return (
      <div>
        <div id="frontPage">
          <h1>Free Programming Books</h1>
          <input type="text"></input>
        </div>
      </div>
    );
  }
}
 
export default App;