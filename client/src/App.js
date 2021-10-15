import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter, BrowserRouter as Router, Link } from 'react-router-dom';
import Logintbygoogle from './components/Logintbygoogle/Logintbygoogle'
import Dashboard from "./components/Dashboard/Dashboard"; 
import { GApiProvider } from 'react-gapi-auth2';
import './App.css';

import Home from "./containers/Home/Home";
import Logging from "./components/Logging/Logging";

class App extends Component {
  state={
    token: ""
  }

  componentDidMount () {
    const t = localStorage.getItem("token");
    this.setState({
      token: t
    })
  }

  render(){
    const t = localStorage.getItem("token");
    let routes =  (
      <Switch>
        {/* <Route path="/Logging" exact component={Logging}/> */}
        <Route path="/Logging" exact render={() => <Logging checked={() => this.componentDidMount()}/>} />
        <Redirect from="/" to="/Logging" />
      </Switch>
    );
    if(this.state.token || t){
      routes =  (
        <Switch>
          {/* <Route path="/Home" exact component={Home}/> */}
          <Route path="/Home" exact render={() => <Home checked={() => this.componentDidMount()}/>} />
          <Redirect from="/" to="/Home" />
          <Route path='/Dashboard' component={Dashboard} ></Route>  
        </Switch>
      );
    }
    return (
      <div className="App">
        {routes}   
      </div>
    );
  }
}

export default withRouter(App);
