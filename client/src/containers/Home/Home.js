import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from "axios";
import { faBars } from '@fortawesome/free-solid-svg-icons';

import Modal from "../../components/UI/Modal/Modal";
import Alert from "../../components/UI/Alert/Alert";
import Fridge from "../../components/Fridge/Fridge";
import Cook from "../../components/Cook/Cook";
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

import './Home.css';
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
                    <Link to="" onClick={() => this.closeNav("Cal")}>Calender</Link>
                    <Link to="" onClick={() => this.closeNav("Emalis")}>Emails</Link>
                    <Link to="" onClick={() => this.closeNav("Hours")}>Hours</Link>
                    <Link to="" onClick={() => this.closeNav("TERRA")}>TERRA</Link>
                    <Link to="" onClick={this.logoutHandler}>Logout</Link>
                </div>
            </div>
            {/* Use any element to open/show the overlay navigation menu */}
           <button className="btnHome" onClick={this.openNav}><FontAwesomeIcon icon={faBars} /></button>
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