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
import Logintbygoogle from '../../components/Logintbygoogle/Logintbygoogle';

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
    schedule: []
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
      localStorage.removeItem("google");
      localStorage.clear("google");
      // this.props.history.push("/Logging");
      this.props.checked();
      // window.location.reload();
  }

  calendarOnChange = () => {

  } 

  calendarTitleConent = ({ date = new Date(), view = "month" }) => {
    if(this.state.schedule.find((x)=>(new Date(x.date).getDate() === date.getDate() && new Date(x.date).getMonth() === date.getMonth() && new Date(x.date).getFullYear() === date.getFullYear()))){
      let idx;
      for (let index = 0; index < this.state.schedule.length; index++) {
        if(new Date(this.state.schedule[index].date).getDate() === date.getDate() && new Date(this.state.schedule[index].date).getMonth() === date.getMonth() && new Date(this.state.schedule[index].date).getFullYear() === date.getFullYear()){
          idx = index;
          break;
        }
      }
      return <div className="dayView">
      <p style={{fontSize:"10px", background:"lightblue"}}><strong>{this.state.schedule[idx].time}</strong><br />{this.state.schedule[idx].building}<br />{this.state.schedule[idx].location}<br />{this.state.schedule[idx].scope}<br />{this.state.schedule[idx].supervisor}<br />{this.state.schedule[idx].lead}</p>
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

  parentFunction = async (data_from_child) => {
    this.setState({
      ...this.state,
      schedule: data_from_child
    })
    console.log(this.state.schedule);
    for (let index = 0; index < this.state.schedule.length; index++) {
      let d = this.state.schedule[index].date;
      d = new Date(d);
      await this.calendarTitleConent(d);
    }
  }

  onSelect = (e) => {
    console.log(e);
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
                <Link to=""><button id = "closeMenuBtn" className="closebtn" onClick={() => this.closeNav("Close")}>&times;</button></Link>
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
           <div>
      </div>
      <h2 style={{color: "Naive"}}>My Calendar</h2> 
      <Calendar 
        id="myCalendar"
        onChange={this.calendarOnChange}
        value={this.state.calendarValue}
        tileContent = {this.calendarTitleConent}
        onSelect={this.onSelect}
        onClickDay = {this.onSelect}
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