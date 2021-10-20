import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import "./Logintbygoogle.css";
class Logintbygoogle extends Component {

  responseGoogle = (response) => {
    console.log(response);
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
    let t = localStorage.getItem("token");
    let g = localStorage.getItem("google")
    return (
      <div>
        <GoogleLogin
          disabled={false}
          className={( t && !g ) ? "showSingIn" : "hideSignIn" }
          clientId="604246018347-9939kn2h7g4t9o0rbmvdhjt5vhoajerg.apps.googleusercontent.com"
          buttonText="Login with Google"
          redirectUri={["https://chipmantrack.herokuapp.com","http://localhost:3000"]}
          apiKey="AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs"
          scope={["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/cloud-platform","https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/userinfo.profile"]}
          onSuccess={this.responseGoogle}
          onFailure={this.errGoogle}
          isSignedIn={true}
          cookiePolicy={'single_host_origin'}/>
        <GoogleLogout
          disabled={false}
          className={( t && g ) ? "showSingout" : "hideSignout" }
          clientId="604246018347-9939kn2h7g4t9o0rbmvdhjt5vhoajerg.apps.googleusercontent.com"
          buttonText="Logout"
          redirectUri={["https://chipmantrack.herokuapp.com","http://localhost:3000"]}
          onLogoutSuccess={this.logout}/>
      </div>
    )
  }
}

export default Logintbygoogle