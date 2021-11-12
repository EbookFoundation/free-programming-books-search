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

  updateContent = () => {
    if (this.state.message === "Default Content") {
      this.setState({ message: "Updated Content!"});
    }
    else {
      this.setState({ message: "Default Content"});
    }
  }
 
  render() {
    console.log(this.asyncCall());
    return (
      <div>
        <div className="h1 bg-secondary text-white text-center p-2">
          { this.state.message }
        </div>
        <div className="text-center">
          <button className="btn btn-secondary" onClick={this.updateContent}>
            Click me
          </button>
        </div>
      </div>
    );
  }
}
 
export default App;