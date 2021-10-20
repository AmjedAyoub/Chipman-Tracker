import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import { faBars } from '@fortawesome/free-solid-svg-icons';


import Modal from "../../components/UI/Modal/Modal";
import Alert from "../../components/UI/Alert/Alert";
import DayView from "../../components/DayView/DayView";
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
    showCal: false,
    viewContent: "",
    scheduleToView: null
  }


  componentDidMount = async () => {
    const token = localStorage.getItem('googleToken');
    const email = localStorage.getItem('googleEmail');
    await this.getSchedule();
    if (token) {
      await this.getMessages(token, email);
    }
    this.setState({
      ...this.state,
      viewContent: "calendarView"
    })
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
        scope: ["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/cloud-platform"],
        maxResults: 500,
        q: "from:.*\.chipmanrelo.com$",
        javascript_origins:["https://chipmantrack.herokuapp.com","http://localhost:3000"],auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs"
      },
      params: {
        client_id: "826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret: "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",
        redirect_uris: ["https://chipmantrack.herokuapp.com", "http://localhost:3000"],
        key: "AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: ["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/cloud-platform"],
        access_token: token,
        maxResults: 500,
        q: "from:.*\.chipmanrelo.com$",
        javascript_origins:["https://chipmantrack.herokuapp.com","http://localhost:3000"],auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs"
      },
      auth: {
        client_id: "826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
        client_secret: "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",
        redirect_uris: ["https://chipmantrack.herokuapp.com", "http://localhost:3000"],
        key: "AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
        scope: ["https://www.googleapis.com/auth/gmail.readonly","https://www.googleapis.com/auth/cloud-platform"],
        access_token: token,
        maxResults: 500,
        q: "from:.*\.chipmanrelo.com$",
        javascript_origins:["https://chipmantrack.herokuapp.com","http://localhost:3000"],auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs"
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
          scope: "https://www.googleapis.com/auth/gmail.readonly",
          javascript_origins:["https://chipmantrack.herokuapp.com","http://localhost:3000"],auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs"
        },
        params: {
          client_id: "826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
          client_secret: "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",
          redirect_uris: ["https://chipmantrack.herokuapp.com", "http://localhost:3000"],
          key: "AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
          scope: "https://www.googleapis.com/auth/gmail.readonly",
          access_token: token,
          format: 'raw',
          javascript_origins:["https://chipmantrack.herokuapp.com","http://localhost:3000"],auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs"
        },
        auth: {
          client_id: "826665210451-qb32sd39ve6ep325dumgjs3ipjrs6ec7.apps.googleusercontent.com",
          client_secret: "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",
          redirect_uris: ["https://chipmantrack.herokuapp.com", "http://localhost:3000"],
          key: "AIzaSyAdhfelovI7DcOC5GwTEF6gxRvvs9Zmazs",
          scope: "https://www.googleapis.com/auth/gmail.readonly",
          access_token: token,
          javascript_origins:["https://chipmantrack.herokuapp.com","http://localhost:3000"],auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs"
        }
      })
        .then((message) => {
          let m = Buffer.from(message.data.raw, 'base64').toString('ascii');
          let content = "";
          let updateContent;
          let updateStart = m.indexOf("Update");
          let updateEnd = m.indexOf("MOVE DETAILS");
          if (updateStart > -1 && updateEnd > -1) {
            updateContent = m.substring(updateStart, updateEnd);
            updateStart = updateContent.indexOf("Update");
            if (updateContent.indexOf("On Mon,") > -1) {
              updateContent = updateContent.substring(updateStart, updateContent.indexOf("On Mon,"));
            } else if (updateContent.indexOf("On Tue,") > -1) {
              updateContent = updateContent.substring(updateStart, updateContent.indexOf("On Tue,"));
            } else if (updateContent.indexOf("On Wen,") > -1) {
              updateContent = updateContent.substring(updateStart, updateContent.indexOf("On Wen,"));
            } else if (updateContent.indexOf("On Thu,") > -1) {
              updateContent = updateContent.substring(updateStart, updateContent.indexOf("On Thu,"));
            } else if (updateContent.indexOf("On Fri,") > -1) {
              updateContent = updateContent.substring(updateStart, updateContent.indexOf("On Fri,"));
            } else if (updateContent.indexOf("On Sat,") > -1) {
              updateContent = updateContent.substring(updateStart, updateContent.indexOf("On Sat,"));
            } else if (updateContent.indexOf("On Sun,") > -1) {
              updateContent = updateContent.substring(updateStart, updateContent.indexOf("On Sun,"));
            }
            updateContent = this.replaceAll(updateContent, '\r', '');
            updateContent = this.replaceAll(updateContent, '\n', ' ');
          }
          let start = m.indexOf("MOVE DETAILS");
          let end = m.indexOf("Black");
          if (start > -1 && end > -1) {
            content = m.substring(start, end);
            content = this.replaceAll(content, '>', '');
            content = this.replaceAll(content, '--', '');
            content = this.replaceAll(content, '=20', '');
            content = this.replaceAll(content, '*', '\n');
            content = this.replaceAll(content, '\r', '><');
            content = this.replaceAll(content, '\n', ' ');
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
            let scheduleContent = data.join('\n');
            let googleId = messages[idx].id;
            let mContent = { data: message.data };
            let schedule = {};
            if (updateContent) {
              schedule = {
                googleId: googleId,
                content: mContent,
                date: date,
                scheduleContent: scheduleContent,
                updated: true,
                updatedContent: updateContent
              }
            } else {
              schedule = {
                googleId: googleId,
                content: mContent,
                date: date,
                scheduleContent: scheduleContent
              }
            }
            this.addScheduleHandler(schedule);
            // console.log(schedule.scheduleContent);
          }
          else {
            let googleId = messages[idx].id;
            let mContent = { data: message.data };
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

  addScheduleHandler = async (schedule) => {
    await axios.post("https://chipmantrack.herokuapp.com/addSchedule", {
      userID: localStorage.getItem("userID"),
      googleId: schedule.googleId,
      content: schedule.content,
      date: schedule.date,
      scheduleContent: schedule.scheduleContent,
      updated: schedule.updated,
      updatedContent: schedule.updatedContent
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

  getSchedule = async () => {
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
      showModel: false,
      modelContent: ''
    });
  }

  openModelHandler = (content, sch) => {
    this.setState({
      ...this.state,
      scheduleToView: sch,
      showModel: true,
      modelContent: content
    });
  }

  calendarOnChange = () => {

  }

  calendarTitleConent = ({ date = new Date(), view = "month" }) => {
    let d = this.state.schedule.find((x, i) => (new Date(x.date).getDate() === date.getDate() && new Date(x.date).getMonth() === date.getMonth() && new Date(x.date).getFullYear() === date.getFullYear()));
    if (d) {
      let data = d.scheduleContent.split('\n');
      if (d.updated) {
        return <div className="dayView">
          <p style={{ fontSize: "10px", background: "lightsalmon" }}><strong>{d.updatedContent}</strong></p>
          {data.map((cont, i) => (
            <p key={cont + " " + i} style={{fontSize: "10px", background: "lightblue", marginBlock: "0px", margin: "0px", padding: "0px" }}>{cont}</p>
          ))}
        </div>
      } else {
        return <div className="dayView">{data.map((cont, i) => (
          <p key={cont + " " + i} style={{fontSize: "10px", background: "lightblue", marginBlock: "0px", margin: "0px", padding: "0px" }}>{cont}</p>
        ))}
        </div>
      }
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
    } else if (navBtn !== "close") {
      this.changeViewHandler(navBtn);
    }
  }

  compDidChanged = () => {
    this.closeNav("close")
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
    if (d) {
      this.openModelHandler("DayView", d)
    }
  }

  changeViewHandler = (content) => {
    this.setState({
      ...this.state,
      viewContent: content
    })
  }

  render() {
    let page = null;
    let model = null;

    switch (this.state.modelContent) {
      case 'DayView':
        model = (
          <DayView schedule={this.state.scheduleToView} />
        );
        break;
      default:
        model = null;
        break;
    }

    switch (this.state.viewContent) {
      case 'calendarView':
        page = (
          this.state.showCal ?
            <div className="myCalendar">
              <h2 style={{ color: "Naive" }}>My Calendar</h2>
              <Calendar
                id="myCalendar"
                onChange={this.calendarOnChange}
                value={this.state.calendarValue}
                tileContent={this.calendarTitleConent}
                onClickDay={this.onSelect}
              />
            </div>
            : <div className="loaderDiv"><div className="loader"></div><strong>Please wait...</strong></div>
        );
        break;
      case 'chipmanView':
        page = (
          <div>
            <div className="row"style={{justifyContent:'center', marginTop: "10%"}}>
              <div className="Col-md-3" style={{marginBlock:'auto'}}>
                  <img alt="" src="https://sismo.app/wp-content/uploads/2019/02/under-construction-gif-11.gif" style={{width:'220px', height:'220px', padding:'5px'}}/>
                  <h6>Hey, welcome to chipman tracker, maybe this part will be our future inventory system</h6>
              </div>
            </div>
          </div>
        );
        break;case 'hoursView':
        page = (
          <div>
            <div className="row"style={{justifyContent:'center', marginTop: "10%"}}>
              <div className="Col-md-3" style={{marginBlock:'auto'}}>
                  <img alt="" src="https://sismo.app/wp-content/uploads/2019/02/under-construction-gif-11.gif" style={{width:'220px', height:'220px', padding:'5px'}}/>
                  <h6>Hey, welcome to the hours section, here we will be able to manage our hours and view them in a very nice way!!</h6>
                  <h6>Coming very soon!!</h6>
              </div>
            </div>
          </div>
        );
        break
      default:
        page = (
          this.state.showCal ?
            <div className="myCalendar">
              <h2 style={{ color: "Naive" }}>My Calendar</h2>
              <Calendar
                id="myCalendar"
                onChange={this.calendarOnChange}
                value={this.state.calendarValue}
                tileContent={this.calendarTitleConent}
                onClickDay={this.onSelect}
              />
            </div>
            : <div className="loaderDiv"><div className="loader"></div><strong>Please wait...</strong></div>
        );
        break;
    }

    return (
      <div className="Home">
        <div id="myNav" className="overlay">
          {/* Button to close the overlay navigation */}
          <button id="closeMenuBtn" className="closebtn" onClick={() => this.closeNav("close")}>&times;</button>
          {/* Overlay content */}
          <div className="overlay-content">
            <Logintbygoogle checked={() => this.compDidChanged()} />
            <button className="navbtn" onClick={() => this.closeNav("calendarView")}>Calendar</button>
            <button className="navbtn" onClick={() => this.closeNav("hoursView")}>Hours</button>
            <button className="navbtn" onClick={() => this.closeNav("chipmanView")}>Chipman Tracker</button>
            <button className="navbtn" onClick={() => this.closeNav("TERRA")}>TERRA</button>
          </div>
        </div>
        {/* Use any element to open/show the overlay navigation menu */}
        <button className="btnHome" onClick={this.openNav}><FontAwesomeIcon icon={faBars} /></button>
        {page}
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