import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter} from 'react-router-dom';
import './App.css';

import Home from "./containers/Home/Home";
import Logging from "./components/Logging/Logging";

class App extends Component {
  state={
    token: "",
    googleSignedIn: false
  }

  componentDidMount () {
    const t = localStorage.getItem("token");
    const g = localStorage.getItem("google");
    this.setState({
      token: t,
      googleSignedIn: g
    })
  }

  render(){
    const g = localStorage.getItem("google");
    const t = localStorage.getItem("token");
    let routes =  (
      <Switch>
        {/* <Route path="/Logging" exact component={Logging}/> */}
        <Route path="/Logging" exact render={() => <Logging checked={() => this.componentDidMount()}/>} />
        <Redirect from="/" to="/Logging" />
      </Switch>
    );
    if(t && g){
        routes =  (
          <Switch>
            {/* <Route path="/Home" exact component={Home}/> */}
            <Route path="/Home" exact render={() => <Home checked={() => this.componentDidMount()}/>} />
            <Redirect from="/" to="/Home" />
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
