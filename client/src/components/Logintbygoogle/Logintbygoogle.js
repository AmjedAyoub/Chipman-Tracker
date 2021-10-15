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
    var res = response.profileObj;
    console.log(res.googleId);
    this.getMessages(res.googleId);
  }

  getMessages = (userId) => {
    axios.post('https://gmail.googleapis.com/upload/gmail/v1/users/'+ userId +'/messages/import')
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
          clientId="826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com"
          buttonText="Login with Google"
          redirectUri={["https://chipmantrack.herokuapp.com", "http://localhost:3000"]}
          apiKey="AIzaSyDU7HZZGfo7y-QSEJIfifmEno3gjypQFTc"
          scope="https://www.googleapis.com/auth/gmail.modify"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          isSignedIn={true}></GoogleLogin>
        <GoogleLogout
          clientId="826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={this.logout}>
        </GoogleLogout>
      </div>
    )
  }
}

export default Logintbygoogle