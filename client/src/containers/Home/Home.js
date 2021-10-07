import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from "axios";
import { faHouseUser, faDoorOpen, faFire, faSignOutAlt, faSink, faListOl, faSearch, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';

import Modal from "../../components/UI/Modal/Modal";
import Alert from "../../components/UI/Alert/Alert";
import Fridge from "../../components/Fridge/Fridge";
import Cook from "../../components/Cook/Cook";
import Steps from "../../components/Steps/Steps";
import Search from '../../components/Search/Search';
import Wash from "../../components/Wash/Wash";
import Recipe from "../../components/Recipe/Recipe";

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
            let ingQuery="";
            for (let i = 0; i < res.data[0].items.length; i++) {
              ingQuery = ingQuery + res.data[0].items[i].name.toLowerCase() + ", ";        
            }
            if(+res.data[0].cookingId !== 0 && !this.state.isCooking){
               axios({
                 method: 'GET',
                 url: "https://api.spoonacular.com/recipes/" + res.data[0].cookingId + "/information",
                 params: {
                   apiKey: "ef31eccf28bc49dfb4278f7d8b66d1ab",
                   id: res.data[0].cookingId,
                   includeNutrition: true
                 }
               })
                 .then((response) => {
                  let nowT = new Date();
                  let da = new Date(res.data[0].finishTime);
                  if(da.getTime() > nowT.getTime()){
                    this.setState({
                      ...this.state,
                      recipeToCook: response.data,
                      isCooking: true,
                      steps: response.data.analyzedInstructions[0].steps,
                      myMeals: res.data[0].meals,
                      ingredientsQuery: ingQuery,
                      items: res.data[0].items,
                      washingLoads: res.data[0].washLoads,
                      timer: true,
                      finishTime: da
                    })
                    this.startTimer(da);
                  }else{                    
                    this.setState({
                      ...this.state,
                      recipeToCook: response.data,
                      isCooking: true,
                      steps: response.data.analyzedInstructions[0].steps,
                      myMeals: res.data[0].meals,
                      ingredientsQuery: ingQuery,
                      items: res.data[0].items,
                      washingLoads: res.data[0].washLoads,
                      timer: false,
                      finishTime: null
                    })
                  }
                 })
                 .catch((err) => {
                   console.log(err);
                 });
            }else{
              this.setState({
                  ...this.state,
                  myMeals: res.data[0].meals,
                  ingredientsQuery: ingQuery,
                  items: res.data[0].items,
                  washingLoads: res.data[0].washLoads,
                  timer: false
              })
            }
        })
        .catch(err => this.setState({
            ...this.state,
            error: err.message
        }));
  }

  updateFinishTimeHandler = (finishTime) => {
      axios.post("http://whatcook.herokuapp.com/finishTime",{
        userID: localStorage.getItem("userID"),
        finishTime: finishTime
      }
    )
    .then(res => {
      if (res.status === "error") {
        throw new Error(res.data.message);
      }
    })
    .catch(err => this.setState({ error: err.message }));
  }

  updateWashHandler = (washLoads) => {
      axios.post("http://whatcook.herokuapp.com/wash",{
        userID: localStorage.getItem("userID"),
        washLoads: washLoads
      }
    )
    .then(res => {
      if (res.status === "error") {
        throw new Error(res.data.message);
      }
    })
    .catch(err => this.setState({ error: err.message }));
  }

  updateCookingHandler = (cookingId) => {
      axios.post("http://whatcook.herokuapp.com/cooking",{
        userID: localStorage.getItem("userID"),
        cookingId: cookingId
      }
    )
    .then(res => {
      if (res.status === "error") {
        throw new Error(res.data.message);
      }
    })
    .catch(err => this.setState({ error: err.message }));
  }

  startTimerHandler = (event) => {
    if(event){
      let nowTime = new Date();
      nowTime.setHours(nowTime.getHours() + event.getHours());
      nowTime.setMinutes(nowTime.getMinutes() + event.getMinutes());
      const finishTime = nowTime;
        if(event.getHours() !== 0 || event.getMinutes() !== 0){
            clearInterval(this.state.intervalCook);
            this.updateFinishTimeHandler(finishTime);
            this.startTimer(finishTime, event.getHours(), event.getMinutes());
        }
    }
  }

  startTimer = (finishTime, th = 0, tm = 0) => {    
    let time = setInterval(() => {
      const nowT = new Date();
        let diff = (finishTime.getTime() - nowT.getTime());
        let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((diff % (1000 * 60)) / 1000);
        let h = hours;
        let m = minutes;
        if(hours < 10){hours = "0"+hours;}
        if(minutes < 10){minutes = "0"+minutes;}
        if(seconds < 10){seconds = "0"+seconds;}
        if(th < 10){th = "0"+th;}
        if(tm < 10){tm = "0"+tm;}
        if(h <= 0 && m <= 0 && diff <= 0){
          finishTime = null;
          clearInterval(this.state.intervalCook);
          this.setState({
            ...this.state,
            timer: false,
            showHours: 0,
            showMinutes: 0,
            showSeconds: 0,
            intervalCook: null,
            finishTime: null,
            showAlert: true,
            alertMessage: 'Timer is done!',
            alertConfirm: false,
            tempRecipe: false
          })
          let d = new Date();
          this.updateFinishTimeHandler(d);
        }else{
          this.setState({
            ...this.state,
            showHours: hours,
            showMinutes: minutes,
            showSeconds: seconds,
            hours: th,
            minutes: tm,
            timer: true,
            finishTime: finishTime
          })
        }
    }, 1000);
    this.setState({
        ...this.state,
        intervalCook: time
    })
  }

  stopTimerHandler = () => {
    clearInterval(this.state.intervalCook);
    this.setState({
      ...this.state,
      timer: false,
      showHours: 0,
      showMinutes: 0,
      showSeconds: 0,
      intervalCook: null,
      finishTime: null,
      showAlert: true,
      alertMessage: 'Timer is done!',
      alertConfirm: false,
      tempRecipe: false
    })
    let d = new Date();
    this.updateFinishTimeHandler(d);
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

  switchToStepsHandler = () => {
    let missed = []
    for (const ing of this.state.recipeToCook.nutrition.ingredients) {
      let exists = false;
      for (const item of this.state.items) {
        if(ing.name.includes(item.name) || item.name.includes(ing.name)){
          exists = true;
          break;
        }
      }
      if(!exists && !missed.includes(ing)){
        missed.push(ing);
      }
    }
    this.setState({
      ...this.state,
      showModel: true,
      modelContent: 'Steps',
      isManaging: false,
      missedIngredients: missed
    });    
  }

  switchBackHandler = (prevPage) => {
    if(prevPage === 'Search'){
      this.setState({
        ...this.state,
        showModel: true,
        modelContent: 'Search',
        isManaging: false
      }); 
    }
    else{    
      this.setState({
        ...this.state,
        showModel: true,
        modelContent: 'Cook',
        isManaging: false
      });   
    }
  }

  switchToViewRecipeHandler = (recipe, prevPage) => {
    axios({
        method: 'GET',
        url: "https://api.spoonacular.com/recipes/" + recipe.id + "/information",
        params: {
        apiKey: "ef31eccf28bc49dfb4278f7d8b66d1ab",
        id: recipe.id,
        includeNutrition: true
        }
    }).then((response) => {
        // return res.json(response.data)
          let missed = []
          for (const ing of response.data.nutrition.ingredients) {
            let exists = false;
            for (const item of this.state.items) {
              if(ing.name.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(ing.name.toLowerCase())){
                exists = true;
                break;
              }
            }
            if(!exists && !missed.includes(ing)){
              missed.push(ing);
            }
          }
            this.setState({
              ...this.state,
              showModel: true,
              modelContent: 'Recipe',
              isManaging: false,
              prevPage: prevPage,
              recipeToView: response.data,
              stepsToView: response.data.analyzedInstructions[0]?.steps || [],
              missedIngredients: missed
            });
        })
        .catch((err) => {
        console.log(err);
        });
  }

  finishCookHandler = async() => {
    for (let i = 0; i < this.state.recipeToCook.nutrition.ingredients.length; i++) {
      await axios.post("http://whatcook.herokuapp.com/cookItems",{
        userID: localStorage.getItem("userID"),
        name: this.state.recipeToCook.nutrition.ingredients[i].name,
        quantity: this.state.recipeToCook.nutrition.ingredients[i].amount
      })
      .then(res => {
        if (res.status === "error") {
          throw new Error(res.data.message);
        }
      })
      .catch(err => this.setState({
        ...this.state,
         error: err.message }));
    }
    this.cook();
  }
  
  cook = () => {
    axios.post("http://whatcook.herokuapp.com/addRecipe",{
      userID: localStorage.getItem("userID"),
      id: this.state.recipeToCook.id,
      title: this.state.recipeToCook.title,
      image: this.state.recipeToCook.image,
      readyInMinutes: this.state.recipeToCook.readyInMinutes
    }).then((data) => {
      clearInterval(this.state.intervalCook);
      const load = this.state.washingLoads + 1;
      this.setState({
        ...this.state,
        recipeToCook: null,
        steps: null,
        isCooking: false,
        washingLoads: load,
        timer: false,
        showHours: 0,
        showMinutes: 0,
        showSeconds: 0,
        intervalCook: null,
        finishTime: null,
        hours: 0,
        minutes: 0,
        showAlert: true,
        alertMessage: 'Meal is done enjoy!',
        alertConfirm: false
      });
      this.updateWashHandler(load);
      this.updateCookingHandler(0);
      let d = new Date();
      this.updateFinishTimeHandler(d);  
    }).catch(function(err){
      console.log(err)
    });
  }

  recipeToCookHandler = (recipe) => {
    if(this.state.isCooking){
      this.openAlertHandler("Looks like you are already cooking another meal, Are you sure you want to switch?", true, recipe);
    }else{
      this.finishRecipeHandler(recipe);
    }
  }

  confirmYesHandler = () => {
    this.closeAlertHandler();
    this.finishRecipeHandler(this.state.tempRecipe); 
  }

  deleteRecipeHandler = (id) => {
    axios.post("http://whatcook.herokuapp.com/deleteRecipe",{
        userID: localStorage.getItem("userID"),
        recipeID: this.state.myMeals[id]._id,
      }
    )
    .then(res => {
      if (res.status === "error") {
        throw new Error(res.data.message);
      }
      this.componentDidMount();
    })
    .catch(err => this.setState({ error: err.message }));
  }

  viewRecipeToCookHandler = () => {
    if(this.state.isCooking){
      this.openAlertHandler("Looks like you are already cooking another meal, Are you sure you want to switch?", true, this.state.recipeToView.id);
    }else{
      this.finishRecipeHandler(this.state.recipeToView.id);
    }
  }

  finishRecipeHandler = (recipe) => {
    axios({
      method: 'GET',
      url: "https://api.spoonacular.com/recipes/" + recipe + "/information",
      params: {
        apiKey: "ef31eccf28bc49dfb4278f7d8b66d1ab",
        id: recipe,
        includeNutrition: true
      }
    })
      .then((response) => {
        // return res.json(response.data)
      clearInterval(this.state.intervalCook);
        this.setState({
          ...this.state,
          timer: false,
          showHours: 0,
          showMinutes: 0,
          showSeconds: 0,
          intervalCook: null,
          finishTime: null,
          hours: 0,
          minutes: 0,
          recipeToCook: response.data,
          isCooking: true,
          steps: response.data.analyzedInstructions[0]?.steps || [],
          showAlert: true,
          alertMessage: 'The meal has been added!',
          alertConfirm: false
        })
        this.updateCookingHandler(response.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  startWashHandler = () => {
      let time = setInterval(() => { 
          const newcount = (this.state.count - 1)*1000;
          let minutes = Math.floor((newcount % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((newcount % (1000 * 60)) / 1000);
          if(minutes < 10){minutes = "0" + minutes}
          if(seconds < 10){seconds = "0" + seconds}
          let c = minutes+":"+seconds;
          this.setState({
              ...this.state,
              count: newcount/1000,
              washCount: c
          })}, 1000);
      this.setState({
          ...this.state,
          washing: true,
          interval: time,
          timeOut: setTimeout(() => { this.finishWashHandler() }, 180000)
      })
  }
  
  finishWashHandler = () => {
      clearInterval(this.state.interval);
      clearTimeout(this.state.timeOut);
      this.setState({
        ...this.state,
        showAlert: true,
        alertMessage: 'Wash is done!',
        alertConfirm: false,
        tempRecipe: false,
          washing: false,
          interval: null,
          timeOut: null,
          count: 180,
          washingLoads: 0
      })
      this.updateWashHandler(0);
  }
  
  queryChangedHandler = (event) => {
    this.setState({
        ...this.state,
        query: event.target.value
    });
  }

  searchSubmitHandler = (query) => {
    if(query){
      axios({
          method: 'GET',
          url: "https://api.spoonacular.com/recipes/search",
          params: {
              apiKey: "ef31eccf28bc49dfb4278f7d8b66d1ab",
              number: 100,
              query: query,
              instructionsRequired: true
          }
      })
          .then((response) => {
              if(response.data.results.length > 0){
                //   return res.json(response.data)
                this.setState({
                    ...this.state,
                    recipesResults: response.data.results
                })
              }else{
                axios( {
                  method: 'GET',
                  headers:{
                    "Content-Type":"application/octet-stream"
                  },
                  url: "https://api.spoonacular.com/recipes/findByIngredients?apiKey=ef31eccf28bc49dfb4278f7d8b66d1ab", 
                  params:{
                    ingredients: query
                    }
                  })   
                  .then( (res) => {
                    this.setState({
                        ...this.state,
                        recipesResults: res.data
                    })
                  })
                  .catch( (err) => {
                    console.log(err);
                  });
              }
          })
          .catch(() => {
            axios( {
              method: 'GET',
              headers:{
                "Content-Type":"application/octet-stream"
              },
              url: "https://api.spoonacular.com/recipes/findByIngredients?apiKey=ef31eccf28bc49dfb4278f7d8b66d1ab", 
              params:{
                ingredients: query
                }
              })   
              .then( (response) => {
                this.setState({
                    ...this.state,
                    recipesResults: response.data
                })
              })
              .catch( (err) => {
                console.log(err);
              });
          });
    }
  }

  autoClickedHandler = () => {
    if(this.state.ingredientsQuery){
      axios( {
        method: 'GET',
        headers:{
          "Content-Type":"application/octet-stream"
        },
        url: "https://api.spoonacular.com/recipes/findByIngredients?apiKey=ef31eccf28bc49dfb4278f7d8b66d1ab", 
        params:{
          ingredients: this.state.ingredientsQuery
          }
        })   
        .then( (res) => {
          this.setState({
              ...this.state,
              recipesResults: res.data
          })
        })
        .catch( (err) => {
          console.log(err);
        });
    }
  }
  
  logoutHandler=()=>{
      localStorage.removeItem("userID");
      localStorage.clear("userID");
      localStorage.removeItem("token");
      localStorage.clear("token");
      // this.props.history.push("/Logging");
      this.props.checked();
      // window.location.reload();
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
          <Fridge isManaging={this.state.isManaging}/>
        );
        break;
      case 'Cook':
        model = (
          <Cook isCooking={this.state.isCooking}  cook={(recipe) => this.recipeToCookHandler(recipe)} recipe={this.state.recipeToCook} finish={this.finishCookHandler} viewSteps={() => this.switchToStepsHandler()} viewRecipe={(recipe, prevPage) => this.switchToViewRecipeHandler(recipe, prevPage)} myMeals={this.state.myMeals} deleteRecipe={(recipe) => this.deleteRecipeHandler(recipe)} hours={this.state.hours} minutes={this.state.minutes} seconds={this.state.seconds} getValue={(event) => this.startTimerHandler(event)} timer={this.state.timer} stopTimer={this.stopTimerHandler} showHours={this.state.showHours} showMinutes={this.state.showMinutes} showSeconds={this.state.showSeconds}/>
        );
        break
      case 'Steps':
        model = (
          <Steps isCooking={this.state.isCooking} recipe={this.state.recipeToCook} steps={this.state.steps} finish={this.finishCookHandler} missed={this.state.missedIngredients}/>
        );
        break
      case 'Search':
        model = (
          <Search cook={(recipe) => this.recipeToCookHandler(recipe)} viewRecipe={(recipe, prevPage) => this.switchToViewRecipeHandler(recipe, prevPage)} query={this.state.query} recipesResults={this.state.recipesResults} changed={(event) => this.queryChangedHandler(event)} clicked={(query) => this.searchSubmitHandler(query)} autoClicked={this.autoClickedHandler}/>
        );
        break
      case 'Wash':
        model = (
          <Wash loads={this.state.washingLoads} finishWash={this.finishWashHandler} washing={this.state.washing} startWash={this.startWashHandler} count={this.state.washCount}/>
        );
        break
      case 'Recipe':
        model = (
          <Recipe  recipe={this.state.recipeToView} steps={this.state.stepsToView} cook={() => this.viewRecipeToCookHandler()} back={() => this.switchBackHandler(this.state.prevPage)} missed={this.state.missedIngredients}/>
        );
        break
      default:
        model = null;
        break;
    }

    return (
      <div className="Home">
        <h1 className="Header">What To Cook?</h1>
        <Link to="/Home"><button className="Button btnHome" onClick={this.closeModelHandler} data-toggle="tooltip" data-placement="auto" title="Home Page"><FontAwesomeIcon className="fa-3x" icon={faHouseUser} /></button></Link>
        <button className="Button btnFridge" onClick={() => this.openModelHandler('Fridge', false)} data-toggle="tooltip" data-placement="auto" title="View Items"><FontAwesomeIcon className="fa-3x" icon={faDoorOpen} /></button>
        <button className="Button btnCook" onClick={() => this.openModelHandler('Cook', false)} data-toggle="tooltip" data-placement="auto" title="What's cooking?"><FontAwesomeIcon className="fa-3x" icon={faFire} /></button>
        <button className="Button btnSink" data-toggle="tooltip" data-placement="auto" title="Wash" onClick={() => this.openModelHandler('Wash', false)} ><FontAwesomeIcon className="fa-3x" icon={faSink} /></button>
        <button className="Button btnSearch" data-toggle="tooltip" data-placement="auto" title="Search for recipes!" onClick={() => this.openModelHandler('Search', false)}><FontAwesomeIcon className="fa-5x" icon={faSearch} /></button>
        <button className="Button btnRecipe" data-toggle="tooltip" data-placement="auto" title="View Steps" onClick={() => this.switchToStepsHandler()}><FontAwesomeIcon className="fa-3x" icon={faListOl} /></button>
        <button className="Button btnManage" onClick={() => this.openModelHandler('Fridge', true)} data-toggle="tooltip" data-placement="auto" title="Manage Inventory"><FontAwesomeIcon className="fa-3x" icon={faCartArrowDown} /></button>
        <button className="Button btnOut" data-toggle="tooltip" data-placement="auto" title="Exit the kitchen" onClick={this.logoutHandler}><FontAwesomeIcon className="fa-3x" icon={faSignOutAlt} /></button>
        <Modal show={this.state.showModel} modalClosed={this.closeModelHandler}>
          {model}
        </Modal>
        <Alert show={this.state.showAlert} modalClosed={this.closeAlertHandler} message={this.state.alertMessage} confirm={this.state.alertConfirm}confirmYes={this.confirmYesHandler}/>
      </div>
    );
  };
}

export default Home;