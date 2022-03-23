import React from "react";
import ReactDOM from "react-dom";


function FunctionComponent(props) {

  let element = < h1 className = 'title'
  style = {{ color: 'red'}} >
    {props.msg}-{props.age} < span > world </span> 
    </h1>
  return element;
}

let element = <FunctionComponent msg='message' age={12} />;

class ClassComponent extends React.Component{

  render(){
    let renderVdom = < h1 className = 'title'
        style = {{ color: 'red'}} >
    {this.props.msg}-{this.props.age} < span > world </span> 
    </h1>
    return renderVdom;
  }
}
let classElement = <ClassComponent msg='message' age={12} />
ReactDOM.render(classElement, document.getElementById('root'))
