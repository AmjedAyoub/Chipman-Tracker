import React, { Component } from "react";
import axios from "axios";
import DatePicker from 'react-date-picker';
import DayView from "../../components/DayView/DayView";
import "./Hours.css";
class Hours extends Component {
  state = {
    schedule: [],
    userName: '',
    fromDate: null,
    toDate: new Date(),
    showHours: false
  }

  componentDidMount = async () => {
    await this.getSchedule();
  }

  getSchedule = async () => {
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
            fromDate: new Date(d.setDate(diff))
          });
        } else {
          this.setState({
            ...this.state,
            schedule: arr,
            userName: name,
            showHours: true
          })
        }
      })
      .catch(err => {
        this.setState({
          ...this.state,
          userName: name,
          showHours: true
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

  itemChanged = async () => {
    await this.getSchedule();
  }

  render() {

    let arr = [];
    let fromDate = this.state.fromDate;
    let toDate = this.state.toDate;
    let total = 0;
    this.state.schedule.forEach(element => {
      if (element.date !== "WILL BE UPDATED") {
        arr.push(element);
        if ((new Date(element.date).getDate() >= fromDate.getDate() && new Date(element.date).getMonth() >= fromDate.getMonth() && new Date(element.date).getFullYear() >= fromDate.getFullYear()) && (new Date(element.date).getDate() <= toDate.getDate() && new Date(element.date).getMonth() <= toDate.getMonth() && new Date(element.date).getFullYear() <= toDate.getFullYear())) {
          let a = element.hours.split(':');
          let hrs = parseInt(a[0]) * 60;
          let mins = parseInt(a[1]);
          total += hrs + mins;
        }
      }
    });
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

    return (
      <div className="hoursView">
        <div className="row myHeader">
          <div className="Col-sm-3">
            <h2>{this.state.userName}</h2>
          </div>
          <div className="Col-sm-9" style={{ margin: 'auto' }}>
            <h2 style={{ color: "Naive" }}>My Hours</h2>
          </div>
        </div>
        <div className="card card-body" style={{ background: 'lavenderblush' }}>
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
                  className={((new Date(item.date).getDate() >= fromDate.getDate() && new Date(item.date).getMonth() >= fromDate.getMonth() && new Date(item.date).getFullYear() >= fromDate.getFullYear()) && (new Date(item.date).getDate() <= toDate.getDate() && new Date(item.date).getMonth() <= toDate.getMonth() && new Date(item.date).getFullYear() <= toDate.getFullYear())) ? "row selected" : "row notSelected"}
                  style={{ display: 'flex', justifyContent: "space-evenly", border: '1px solid indianred', padding: '5px' }}>
                  <div className="Col-sm-4">
                    <label>Date:</label>
                    {item.date}
                  </div>
                  <div className="Col-sm-4">
                    <label>Hrs:</label>
                    <label>{item.hours}</label>
                  </div>
                  <div className="Col-sm-4">
                    <button className="btn btn-outline-warning" type="button" data-toggle="collapse" data-target={"#" + item._id} aria-expanded="false" aria-controls={item._id}>EDIT</button>
                  </div>
                  <div className="collapse" id={item._id}>
                    <DayView schedule={item} onChange={this.itemChanged} />
                  </div>
                </div>
                <hr></hr>
              </li>
            ))}
          </ul>
          : <div className="loaderDiv"><div className="loader"></div><strong>Please wait...</strong></div>}
      </div>
    )
  }
}

export default Hours;