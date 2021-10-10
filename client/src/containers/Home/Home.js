import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from "axios";
import { faBars } from '@fortawesome/free-solid-svg-icons';

import Modal from "../../components/UI/Modal/Modal";
import Alert from "../../components/UI/Alert/Alert";
import Fridge from "../../components/Fridge/Fridge";
import Cook from "../../components/Cook/Cook";

import './Home.css';

class Home extends Component {
  state = {
    showModel: false,
    showAlert: false,
    alertMessage: '',
    alertConfirm: false,
    tempRecipe: null,
    loading: false,
    error: false,
    modelContent: '',
    recipeToCook: null,
    steps: null,
    isCooking: false,
    isManaging: false,
    washingLoads: 0,
    washing: false,
    interval: null,
    intervalCook: null,
    timeOut: null,
    count: 180,
    stepsToView: [],
    recipeToView: null,
    prevPage: '',
    query: '',
    recipesResults: [],
    myMeals: [],
    items: [],
    ingredientsQuery: '',
    missedIngredients: [],
    showHours: 0,
    showMinutes: 0,
    showSeconds: 0,
    timer: false,
    mCount: 0,
    hCount: 0,
    finishTime: null,
    washCount: ''
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
      this.closeNav();
      localStorage.removeItem("userID");
      localStorage.clear("userID");
      localStorage.removeItem("token");
      localStorage.clear("token");
      // this.props.history.push("/Logging");
      this.props.checked();
      // window.location.reload();
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
  closeNav = () => {
      document.getElementById("myNav").style.width = "0%";
  }

  componentWillUnmount(){
      clearInterval(this.state.interval);
      clearInterval(this.state.intervalCook);
      clearTimeout(this.state.timeOut);
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
                <Link to="#"><button id = "closeMenuBtn" href="javascript:void(0)" className="closebtn" onClick={this.closeNav}>&times;</button></Link>
                {/* Overlay content */}
                <div className="overlay-content">
                    <Link to="#" onClick={this.closeNav}>Calender</Link>
                    <Link to="#" onClick={this.closeNav}>Emails</Link>
                    <Link to="#" onClick={this.closeNav}>Hours</Link>
                    <Link to="#" onClick={this.closeNav}>TERRA</Link>
                    <Link to="#" onClick={this.logoutHandler}>Logout</Link>
                </div>
            </div>
            {/* Use any element to open/show the overlay navigation menu */}
            <button className="btnHome" onClick={this.openNav}><FontAwesomeIcon icon={faBars} /></button>
        <Modal show={this.state.showModel} modalClosed={this.closeModelHandler}>
          {model}
        </Modal>
        <Alert show={this.state.showAlert} modalClosed={this.closeAlertHandler} message={this.state.alertMessage} confirm={this.state.alertConfirm}confirmYes={this.confirmYesHandler}/>
      </div>
    );
  };
}

export default Home;