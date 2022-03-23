
import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list:['A','B','C','D','E','F'],
    }
  }
  handleClick=()=>{
    this.setState({
      list:['A','C','E','B','G']
    })
  }
  render() {
    return (
     <React.Fragment>
       <ul>
         {
           this.state.list.map(item => <li key={item}>{item}</li>)
         }
       </ul>
       <button onClick={this.handleClick}>click</button>
     </React.Fragment>
    )
  }
}
ReactDOM.render(<Counter />, document.getElementById('root'));

/**
组件的生命周期
Counter 1.constructor
Counter 2.componentWillMount
Counter 3.render
ChildCounter 1.componentWillMount
ChildCounter 2.render 
ChildCounter 3.componentDidMount
Counter 4.componentDidMount
Counter 5.shouldComponentUpdate
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 4.UNSAFE_componentWillReceiveProps
ChildCounter 5.shouldComponentUpdate
Counter 7.componentDidUpdate
Counter 5.shouldComponentUpdate
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 6.componentWillUnmount 
Counter 7.componentDidUpdate
Counter 5.shouldComponentUpdate
Counter 5.shouldComponentUpdate
Counter 6.componentWillUpdate
Counter 3.render
ChildCounter 1.componentWillMount
ChildCounter 2.render 
ChildCounter 3.componentDidMount
Counter 7.componentDidUpdate
 */