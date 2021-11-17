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
    path: "",
    dark: false
  }

  componentDidMount () {
    const t = localStorage.getItem("token");
    const g = localStorage.getItem("google");
    let dark = localStorage.getItem("dark");
    let v = false;
    if(dark === "true"){
      v = true
    }
    this.setState({
      token: t,
      googleSignedIn: g,
      path: this.props.location.pathname,
      dark: v
    })
  }

  render(){
    const g = localStorage.getItem("google");
    const t = localStorage.getItem("token");
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
      <div className={this.state.dark ? "App dark" : "App"}>
        {routes}   
      </div>
    );
  }
}

export default withRouter(App);
