import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter} from 'react-router-dom';
import './App.css';

import Home from "./containers/Home/Home";
import Logging from "./components/Logging/Logging";
import Hour from "./components/Hours/Hours";

class App extends Component {
  state={
    token: "",
    googleSignedIn: false,
    path: ""
  }

  componentDidMount () {
    const t = localStorage.getItem("token");
    const g = localStorage.getItem("google");
    this.setState({
      token: t,
      googleSignedIn: g,
      path: this.props.location.pathname
    })
  }

  render(){
    const g = localStorage.getItem("google");
    const t = localStorage.getItem("token");
    console.log(this.props.location.pathname);
    console.log(this.state.path);
    // console.log(this.props);
    // if(this.props.location.pathname === "/Home" && this.state.path === "/Hour"){
    //   this.props.history.goBack();
    // }
    let routes =  (
      <Switch>
        <Route path="/Logging" exact={true} render={() => <Logging checked={() => this.componentDidMount()}/>} />
        <Redirect from="/" to="/Logging" />
      </Switch>
    );
    if(t && g){
          routes =  (
            <Switch>
              <Route exact path="/Hour" render={() => <Hour checked={() => this.componentDidMount()}/>} />
              <Route exact path="/Home" render={() => <Home checked={() => this.componentDidMount()}/>} />
              <Redirect exact from="/" to="/Home" />
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
