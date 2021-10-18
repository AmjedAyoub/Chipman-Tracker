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
    schedule: [],
    showCal: false
  }


  componentDidMount = async () => {
    const token = localStorage.getItem('googleToken');
    const email = localStorage.getItem('googleEmail');
    await this.getSchedule();
    if(token){
      await this.getMessages(token, email);
    }
  }

  getMessages = async (token, email) => {
    axios.get('https://gmail.googleapis.com/gmail/v1/users/' + email + '/messages', {
      header: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': 'application/json',
        access_token: token,
        Authorization: token, client_id: "826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret: "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",
        redirect_uris: ["https://chipmantrack.herokuapp.com", "http://localhost:3000"],
        key: "AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        maxResults: 500,
        q: "from:.*\.chipmanrelo.com$"
      },
      params: {
        client_id: "826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret: "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",
        redirect_uris: ["https://chipmantrack.herokuapp.com", "http://localhost:3000"],
        key: "AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        access_token: token,
        maxResults: 500,
        q: "from:.*\.chipmanrelo.com$"
      },
      auth: {
        client_id: "826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret: "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",
        redirect_uris: ["https://chipmantrack.herokuapp.com", "http://localhost:3000"],
        key: "AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        access_token: token,
        maxResults: 500,
        q: "from:.*\.chipmanrelo.com$"
      }
    })
      .then(async (result) => {
        // console.log(result.data.messages);
        let newMessages = [];
        for (let i = 0; i < result.data.messages.length; i++) {
          if (!this.state.schedule.find((x) => (x.googleId === result.data.messages[i].id))) {
            newMessages.push(result.data.messages[i]);
          }
        }
        if (newMessages.length > 0) {
          console.log(newMessages.length);
          this.setState({
            ...this.state,
            showCal: false
          })
          await this.getMessagesContent(token, email, newMessages);
        }
        else {
          this.setState({
            ...this.state,
            showCal: true
          })
        }
      })
      .catch((err) => {
        console.log("err");
        console.log(err);
      });
  }

  getMessagesContent = async (token, email, messages) => {
    for (let idx = 0; idx < messages.length; idx++) {
      await axios.get('https://www.googleapis.com/gmail/v1/users/' + email + '/messages/' + messages[idx].id, {
        header: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Content-Type': 'application/json, text/plain, */*',
          access_token: token,
          Authorization: token, client_id: "826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
          client_secret: "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",
          redirect_uris: ["https://chipmantrack.herokuapp.com", "http://localhost:3000"],
          key: "AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
          scope: "https://www.googleapis.com/auth/gmail.readonly"
        },
        params: {
          client_id: "826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
          client_secret: "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",
          redirect_uris: ["https://chipmantrack.herokuapp.com", "http://localhost:3000"],
          key: "AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
          scope: "https://www.googleapis.com/auth/gmail.readonly",
          access_token: token,
          format: 'raw'
        },
        auth: {
          client_id: "826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
          client_secret: "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",
          redirect_uris: ["https://chipmantrack.herokuapp.com", "http://localhost:3000"],
          key: "AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
          scope: "https://www.googleapis.com/auth/gmail.readonly",
          access_token: token
        }
      })
        .then((message) => {
          let m = Buffer.from(message.data.raw, 'base64').toString('ascii');
          let content = "";
          let start = m.indexOf("MOVE DETAILS");
          let end = m.split("--000", 2).join("--000").length;
          if (start > -1) {
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
              if (d[i] !== '' && d[i] !== ' ') {
                data.push(d[i]);
              }
            }
            let dd = data[1].split(' ');
            let date;
            for (let k = 0; k < dd.length; k++) {
              if (dd[k].includes('-') || dd[k].includes('/') || dd[k].includes(',')) {
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
            let googleId = messages[idx].id;
            let mContent = {data: message.data};
            for (let j = 0; j < data.length; j++) {
              if (data[j].toLowerCase().includes("scope")) {
                scope = (data[j] + data[j + 1]).trim();
                let str1 = scope.indexOf('Tech')
                let str2 = scope.indexOf('Super')
                if (str1 > -1) {
                  scope = scope.substring(0, str1);
                } else if (str2 > -1) {
                  scope = scope.substring(0, str2);
                }
              }
              else if (data[j].toLowerCase().includes("supervisor:")) {
                supervisor = (data[j] + data[j + 1]).trim();
              }
              else if (data[j].toLowerCase().includes("lead:")) {
                lead = (data[j] + data[j + 1]).trim();
              }

            }
            let schedule = {
              googleId: googleId,
              content: mContent,
              date: date,
              time: time,
              building: building,
              location: location,
              scope: scope,
              supervisor: supervisor,
              lead: lead
            }
            this.addScheduleHandler(schedule);
          }
          else{
            let googleId = messages[idx].id;
            let mContent = {data: message.data};
            let schedule = {
              googleId: googleId,
              content: mContent
            }
            this.addScheduleHandler(schedule);
          }
        })
        .catch((err) => {
          console.log("err");
          console.log(err);
        });
    }
    await this.getSchedule();
  }

  addScheduleHandler = async(schedule) => {
    await axios.post("https://chipmantrack.herokuapp.com/addSchedule", {
      userID: localStorage.getItem("userID"),
      googleId: schedule.googleId,
      content: schedule.content,
      date: schedule.date,
      time: schedule.time,
      building: schedule.building,
      location: schedule.location,
      scope: schedule.scope,
      supervisor: schedule.supervisor,
      lead: schedule.lead
    }
    )
      .then(res => {
        if (res.status === "error") {
          throw new Error(res.data.message);
        }
      })
      .catch(err => this.setState({
        ...this.state,
        error: err.message
      }));
  }

  getSchedule = async() => {
    this.setState({
      ...this.state,
      showCal: false
    })
    await axios.get("https://chipmantrack.herokuapp.com/AllSchedule/" + localStorage.getItem("userID"))
    .then(res => {
        if (res.status === "error") {
            throw new Error(res.data.message);
        }
        this.setState({
            ...this.state,
            schedule: res.data[0].schedule,
            showCal: true
        })
    })
    .catch(err => this.setState({
        ...this.state,
        error: err.message
    }));
  }

  replaceAll = (str, chr, replace) => {
    return str.split(chr).join(replace);
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

  calendarOnChange = () => {

  }

  calendarTitleConent = ({ date = new Date(), view = "month" }) => {
    let d = this.state.schedule.find((x, i) => (new Date(x.date).getDate() === date.getDate() && new Date(x.date).getMonth() === date.getMonth() && new Date(x.date).getFullYear() === date.getFullYear()));
    if (d) {
      return <div className="dayView">
        <p style={{ fontSize: "10px", background: "lightblue" }}><strong>{d.time}</strong><br />{d.building}<br />{d.location}<br />{d.scope}<br />{d.supervisor}<br />{d.lead}</p>
      </div>
    } else {
      return null;
    }
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
    if (navBtn === "TERRA") {
      document.location.replace("https://www.terrastaffinggroup.com/myaccount/login");
    }
  }

  compDidChanged = () => {
    const t = localStorage.getItem("token");
    const g = localStorage.getItem("google");
    this.setState({
      ...this.state,
      token: t,
      googleSignedIn: g
    })
    this.props.checked();
  }

  onSelect = (e) => {
    let d = this.state.schedule.find((x, i) => (new Date(x.date).getDate() === e.getDate() && new Date(x.date).getMonth() === e.getMonth() && new Date(x.date).getFullYear() === e.getFullYear()));
    console.log(d);
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
          <Cook />
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
          <Link to=""><button id="closeMenuBtn" className="closebtn" onClick={() => this.closeNav("Close")}>&times;</button></Link>
          {/* Overlay content */}
          <div className="overlay-content">
            <Link to="" onClick={() => this.closeNav("Close")}><Logintbygoogle checked={() => this.compDidChanged()} /></Link>
            <Link to="" onClick={() => this.closeNav("Cal")}>Calender</Link>
            <Link to="" onClick={() => this.closeNav("Emalis")}>Emails</Link>
            <Link to="" onClick={() => this.closeNav("Hours")}>Hours</Link>
            <Link to="" onClick={() => this.closeNav("Hours")}>Chipman Tracker</Link>
            <Link to="" onClick={() => this.closeNav("TERRA")}>TERRA</Link>
          </div>
        </div>
        {/* Use any element to open/show the overlay navigation menu */}
        <button className="btnHome" onClick={this.openNav}><FontAwesomeIcon icon={faBars} /></button>
        {this.state.showCal ? <div>
          <h2 style={{ color: "Naive" }}>My Calendar</h2>
          <Calendar
            id="myCalendar"
            onChange={this.calendarOnChange}
            value={this.state.calendarValue}
            tileContent={this.calendarTitleConent}
            onClickDay={this.onSelect}
          />
        </div> : <div className="loaderDiv"><div className="loader"></div><strong>Please wait...</strong></div>}
        {this.state.showModel ?
          <Modal show={this.state.showModel} modalClosed={this.closeModelHandler}>
            {model}
          </Modal> : null}
        <Alert show={this.state.showAlert} modalClosed={this.closeAlertHandler} message={this.state.alertMessage} confirm={this.state.alertConfirm} confirmYes={this.confirmYesHandler} />
      </div>
    );
  };
}

export default Home;