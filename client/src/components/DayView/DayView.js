import React, { Component } from "react";
import { TimePicker } from '@material-ui/pickers';
import "./DayView.css";
import axios from "axios";

class DayView extends Component {
    state = {
        error: '',
        lunch: '00',
        start: '',
        end: '',
        hours: '',
        minutes: '',
        lunchTime: ['00', '30 min.', '45 min.', '1 hr.'],
        lunchShow: [],
        success: false
    }

    componentDidMount = () => {
        let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
        let t = this.props.schedule.start;
        t = t.split(':')
        let val1 = today.setHours(t[0]);
        val1 = val1 + t[1] * 60000;
        let t2 = this.props.schedule.end;
        t2 = t2.split(':')
        let val2 = today.setHours(t2[0]);
        val2 = val2 + t2[1] * 60000;
        let arr = [];
        for (let i = 0; i < this.state.lunchTime.length; i++) {
            if (this.props.schedule.lunch !== this.state.lunchTime[i]) {
                arr.push(this.state.lunchTime[i]);
            }
        }
        let hrs = this.props.schedule.hours.split(':');
        this.setState({
            ...this.state,
            start: new Date(val1),
            end: new Date(val2),
            hours: hrs[0],
            minutes: hrs[1],
            lunch: this.props.schedule.lunch,
            lunchShow: arr,
            success: false
        })
    }

    lunchUnitChangedHandler = (event) => {
        let arr = [];
        for (let i = 0; i < this.state.lunchTime.length; i++) {
            if (event.target.value !== this.state.lunchTime[i]) {
                arr.push(this.state.lunchTime[i]);
            }
        }
        this.calculateHours(this.state.start, this.state.end, event.target.value, arr);
    }

    startToAddChangedHandler = (event) => {
        if (event) {
            let nowTime = new Date();
            nowTime.setHours(0 + event.getHours());
            nowTime.setMinutes(0 + event.getMinutes());
            this.calculateHours(nowTime, this.state.end, this.state.lunch);
        }
    }

    endToAddChangedHandler = (event) => {
        if (event) {
            let nowTime = new Date();
            nowTime.setHours(0 + event.getHours());
            nowTime.setMinutes(0 + event.getMinutes());
            this.calculateHours(this.state.start, nowTime, this.state.lunch);
        }
    }

    calculateHours = (start, end, lunch, arr = null) => {
        let hours = end.getTime() - start.getTime();
        if (lunch === "30 min.") {
            hours = new Date(hours).getTime() - 30 * 60000;
        } else if (lunch === "45 min.") {
            hours = new Date(hours).getTime() - 45 * 60000;
        } else if (lunch === "1 hr.") {
            hours = new Date(hours).getTime() - 60 * 60000;
        }
        var diffHrs = Math.floor((hours % 86400000) / 3600000); // hours
        var diffMins = Math.round(((hours % 86400000) % 3600000) / 60000);
        if (arr) {
            this.setState({
                ...this.state,
                hours: diffHrs,
                minutes: diffMins,
                start: start,
                end: end,
                lunch: lunch,
                lunchShow: arr
            })
        } else {
            this.setState({
                ...this.state,
                hours: diffHrs,
                minutes: diffMins,
                start: start,
                end: end,
                lunch: lunch
            })
        }
    }

    unitToAddChangedHandler = (event) => {
        this.setState({
            ...this.state,
            lunch: event.target.value
        })
    }

    updateItemHandler = () => {
        let start = this.state.start.getHours() +':'+ this.state.start.getMinutes();
        let end = this.state.end.getHours() +':'+ this.state.end.getMinutes();
        let hours = this.state.hours + ':' + this.state.minutes;
        axios.post("https://chipmantrack.herokuapp.com/updateItem", {
            userID: localStorage.getItem("userID"),
            scheduleID: this.props.schedule._id,
            start: start,
            end: end,
            lunch: this.state.lunch,
            hours: hours
        }
        )
            .then(res => {
                if (res.status === "error") {
                    throw new Error(res.data.message);
                }
                this.props.schedule.start = start;
                this.props.schedule.end = end;
                this.props.schedule.lunch = this.state.lunch;
                this.props.schedule.hours = hours;
                let d = hours.split(':');
                let t = this.props.schedule.start;
                let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                t = t.split(':')
                let val1 = today.setHours(t[0]);
                val1 = val1 + t[1] * 60000;
                let t2 = this.props.schedule.end;
                t2 = t2.split(':')
                let val2 = today.setHours(t2[0]);
                val2 = val2 + t2[1] * 60000;
                this.setState({
                    ...this.state,
                    start: new Date(val1),
                    end: new Date(val2),
                    hours: d[0],
                    minutes: d[1],
                    success: true
                })
                // alert("Data has been saved");
            })
            .catch(err => this.setState({ error: err.message }));
    }

    resetHandler = () => {
        let today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
        let t = this.props.schedule.start;
        t = t.split(':')
        let val1 = today.setHours(t[0]);
        val1 = val1 + t[1] * 60000;
        let t2 = this.props.schedule.end;
        t2 = t2.split(':')
        let val2 = today.setHours(t2[0]);
        val2 = val2 + t2[1] * 60000;
        let arr = [];
        for (let i = 0; i < this.state.lunchTime.length; i++) {
            if (this.props.schedule.lunch !== this.state.lunchTime[i]) {
                arr.push(this.state.lunchTime[i]);
            }
        }
        let hrs = this.props.schedule.hours.split(':');
        this.setState({
            ...this.state,
            start: new Date(val1),
            end: new Date(val2),
            hours: hrs[0],
            minutes: hrs[1],
            lunch: this.props.schedule.lunch,
            lunchShow: arr,
            success: false
        })
    }

    render() {
        let data = this.props.schedule.scheduleContent.split('\n');
        return (
            <div className="DayView">
                <div className={this.props.isManaging ? "collapsed" : "collapse"} id="collapseManage">
                    <div className="card card-body">
                        <div className="row" style={{ justifyContent: 'center', border: '1px solid indianred', padding: '5px' }}>
                            <div className="Col-sm-12 button-wrap">
                                <h5>{this.props.schedule.date}</h5>
                                <hr></hr>
                                {this.props.schedule.updated ? <h6 style={{ background: "lightsalmon" }}><strong>{this.props.schedule.updatedContent}</strong></h6> : null}
                                {data.map((cont, i) => (
                                    <h6 key={cont + " " + i} style={{ background: "lightblue", marginBlock: "0px", margin: "0px", padding: "0px" }}>{cont}</h6>
                                ))}
                            </div>
                        </div>
                        <hr></hr>
                        <div className="row " style={{ justifyContent: 'space-between' }}>
                            <label style={{ background: 'yellow', padding: '5px' }}>Total hours: {this.state.hours}:{this.state.minutes}</label>
                        </div>
                        <div className="row " style={{ justifyContent: 'center', display: 'flex' }}>
                            <div className="Col-md-4" style={{ display: 'inline' }}>
                                {/* <h6>From:</h6> */}
                                <TimePicker
                                    className="mt-2 mb-2"
                                    style={{ cursor: 'pointer' }}
                                    clearable
                                    ampm={false}
                                    openTo="hours"
                                    views={["hours", "minutes"]}
                                    format="HH:mm"
                                    label={"From"}
                                    value={new Date(this.state.start)}
                                    onChange={(e) => this.startToAddChangedHandler(e)} />
                            </div>
                            <div className="Col-md-4" style={{ display: 'inline' }}>
                                {/* <h6>To:</h6> */}
                                <TimePicker
                                    className="mt-2 mb-2"
                                    style={{ cursor: 'pointer' }}
                                    clearable
                                    ampm={false}
                                    openTo="hours"
                                    views={["hours", "minutes"]}
                                    format="HH:mm"
                                    label={"To"}
                                    value={new Date(this.state.end)}
                                    onChange={(e) => this.endToAddChangedHandler(e)} />
                            </div>
                            <div className="Col-md-4">
                                <label>Lunch:</label>
                                <select onChange={(event) => this.lunchUnitChangedHandler(event)} className="custom-select" id="SelectUnit" style={{ width: '70px' }}>
                                    <option key={this.state.lunch} value={this.state.lunch} >{this.state.lunch}.</option>
                                    {this.state.lunchShow.map((u, i) => (
                                        <option key={u + "" + i} value={u}>{u}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <hr></hr>
                        <div className={this.state.success ? "successSave" : ""}>
                            <div className="row" style={{ justifyContent: 'space-between' }}>
                                <button className="btn success" onClick={this.updateItemHandler}>SAVE</button>
                                <button className="btn danger" onClick={this.resetHandler}><strong>RESET</strong></button>
                                {this.state.success ? <h6 style={{color: "darkgreen"}}>Saved successfully!</h6> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DayView;