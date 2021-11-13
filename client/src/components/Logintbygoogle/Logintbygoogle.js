/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import history from '../../history';
import "./Logintbygoogle.css";
class Logintbygoogle extends Component {

  signIn = () => {
    history.push("/");
    this.props.checked();
  }

  signOut = () => {
    /* global gapi */
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      localStorage.removeItem("userID");
      localStorage.clear("userID");
      localStorage.removeItem("token");
      localStorage.clear("token");
      localStorage.removeItem("google");
      localStorage.clear("google");
      localStorage.removeItem("googleToken");
      localStorage.clear("googleToken");
      localStorage.removeItem("googleEmail");
      localStorage.clear("googleEmail");
      localStorage.removeItem("userName");
      localStorage.clear("userName");
      this.props.checked();
    });
  }
  
  render() {
    let t = localStorage.getItem("token");
    let g = localStorage.getItem("google")
    return (
      <div>
        <div className={( t && !g ) ? "showSingIn g-signin2" : "hideSignIn g-signin2" } data-onsuccess="onSignIn" onClick={this.signIn}></div>
        <a className={( t && g ) ? "showLogout" : "hideLogout" } onClick={this.signOut}>Sign out</a>
      </div>
    )
  }
}

export default Logintbygoogle