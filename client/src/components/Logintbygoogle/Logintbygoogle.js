import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
class Logintbygoogle extends Component {
  state = {
      schedule:[]
    };

  responseGoogle = (response) => {
    localStorage.setItem('google', true);
    localStorage.setItem('googleToken', response.accessToken);
    localStorage.setItem('googleEmail', response.profileObj.email);
    this.props.checked();
  }

  errGoogle = (err) => {
    console.log("error", err);
    localStorage.removeItem("google");
    localStorage.clear("google");
    localStorage.removeItem("googleToken");
    localStorage.clear("googleToken");
    localStorage.removeItem("googleEmail");
    localStorage.clear("googleEmail");
  }

  logout = () => {
    console.log("Logged out from Google");
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
    this.props.checked();
  }

  render() {
    let g = localStorage.getItem('google');

    return (
      <div>
        {!g ? 
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
        :
        <GoogleLogout
          clientId="604246018347-9939kn2h7g4t9o0rbmvdhjt5vhoajerg.apps.googleusercontent.com"
          buttonText="Logout"
          redirectUri={["https://chipmantrack.herokuapp.com","http://localhost:3000"]}
          onLogoutSuccess={this.logout}>
        </GoogleLogout>
        }
      </div>
    )
  }
}

export default Logintbygoogle