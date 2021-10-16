import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios'
export class Logintbygoogle extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  responseGoogle = (response) => {
    this.getMessages(response);
  }

  errGoogle = (err) => {
    console.log("error", err);
  }

  getMessages = (user) => {
    axios.get('https://gmail.googleapis.com/gmail/v1/users/'+ user.profileObj.email +'/messages', {
      header:{
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': 'application/json',
        access_token: user.accessToken,
        Authorization: user.accessToken,client_id:"826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret:"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",
        redirect_uris:["https://chipmantrack.herokuapp.com","http://localhost:3000"],
        key:"AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: "https://www.googleapis.com/auth/gmail.readonly"
      },
      params:{
        client_id:"826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret:"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",
        redirect_uris:["https://chipmantrack.herokuapp.com","http://localhost:3000"],
        key:"AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        access_token: user.accessToken
      },
      auth:{
        client_id:"826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret:"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",
        redirect_uris:["https://chipmantrack.herokuapp.com","http://localhost:3000"],
        key:"AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        access_token: user.accessToken
    }})
    .then((result) => {
      console.log(result.data.messages);
      this.getMessagesContent(user, result.data.messages)
    })
    .catch((err) => {
      console.log("err");
      console.log(err);
    });
  }

  getMessagesContent = (user, messages) => {
    
    axios.get('https://www.googleapis.com/gmail/v1/users/'+ user.profileObj.email + '/messages/' + messages[10].id, {
      header:{
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': 'application/json, text/plain, */*',
        access_token: user.accessToken,
        Authorization: user.accessToken,client_id:"826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret:"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",
        redirect_uris:["https://chipmantrack.herokuapp.com","http://localhost:3000"],
        key:"AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: "https://www.googleapis.com/auth/gmail.readonly"
      },
      params:{
        client_id:"826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret:"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",
        redirect_uris:["https://chipmantrack.herokuapp.com","http://localhost:3000"],
        key:"AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        access_token: user.accessToken,
        format:'full'        
      },
      auth:{
        client_id:"826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret:"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",
        redirect_uris:["https://chipmantrack.herokuapp.com","http://localhost:3000"],
        key:"AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        access_token: user.accessToken
    }})
    .then((message) => {
      console.log("message");
      console.log(message);
      // console.log(Buffer.from(message.data.payload.body.data, 'base64').toString('ascii'));
    })
    .catch((err) => {
      console.log("err");
      console.log(err);
    });
  }

  logout = () => {
    console.log("Logged out from Google");
    document.location.replace("https://chipmantrack.herokuapp.com/#/Logging");
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
          onFailure={this.errGoogle}
          isSignedIn={true}
          accessType="online"
          cookiePolicy={'single_host_origin'}></GoogleLogin>
        <GoogleLogout
          clientId="604246018347-9939kn2h7g4t9o0rbmvdhjt5vhoajerg.apps.googleusercontent.com"
          buttonText="Logout"
          redirectUri={["https://chipmantrack.herokuapp.com","http://localhost:3000"]}
          onLogoutSuccess={this.logout}>
        </GoogleLogout>
      </div>
    )
  }
}

export default Logintbygoogle