import React, { Component } from "react";
import API from "../../utils/API";
import "./Fridge.css";
import FoodList from "../UI/FoodList/FoodList";
import axios from "axios";

class Fridge extends Component {
    state = {
        itemToAdd: '',
        quantityToAdd: '',
        unitToAdd: 'gr',
        items: [],
        file: null,
        receiptResults: [],
        ReceiptQuantityChange: '',
        ReceiptItemsChange: '',
        manageShow: false,
        receiptToUpload: 'Please select a receipt!',
        error: '',
        itemsUnits: ['teaspoon', 't', 'tsp', 'tablespoon', 'T', 'tbl', 'tbs', 'tbsp', 'ounce', 'fl', 'oz', 'gill', 'cup', 'c', 'pint', 'p', 'pt', 'quart', 'q', 'qt', "gallon", 'gl', 'gal', 'ml', 'milliliter', 'millilitre', 'cc', 'mL', 'l', 'liter', 'litre', 'L', 'dl', 'deciliter', 'decilitre', 'dL', 'pound', 'lb', '#', 'mg', 'milligram', 'milligramme', 'g', 'gr', 'gram', 'gramme', 'kg', 'kilogram', 'kilogramme']
    }

    componentDidMount() {
        axios.get("http://whatcook.herokuapp.com/AllItems/" + localStorage.getItem("userID"))
            .then(res => {
                if (res.status === "error") {
                    throw new Error(res.data.message);
                }
                res.data[0].items.sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) {
                        return -1;
                    }
                    if (a.name.toLowerCase() > b.name.toLowerCase()) {
                        return 1;
                    }
                    return 0;
                })
                this.setState({
                    ...this.state,
                    items: res.data[0].items
                })
            })
            .catch(err => this.setState({
                ...this.state,
                error: err.message
            }));
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

    pictureChangedHandler = event => {
        this.setState({
            ...this.state,
            file: event.target.files[0],
            loaded: 0,
            receiptToUpload: event.target.value
        })
    }

    receiptItemDeleteHandler = (i, event) => {
        let users = [...this.state.receiptResults];
        users.splice(i, 1);
        this.setState({
            ...this.state,
            receiptResults: users
        });
    }

    receiptItemsChangedHandler = (i, event) => {
        const { name, value } = event.target;
        let users = [...this.state.receiptResults];
        users[i] = { ...users[i], [name]: value };
        this.setState({
            ...this.state,
            receiptResults: users
        });
    }

    submitReceiptHandler = event => {
        event.preventDefault();
        API.takePicture(this.state.file)
            .then(res => {
                for (let i = 0; i < res.data.annotations.length; i++) {
                    res.data.annotations[i].tag = 1;
                    res.data.annotations[i].unit = 'gr';
                }
                res.data.annotations.sort((a, b) => {
                    if (a.annotation < b.annotation) {
                        return -1;
                    }
                    if (a.annotation > b.annotation) {
                        return 1;
                    }
                    return 0;
                })
                this.setState({
                    ...this.state,
                    receiptResults: res.data.annotations
                })
            })
            .catch(err => console.log(err));
    }

    itemNameChangedHandler = (event, id, idx) => {
        const newItems = [...this.state.items];
        newItems[idx].name = event.target.value;
        this.setState({
            ...this.state,
            items: newItems
        })
    }

    itemQuantityChangedHandler = (event, id, idx) => {
        const newItems = [...this.state.items];
        newItems[idx].quantity = event.target.value;
        this.setState({
            ...this.state,
            items: newItems
        })
    }

    itemUnitChangedHandler = (event, id, idx) => {
        const newItems = [...this.state.items];
        newItems[idx].unit = event.target.value;
        this.setState({
            ...this.state,
            items: newItems
        })
    }

    itemToAddChangedHandler = (event) => {
        this.setState({
            ...this.state,
            itemToAdd: event.target.value
        })
    }

    quantityToAddChangedHandler = (event) => {
        this.setState({
            ...this.state,
            quantityToAdd: event.target.value
        })
    }

    unitToAddChangedHandler = (event) => {
        this.setState({
            ...this.state,
            unitToAdd: event.target.value
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
            <div className="Fridge">
                {this.props.isManaging || this.state.manageShow ? <h2>Manage Inventory</h2> : <h2>My items</h2>}
                {!this.props.isManaging ?
                    <div>
                        <button className="btn btn-outline-danger" data-toggle="collapse" data-target="#collapseManage" aria-expanded="false" aria-controls="collapseManage" onClick={this.manageShowHandler}>Manage</button>
                    </div> : null}
                <hr></hr>
                <div className={this.props.isManaging ? "collapsed" : "collapse"} id="collapseManage">
                    <div className="card card-body">
                        <div className="row" style={{ justifyContent: 'center', border: '1px solid indianred', padding: '5px' }}>
                            <div className="Col-md-3 button-wrap">
                                <label className="btn primary" htmlFor="upload">Select Receipt</label>
                                <input id="upload" onChange={this.pictureChangedHandler} type="file" encType="multipart/form-data" name="file" />
                            </div>
                            <div className="Col-md-6">
                                <input type="text" value={this.state.receiptToUpload} readOnly={true} style={{ width: '100%' }} />
                            </div>
                            <div className="Col-md-3 ml-3">
                                <button className="btn success" onClick={this.submitReceiptHandler}>Upload Receipt</button>
                            </div>
                        </div>
                        <div className="row mt-2" style={{ justifyContent: 'space-between' }}>
                            <div className="Col-md-4" style={{ display: 'inline' }}>
                                <label>Item:</label>
                                <input type="text" value={this.state.itemToAdd} onChange={(event) => this.itemToAddChangedHandler(event)} />
                            </div>
                            <div className="Col-md-4" style={{ display: 'inline' }}>
                                <label>Quantity:</label>
                                <input type="number" value={this.state.quantityToAdd} onChange={(event) => this.quantityToAddChangedHandler(event)} />
                                <select className="custom-select" id="SelectUnit" style={{ width: 'max-content' }} onChange={(event) => this.unitToAddChangedHandler(event)}>
                                    {this.state.itemsUnits.map((u, i) => (
                                        <option key={u + "" + i} value={u}>{u}.</option>
                                    ))}
                                </select>
                            </div>
                            <div className="Col-md-4">
                                <button className="btn warning" onClick={this.addItemHandler}>Add Item</button>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="row mt-2" style={{ justifyContent: 'center' }}>
                            <FoodList
                                groceryResults={this.state.receiptResults}
                                receiptItemDeleteHandler={(i, event) => this.receiptItemDeleteHandler(i, event)}
                                receiptItemsChangedHandler={this.receiptItemsChangedHandler}
                                addItemsHandler={() => this.addItemsHandler()} />
                        </div>
                    </div>
                    <hr></hr>
                </div>
                {this.state.items.length > 0 ? <ul>
                    {this.state.items.map((item, index) => (
                        <li key={item._id}>
                            <div className="row" style={{ justifyContent: 'space-between' }}>
                                <div className="Col-md-3" style={{ marginBlock: 'auto' }}>
                                    <img alt="" src={item?.image || ''} style={{ width: '60px', height: '60px', padding: '5px', borderRadius: '50%' }} />
                                </div>
                                <div className="Col-md-3" style={{ marginBlock: 'auto' }}>
                                    {this.props.isManaging || this.state.manageShow ?
                                        <input value={item.name ? item.name.toLowerCase() : item.annotation.toLowerCase()} onChange={(event) => this.itemNameChangedHandler(event, item._id, index)} /> : <h6>{item.name.toLowerCase()}</h6>
                                    }
                                </div>
                                <div className="Col-md-3" style={{ marginBlock: 'auto', display: 'inline' }}>
                                    {this.props.isManaging || this.state.manageShow ? <div>
                                        <input value={+item.quantity.toFixed(2)} onChange={(event) => this.itemQuantityChangedHandler(event, item._id, index)} />
                                        <select onChange={(event) => this.itemUnitChangedHandler(event, item._id, index)} className="custom-select" id="SelectUnit" style={{ width: 'max-content' }}>
                                            <option key={item.unit} value={item.unit} >{item.unit}.</option>
                                            {this.state.itemsUnits.map((u, i) => (
                                                <option key={u + "" + i} value={u}>{u}.</option>
                                            ))}
                                        </select></div> : <h6>{+item.quantity.toFixed(2)}<span> ({item.unit})</span></h6>}
                                </div>
                                {
                                    this.state.manageShow || this.props.isManaging ? <div className="Col-md-3" style={{ marginBlock: 'auto' }}>
                                        <button className="btn success" onClick={() => this.updateItemHandler(index)}>Update</button>
                                        <button className="btn danger" onClick={() => this.deleteItemHandler(index)}><strong>X</strong></button>
                                    </div> : null
                                }
                            </div>
                        </li>
                    ))}
                </ul> : <h3>You have no items!</h3>}

            </div>
        )
    }
}

export default Fridge;