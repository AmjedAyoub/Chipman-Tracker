import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios'
class Logintbygoogle extends Component {
  state = {
      schedule:[]
    };

  responseGoogle = (response) => {
    // this.getMessages(response);
    console.log(response);
    localStorage.setItem('google', true);
    this.props.checked();
    // window.location.reload();
  }

  errGoogle = (err) => {
    console.log("error", err);
    localStorage.setItem('google', false);
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
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        maxResults:500,
        q:"from:.*\.chipmanrelo.com$"
      },
      params:{
        client_id:"826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret:"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",
        redirect_uris:["https://chipmantrack.herokuapp.com","http://localhost:3000"],
        key:"AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        access_token: user.accessToken,
        maxResults:500,
        q:"from:.*\.chipmanrelo.com$"
      },
      auth:{
        client_id:"826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret:"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",
        redirect_uris:["https://chipmantrack.herokuapp.com","http://localhost:3000"],
        key:"AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        access_token: user.accessToken,
        maxResults:500,
        q:"from:.*\.chipmanrelo.com$"
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

  getMessagesContent = async (user, messages) => {
    console.log(messages.length);
    for (let index = 0; index < messages.length; index++) {
     await axios.get('https://www.googleapis.com/gmail/v1/users/'+ user.profileObj.email + '/messages/' + messages[index].id, {
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
        format:'raw'        
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
      let sch = [];
      let m = Buffer.from(message.data.raw, 'base64').toString('ascii');
      let content = "";
      let start = m.indexOf("MOVE DETAILS");
      let end = m.split("--000", 2).join("--000").length;
      if( start > -1){
        content = m.substring(start, end);
        content = this.replaceAll(content, '>', '');
        content = this.replaceAll(content, '--', '');
        content = this.replaceAll(content, '=20', '');
        content = this.replaceAll(content, 'Lead:', 'Lead: *');
        content = this.replaceAll(content, '*', '\n');
        content = this.replaceAll(content, '\r', '><');
        content = this.replaceAll(content, '\n', '><');
        let d = content.split("><");
        let data = [];
        for (let i = 0; i < d.length; i++) {
          if(d[i] !== '' && d[i] !== ' '){
            data.push(d[i]);
          }
        }
        // data.map((data) => data.split("\n"));
        let dd = data[1].split(' ');
        let date;
        for (let k = 0; k < dd.length; k++) {
          if(dd[k].includes('-') || dd[k].includes('/') || dd[k].includes(',')){
            date = dd[k];
            break;
          } 
        }
        date = this.replaceAll(date, '-', ',');
        date = this.replaceAll(date, '/', ',');
        let year = new Date().getFullYear();
        date = (date + ',' + year).trim();
        let time = data[2].trim();
        let building = data[3].trim();
        let location = (data[4] + ',' + data[5]).trim();
        let scope;
        let supervisor;
        let lead;
        for (let j = 0; j < data.length; j++) {
          if(data[j].toLowerCase().includes("scope")){
            scope = (data[j] + data[j+1]).trim();
            let str1 = scope.indexOf('Tech')
            let str2 = scope.indexOf('Super')
            if(str1 > -1){
              scope = scope.substring(0 , str1);
            }else if(str2 > -1){
              scope = scope.substring(0 , str2);
            }
          }
          else if(data[j].toLowerCase().includes("supervisor:")){
            supervisor = (data[j] + data[j+1]).trim();
          }
          else if(data[j].toLowerCase().includes("lead:")){
            lead = (data[j] + data[j+1]).trim();
          }
          
        }
        let schedule = {
          date: date,
          time: time,
          building: building,
          location: location,
          scope: scope,
          supervisor: supervisor,
          lead: lead
        }
        this.state.schedule.push(schedule);
      }
    })
    .catch((err) => {
      console.log("err");
      console.log(err);
    });
    }
    console.log(this.state.schedule);
    this.childFunction();
  }

  replaceAll = (str, chr, replace) => {
    return str.split(chr).join(replace);
  }

  logout = () => {
    console.log("Logged out from Google");
    document.location.replace("https://chipmantrack.herokuapp.com/#/Logging");
  }
  
  childFunction = () => {
    this.props.functionCallFromParent(this.state.schedule);
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