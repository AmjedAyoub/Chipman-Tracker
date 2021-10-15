import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios'
export class Logintbygoogle extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  responseGoogle = (response) => {
    console.log(response);
    console.log(response.profileObj.email);
    console.log(response.accessToken);
    this.getMessages(response);
  }

  getMessages = (user) => {
    axios.get('https://gmail.googleapis.com/gmail/v1/users/'+ user.profileObj.email +'/messages', {
      header:{
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
        'Content-Type': 'application/json',
        "access-token":user.accessToken,
        Authorization: "Bearer " + user.accessToken},
      auth:{
        "client_id":"826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        "project_id":"gmail-access-323",
        "auth_uri":"https://accounts.google.com/o/oauth2/auth",
        "token_uri":"https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
        "client_secret":"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",
        "redirect_uris":["https://chipmantrack.herokuapp.com","http://localhost:3000"],
        "apiKey":"AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        "scope": "https://www.googleapis.com/auth/gmail.readonly",
        "javascript_origins":["https://chipmantrack.herokuapp.com","http://localhost:3000"],
        "access-token":user.accessToken
    }})
    .then((result) => {
      console.log("result");
      console.log(result);
    })
    .catch((err) => {
      console.log("err");
      console.log(err);
    });
  }

  logout = () => {
    console.log("Logged out");
  }

  render() {

    return (
      <div>
        <GoogleLogin
          clientId="604246018347-9939kn2h7g4t9o0rbmvdhjt5vhoajerg.apps.googleusercontent.com"
          buttonText="Login with Google"
          redirectUri={["https://chipmantrack.herokuapp.com","http://localhost:3000"]}
          apiKey="AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs"
          scope="https://www.googleapis.com/auth/gmail.readonly"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          isSignedIn={true}></GoogleLogin>
        <GoogleLogout
          clientId="604246018347-9939kn2h7g4t9o0rbmvdhjt5vhoajerg.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={this.logout}>
        </GoogleLogout>
      </div>
    )
  }
}

export default Logintbygoogle