import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from "axios";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { GApiProvider } from 'react-gapi-auth2';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "@firebase/auth";


import Modal from "../../components/UI/Modal/Modal";
import Alert from "../../components/UI/Alert/Alert";
import Fridge from "../../components/Fridge/Fridge";
import Cook from "../../components/Cook/Cook";
import Calendar from 'react-calendar';
import Logintbygoogle from '../../components/Logintbygoogle/Logintbygoogle'
import Dashboard from "../../components/Dashboard/Dashboard";
// import 'react-calendar/dist/Calendar.css';
// import gmailApi from "react-gmail";
// import { GoogleApiProvider } from 'react-gapi';
// import MySignInButton from '../../components/MySignInButton/MySignInButton';
// import { Auth } from '../../components/Auth/Auth';

import './Home.css';

// Same config object passed to `gapi.auth2.init`
// https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams
const clientConfig = {
  client_id:"826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
  project_id:"gmail-access-323","auth_uri":"https://accounts.google.com/o/oauth2/auth",
  token_uri:"https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs",
  client_secret:"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",
  redirect_uris:["https://chipmantrack.herokuapp.com","http://localhost:3000"],
javascript_origins:["https://chipmantrack.herokuapp.com","http://localhost:3000"],
apiKey: "AIzaSyDU7HZZGfo7y-QSEJIfifmEno3gjypQFTc",
scope: "https://www.googleapis.com/auth/gmail.readonly",
discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"]
};


class Home extends Component {
  state = {
    showModel: false,
    showAlert: false,
    alertMessage: '',
    alertConfirm: false,
    loading: false,
    error: false,
    modelContent: '',
    isManaging: false,
    calendarValue: new Date(),
    arr: [
      {
        date:"2021, 10, 11",
        time: "9:45 am",
        building: "Amazon - Rufus",
        location: "550 Terry Ave. Seattle 98018",
        scope:"Reconnects/Post walk"
      },{
        date:"2021, 10, 15",
        time: "11:45 am",
        building: "Amazon - Apollo",
        location: "354 Boren Ave. Seattle 98018",
        scope:"Disconnects/Pre walk"
      },{
        date:"2021, 10, 17",
        time: "12:45 pm",
        building: "Amazon - Cloud 9",
        location: "920 Madison St. Seattle 98018",
        scope:"Reconnects/Post walk"
      },{
        date:"2021, 10, 27",
        time: "3:45 pm",
        building: "Amazon - Rufus",
        location: "550 Terry Ave. Seattle 98018",
        scope:"Disconnects/Pre walk"
      }
    ]
  }


  componentDidMount() {
  }

  closeAlertHandler = () => {
    this.setState({
      ...this.state,
      showAlert: false
    });
  }


  openAlertHandler = (message, confirm = false, recipe = null) => {
    this.setState({
      ...this.state,
      showAlert: true,
      alertMessage: message,
      alertConfirm: confirm,
      tempRecipe: recipe
    });
  }

  closeModelHandler = () => {
    this.componentDidMount();
    this.setState({
      ...this.state,
      showModel: false
    });
  }

  openModelHandler = (content, isManag) => {
    this.setState({
      ...this.state,
      showModel: true,
      modelContent: content,
      isManaging: isManag
    });
  }

  logoutHandler=()=>{
      this.closeNav("Logout");
      localStorage.removeItem("userID");
      localStorage.clear("userID");
      localStorage.removeItem("token");
      localStorage.clear("token");
      // this.props.history.push("/Logging");
      this.props.checked();
      // window.location.reload();
  }

  calendarOnChange = () => {

  } 

  calendarTitleConent = ({ date, view }) => {
    if(this.state.arr.find((x)=>(new Date(x.date).getDate() === date.getDate() && new Date(x.date).getMonth() === date.getMonth() && new Date(x.date).getFullYear() === date.getFullYear()))){
      let idx;
      for (let index = 0; index < this.state.arr.length; index++) {
        if(new Date(this.state.arr[index].date).getDate() === date.getDate() && new Date(this.state.arr[index].date).getMonth() === date.getMonth() && new Date(this.state.arr[index].date).getFullYear() === date.getFullYear()){
          idx = index;
          break;
        }
      }
      return <div>
      <p style={{fontSize:"10px", background:"lightblue"}}><strong>{this.state.arr[idx].time}</strong><br />{this.state.arr[idx].building}<br />{this.state.arr[idx].location}<br />{this.state.arr[idx].scope}</p>
    </div>
    }else{
      return null;
    }
  }

  /* Open when someone clicks on the span element */
  openNav= () => {
    const w = window.innerWidth;
    if(w >= 600){
        document.getElementById("myNav").style.width = "25%";
    }else{
        document.getElementById("myNav").style.width = "100%";
    }
  }

  /* Close when someone clicks on the "x" symbol inside the overlay */
  closeNav = (navBtn) => {
      document.getElementById("myNav").style.width = "0%";
      if(navBtn === "TERRA"){
        document.location.replace("https://www.terrastaffinggroup.com/myaccount/login");
      }
  }

  componentWillUnmount(){
      // clearInterval(this.state.interval);
  }  

  render() {
    const { messages } = this.state;
    let model = null;

    switch (this.state.modelContent) {
      case 'Fridge':
        model = (
          <Fridge />
        );
        break;
      case 'Cook':
        model = (
          <Cook/>
        );
        break
      default:
        model = null;
        break;
    }

    return (
      <div className="Home">        
        <div id="myNav" className="overlay">
                {/* Button to close the overlay navigation */}
                <Link to=""><button id = "closeMenuBtn" href="javascript:void(0)" className="closebtn" onClick={() => this.closeNav("Close")}>&times;</button></Link>
                {/* Overlay content */}
                <div className="overlay-content">
                    <Link onClick={() => this.closeNav("Close")}><Logintbygoogle/></Link>
                    <Link to="" onClick={() => this.closeNav("Cal")}>Calender</Link>
                    <Link to="" onClick={() => this.closeNav("Emalis")}>Emails</Link>
                    <Link to="" onClick={() => this.closeNav("Hours")}>Hours</Link>
                    <Link to="" onClick={() => this.closeNav("TERRA")}>TERRA</Link>
                    <Link to="" onClick={this.logoutHandler}>Logout</Link>
                </div>
            </div>
            {/* Use any element to open/show the overlay navigation menu */}
           <button className="btnHome" onClick={this.openNav}><FontAwesomeIcon icon={faBars} /></button>
           <div>
      </div>
      <h1 style={{color: "Naive"}}>My Calendar</h1> 
      <Calendar 
        id="myCalendar"
        onChange={this.calendarOnChange}
        value={this.state.calendarValue}
        tileContent = {this.calendarTitleConent}
        />
        {/* <Modal show={this.state.showModel} modalClosed={this.closeModelHandler}>
          {model}
        </Modal> */}
        <Alert show={this.state.showAlert} modalClosed={this.closeAlertHandler} message={this.state.alertMessage} confirm={this.state.alertConfirm}confirmYes={this.confirmYesHandler}/>
      </div>
    );
  };
}

export default Home;