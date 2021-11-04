import React, { Component } from 'react';
 
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        message: "Default Content"
    }
  }
 
  updateContent = () => {
    if (this.state.message == "Default Content") {
      this.setState({ message: "Updated Content!"});
    }
    else {
      this.setState({ message: "Default Content"});
    }
  }
 
  render() {
    return (
      <div>
        <div className="h1 bg-secondary text-white text-center p-2">
          { this.state.message }
        </div>
        <div className="text-center">
          <button className="btn btn-secondary" onClick={this.updateContent}>
            Click Me
          </button>
        </div>
      </div>
    );
  }
}
 
export default App;