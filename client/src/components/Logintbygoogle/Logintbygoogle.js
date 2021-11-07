/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import "./Logintbygoogle.css";

// Client ID and API key from the Developer Console
const CLIENT_ID = '604246018347-9939kn2h7g4t9o0rbmvdhjt5vhoajerg.apps.googleusercontent.com'
const API_KEY = 'AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "email profile https://mail.google.com/";
const javaScript = 'https://chipmantrack.herokuapp.com'

class Logintbygoogle extends Component {

  signIn = () => {
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