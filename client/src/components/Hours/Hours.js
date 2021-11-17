import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import DatePicker from 'react-date-picker';
import Logintbygoogle from '../../components/Logintbygoogle/Logintbygoogle';
import NewDayView from "../../components/NewDayView/NewDayView";
import "./Hours.css";
class Hours extends Component {
  state = {
    schedule: [],
    userName: '',
    fromDate: null,
    toDate: new Date(),
    showHours: false,
    dark: false
  }

  componentDidMount = async () => {
    await this.getSchedules();
  }

  getSchedules = async () => {
    const name = localStorage.getItem('userName');
    await axios.get("https://chipmantrack.herokuapp.com/AllSchedule/" + localStorage.getItem("userID"))
      .then(res => {
        if (res.status === "error") {
          throw new Error(res.data.message);
        }
        // console.log(res.data[0].schedule);
        let arr = [];
        res.data[0].schedule.forEach(element => {
          let n = null;
          res.data[0].schedule.forEach(x => {
            if ((x.googleId !== element.googleId) && (x.date === element.date)) {
              if (element.updated) {
                n = element
              } else {
                n = x
              }
            }
          });
          if (!n || n === null) {
            n = element;
          }
          if (!arr.find((y) => (y.googleId === n.googleId))) {
            arr.push(n);
          }
        });
        // console.log(arr);
        let d = new Date();
        let day = d.getDay();
        // adjust to Monday first day of week
        let diff = d.getDate() - day + (day === 0 ? -6 : 1);
        if (this.state.fromDate === null || !this.state.fromDate) {
          this.setState({
            ...this.state,
            schedule: arr,
            userName: name,
            showHours: true,
            fromDate: new Date(d.setDate(diff)),
            dark: localStorage.getItem("dark")
          });
        } else {
          this.setState({
            ...this.state,
            schedule: arr,
            userName: name,
            showHours: true,
            dark: localStorage.getItem("dark")
          })
        }
      })
      .catch(err => {
        this.setState({
          ...this.state,
          userName: name,
          showHours: true,
          dark: localStorage.getItem("dark")
        })
        console.log(err);
      });
  }

  dateFromChange = (e) => {
    this.setState({
      ...this.state,
      fromDate: e
    })
  }

  dateToChange = (e) => {
    this.setState({
      ...this.state,
      toDate: e
    })
  }

  /* Open when someone clicks on the span element */
  openNav = () => {
    const w = window.innerWidth;
    if (w >= 600) {
      document.getElementById("myNav").style.width = "25%";
    } else {
      document.getElementById("myNav").style.width = "100%";
    }
  }

  /* Close when someone clicks on the "x" symbol inside the overlay */
  closeNav = (navBtn) => {
    document.getElementById("myNav").style.width = "0%";
    if(navBtn === "TERRA"){
      window.location.assign("https://www.terrastaffinggroup.com/myaccount/login");
    }
  }

  itemChanged = async () => {
    await this.getSchedules();
  }

  changeMode = () => {
    let dark = localStorage.getItem("dark");
    axios.post("https://chipmantrack.herokuapp.com/dark", { 
        header: {
          'Access-Control-Allow-Origin': '*'
        },
        userID: localStorage.getItem("userID"),
        dark: !dark,
    })
    .then(res => {
            if (res.status === "error") {
                throw new Error(res.data.message);
              }
              localStorage.setItem("dark", !dark);
              this.setState({
                ...this.state,
                dark: !dark
              });
            })
        .catch(err => this.setState({ error: err.message }));
  }

  render() {
    let arr = [];
    let fromDate = this.state.fromDate;
    let toDate = this.state.toDate;
    let total = 0;
    this.state.schedule.forEach(element => {
      if (element.date !== "WILL BE UPDATED") {
        if(!element.updated){
          let mes = arr.find(x => ((x.date === element.date) && (x.googleId !== element.googleId)));
          if(mes){
            if(!arr.find(x => (x.date === mes.date))){
              arr.push(mes);
            }
          }else{
            if(!arr.find(x => (x.date === element.date))){
              arr.push(element);
            }
          }
        }else{
          if(!arr.find(x => (x.date === element.date))){
            arr.push(element);
          }
        }
        if ((new Date(element.date).getDate() >= fromDate.getDate() && new Date(element.date).getMonth() >= fromDate.getMonth() && new Date(element.date).getFullYear() >= fromDate.getFullYear()) && (new Date(element.date).getDate() <= toDate.getDate() && new Date(element.date).getMonth() <= toDate.getMonth() && new Date(element.date).getFullYear() <= toDate.getFullYear())) {
          let a = element.hours.split(':');
          let hrs = parseInt(a[0]) * 60;
          let mins = parseInt(a[1]);
          total += hrs + mins;
        }
      }
    });
    arr.sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
          return -1;
      }
      if (new Date(a.date) < new Date(b.date)) {
          return 1;
      }
      return 0;
  })
    let h = parseFloat(total) / 60.00;
    h += "";
    let s = h.split('.')
    let m;
    if (s.length > 1) {
      if (s[1].length > 1) {
        m = parseInt(s[1]) / 100 * 60;
      } else {
        m = parseInt(s[1]) / 10 * 60;
      }
    } else {
      m = '00'
    }
    total = parseInt(h) + ':' + m;

    const weekday = new Array(7);
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";


    let dark = localStorage.getItem("dark");
      
    return (
      <div className={dark ? "hoursView dark" : "hoursView"}>
      <div id="myNav" className="overlay">
        {/* Button to close the overlay navigation */}
        <button id="closeMenuBtn" className="closebtn" onClick={() => this.closeNav("close")}>&times;</button>
        {/* Overlay content */}
        <div className="overlay-content">
          <Logintbygoogle checked={() => this.compDidChanged()} />
          <Link to="/Home"><button className="navbtn" onClick={() => this.closeNav("calendarView")}>Calendar</button></Link>
          <Link to="/Hour"><button className="navbtn" onClick={() => this.closeNav("hoursView")}>Hours</button></Link>
          <Link to="/Home"><button className="navbtn" onClick={() => this.closeNav("chipmanView")}>Chipman Tracker</button></Link>
          <button className="navbtn" onClick={() => this.closeNav("TERRA")}>TERRA</button>
        </div>
      </div>
      {/* Use any element to open/show the overlay navigation menu */}
      <button className="btnHome" onClick={this.openNav}><FontAwesomeIcon icon={faBars} /></button>
        <button className="btnDark" onClick={this.changeMode}>{this.state.dark ? "GO LIGHT" : "GO DARK"}</button>
        <div className="myHours">
          <div className="row myHeader">
            <div className="Col-sm-3">
              <h2>{this.state.userName}</h2>
            </div>
            <div className="Col-sm-9" style={{ margin: 'auto' }}>
              <h2 style={{ color: "Naive" }}>My Hours</h2>
            </div>
          </div>
          <div className="card card-body" style={{ background: this.state.dark ? "#5e5e5e" : "lavenderblush" }}>
            <div className="row" style={{ display: 'flex', justifyContent: "space-evenly", border: '1px solid indianred', padding: '1px' }}>
              <div className="Col-sm-6">
                <label>From:</label>
                <DatePicker
                  onChange={this.dateFromChange}
                  value={fromDate}
                />
              </div>
              <div className="Col-sm-6">
                <label>To:</label>
                <DatePicker
                  onChange={this.dateToChange}
                  value={toDate}
                />
              </div>
            </div>
            <div className="row" style={{ display: 'flex', justifyContent: "center", border: '1px solid indianred', padding: '5px' }}>
              <div className="Col-sm-12">
                <label>Total Hours:</label>
                <label>{total}</label>
              </div>
            </div>
          </div>
          <hr></hr>
          {this.state.showHours ?
            <ul>
              {arr.map((item, index) => (
                <li key={index}>
                  <div
                    className={((new Date(item.date).getDate() >= fromDate.getDate() && new Date(item.date).getMonth() >= fromDate.getMonth() && new Date(item.date).getFullYear() >= fromDate.getFullYear()) && (new Date(item.date).getDate() <= toDate.getDate() && new Date(item.date).getMonth() <= toDate.getMonth() && new Date(item.date).getFullYear() <= toDate.getFullYear())) ? this.state.dark ? "row selected sDark": "row selected" : this.state.dark ? "row notSselected notSDark" : "row notSelected"}
                    style={{ display: 'flex', justifyContent: "space-evenly", border: '1px solid indianred', padding: '5px' }}>
                    <div className="Col-sm-4">
                      <label>Date:</label>
                      {item.date}<br></br>{weekday[new Date(item.date).getDay()]}
                    </div>
                    <div className="Col-sm-4">
                      {!item.dayOff ? <div>
                        <label>Hrs:</label>
                        <label>{item.hours}</label>
                      </div>:
                      <img className="dayOff2" src="dayoff.jpg" alt="Day off"/>
                      }
                    </div>
                    <div className="Col-sm-4">
                      <button className="btn btn-outline-warning btn-text collapsed" type="button" data-toggle="collapse" data-target={"#" + item._id} aria-expanded="false" aria-controls={item._id}>
                        <span>EDIT</span>
                        <b>CLOSE</b>
                      </button>
                    </div>
                    <div className="collapse" id={item._id}>
                      <NewDayView schedule={item} onChange={this.itemChanged} isEditMode={true} dark={this.state.dark}/>
                    </div>
                  </div>
                  <hr></hr>
                </li>
              ))}
            </ul>
            : <div className="loaderDiv"><div className="loader"></div><strong>Please wait...</strong></div>}
        </div>
      </div>
    )
  }
}

export default Hours;