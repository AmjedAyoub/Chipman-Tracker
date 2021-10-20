import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login';
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

  render() {
    let t = localStorage.getItem("token");
    let g = localStorage.getItem("google")
    return (
      <div>
        <GoogleLogin
          className={( t && !g ) ? "showSingIn" : "hideSignIn" }
          clientId={"604246018347-9939kn2h7g4t9o0rbmvdhjt5vhoajerg.apps.googleusercontent.com"}
          disabled={false}
          buttonText="Login with Google"
          redirectUri={["https://chipmantrack.herokuapp.com","http://localhost:3000"]}
          scope="profile email"
          onSuccess={this.responseGoogle}
          onFailure={this.errGoogle}
          cookiePolicy={'single_host_origin'}/>
      </div>
    )
  }
}

export default Logintbygoogle