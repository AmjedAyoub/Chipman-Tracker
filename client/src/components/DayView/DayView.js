import React, { Component } from "react";
import { TimePicker } from '@material-ui/pickers';
import { alpha } from '@material-ui/core/styles';
import API from "../../utils/API";
import "./DayView.css";
import axios from "axios";

class DayView extends Component {
    state = {
        error: '',
        lunch: '00',
        start: '',
        end: '',
        total: '',
        lunchTime: ['00', '30 min.', '45 min.', '1 hr.']
    }

    componentDidMount = () => {
        let t = this.props.schedule.shift.start;
        t = t.split(':')
        let val1 = new Date(this.props.schedule.date).setHours(t[0]);
        val1 = val1 + t[1]*60000;
        let t2 = this.props.schedule.shift.end;
        t2 = t2.split(':')
        let val2 = new Date(this.props.schedule.date).setHours(t2[0]);
        val2 = val2 + t2[1]*60000;
        this.setState({
            ...this.state,
            start: val1,
            end: val2,
            hours: this.props.schedule.shift.hours,
            lunch: this.props.schedule.shift.lunch
        })
    }

    componentDidUpdate() {
        if (this.props.isManaging && this.state.manageShow) {
            this.setState({
                ...this.state,
                manageShow: false
            })
        }
    }

    manageShowHandler = () => {
        this.setState((prevState) => {
            return {
                ...prevState,
                manageShow: !prevState.manageShow
            }
        })
    }

    lunchUnitChangedHandler = (event) => {
        this.setState({
            ...this.state,
            lunch: event.target.value
        })
    }

    startToAddChangedHandler = (event) => {
        if(event){
            let nowTime = new Date();
            nowTime.setHours(0 + event.getHours());
            nowTime.setMinutes(0 + event.getMinutes());
             this.setState({
                 ...this.state,
                 start: nowTime
             })
        }
    }

    endToAddChangedHandler = (event) => {
        if(event){
            let nowTime = new Date();
            nowTime.setHours(0 + event.getHours());
            nowTime.setMinutes(0 + event.getMinutes());
             this.setState({
                 ...this.state,
                 end: nowTime
             })
        }
    }

    getValue = (e) => {
        console.log(e)
    }

    unitToAddChangedHandler = (event) => {
        this.setState({
            ...this.state,
            lunch: event.target.value
        })
    }

    addItemHandler = () => {
        axios.post("http://whatcook.herokuapp.com/addItems", {
            userID: localStorage.getItem("userID"),
            name: this.state.itemToAdd,
            quantity: this.state.quantityToAdd,
            unit: this.state.unitToAdd,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtUW-NhL541eHkTOKzBjghAfFPz-D1FUHjNQ&usqp=CAU"
        }
        )
            .then(res => {
                if (res.status === "error") {
                    throw new Error(res.data.message);
                }
                axios.get("http://whatcook.herokuapp.com/AllItems/" + localStorage.getItem("userID"))
                    .then(res => {

                        if (res.status === "error") {
                            throw new Error(res.data.message);
                        }
                        res.data[0].items.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        })
                        this.setState({
                            ...this.state,
                            items: res.data[0].items,
                            itemToAdd: '',
                            quantityToAdd: '',
                            unitToAdd: ''
                        })
                    })
                    .catch(err => this.setState({ error: err.message }));
            })
            .catch(err => this.setState({ error: err.message }));

    }

    updateItemHandler = (id) => {
        console.log(this.state.items[id]);
        axios.post("http://whatcook.herokuapp.com/updateItem", {
            userID: localStorage.getItem("userID"),
            itemID: this.state.items[id]._id,
            name: this.state.items[id].name,
            quantity: this.state.items[id].quantity,
            unit: this.state.items[id].unit
        }
        )
            .then(res => {
                if (res.status === "error") {
                    throw new Error(res.data.message);
                }
                axios.get("http://whatcook.herokuapp.com/AllItems/" + localStorage.getItem("userID"))
                    .then(res => {
                        if (res.status === "error") {
                            throw new Error(res.data.message);
                        }
                        res.data[0].items.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        })
                        this.setState({
                            ...this.state,
                            items: res.data[0].items
                        })
                    })
                    .catch(err => this.setState({ error: err.message }));
            })
            .catch(err => this.setState({ error: err.message }));
    }

    deleteItemHandler = (id, event) => {
        axios.post("http://whatcook.herokuapp.com/deleteItem", {
            userID: localStorage.getItem("userID"),
            itemID: this.state.items[id]._id,
        })
            .then(res => {
                if (res.status === "error") {
                    throw new Error(res.data.message);
                }
                axios.get("http://whatcook.herokuapp.com/AllItems/" + localStorage.getItem("userID"))
                    .then(res => {
                        if (res.status === "error") {
                            throw new Error(res.data.message);
                        }
                        this.setState({
                            ...this.state,
                            items: res.data[0].items
                        })
                    })
                    .catch(err => this.setState({ error: err.message }));
            })
            .catch(err => this.setState({ error: err.message }));
    }

    render() {
        return (
            <div className="DayView">
                <div className={this.props.isManaging ? "collapsed" : "collapse"} id="collapseManage">
                    <div className="card card-body">
                        <div className="row" style={{ justifyContent: 'center', border: '1px solid indianred', padding: '5px' }}>
                            <div className="Col-sm-12 button-wrap">
                                <h5>{this.props.schedule.date}</h5>
                                <hr></hr>
                                {this.props.schedule.updated ? <h6 style={{ background: "lightsalmon" }}><strong>{this.props.schedule.updatedContent}</strong></h6> : null}
                                <h6 style={{ background: "lightblue" }}>{this.props.schedule.scheduleContent}</h6>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="row " style={{ justifyContent: 'space-between' }}>
                            <h6>Total hours: {this.props.schedule.shift.hours}</h6>
                        </div>
                        <div className="row " style={{ justifyContent: 'center', display: 'flex' }}>
                            <div className="Col-md-4" style={{ display: 'inline' }}>
                                <h6>From:</h6>
                                    <TimePicker
                                    className="mt-2 mb-2"
                                    style={{cursor:'pointer'}}
                                    clearable
                                    ampm={false}
                                    openTo="hours"
                                    views={["hours", "minutes"]}
                                    format="HH:mm"
                                    label={"Select Time"}
                                    value={new Date(this.state.start)}
                                    onChange={(e) => this.startToAddChangedHandler(e)}/>
                            </div>
                            <div className="Col-md-4" style={{ display: 'inline' }}>
                                <h6>To:</h6>
                                    <TimePicker
                                    className="mt-2 mb-2"
                                    style={{cursor:'pointer'}}
                                    clearable
                                    ampm={false}
                                    openTo="hours"
                                    views={["hours", "minutes"]}
                                    format="HH:mm"
                                    label={"Select Time"}
                                    value={new Date(this.state.end)}
                                    onChange={(e) => this.endToAddChangedHandler(e)}/>
                            </div>
                            <div className="Col-md-4">
                                <h6>Lunch:</h6>
                                <select onChange={(event) => this.lunchUnitChangedHandler(event)} className="custom-select" id="SelectUnit" style={{ width: '70px' }}>
                                    <option key={this.state.lunch} value={this.state.lunch} >{this.state.lunch}.</option>
                                    {this.state.lunchTime.map((u, i) => (
                                        <option key={u + "" + i} value={u}>{u}.</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="row " style={{ justifyContent: 'space-between' }}>
                            <button className="btn success" onClick={() => this.updateItemHandler()}>SAVE</button>
                            <button className="btn danger" onClick={() => this.deleteItemHandler()}><strong>X</strong></button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DayView;