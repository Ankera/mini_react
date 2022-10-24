import React from 'react';

export default class Counter extends React.Component {
  state = {
    number: 0
  }

  handleClick = () => {
    debugger;
    this.setState({ number: this.state.number + 1 });
    console.log('setState1', this.state.number);
    this.setState({ number: this.state.number + 1 });
    console.log('setState2', this.state.number);

    // setTimeout(() => {
    //   this.setState({ number: this.state.number + 1 });
    //   console.log('setState3', this.state.number);
    //   this.setState({ number: this.state.number + 1 });
    //   console.log('setState4', this.state.number);
    // });
  }

  render () {
    return (
      <div>
        <h1>{this.state.number}</h1>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}