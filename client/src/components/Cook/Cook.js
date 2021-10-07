import React from "react";
import { TimePicker } from '@material-ui/pickers';

import "./Cook.css";

const cook = (props) => {
    let val = Date.parse("Thu Dec 10 2020 00:00:00 GMT-0800");
        return(
            <div className="Cook">
                    {props.isCooking? 
                        <div style={{border:'2px solid indianred'}}>
                            <div className="row" style={{justifyContent:'right'}}>
                                <h3>You are cooking</h3>
                            </div>
                            <div className="row"style={{justifyContent:'space-between'}}>
                            <div className="Col-md-3" style={{marginBlock:'auto'}}>
                                <img alt="" src={props.recipe.image} style={{width:'120px', height:'120px', padding:'5px'}}/>
                            </div>
                            <div className="Col-md-3" style={{marginBlock:'auto'}}>
                                <h6>{props.recipe.title}</h6>
                            </div>
                            <div className="Col-md-3" style={{marginBlock:'auto'}}>
                                <h5>Time</h5>
                                <h6>{props.recipe.readyInMinutes}-min.</h6>
                            </div>
                            <div className="Col-md-3" style={{marginBlock:'auto'}}>
                                <div style={{border:'1px solid red', marginRight:'1rem'}}>
                                    {props.timer ? <div><button className="btn warning mr-2" onClick={props.stopTimer}>Stop Timer</button>
                                    <strong style={{backgroundColor:'greenyellow', padding:'5px', borderRadius:'50%'}}>{props.showHours}:{props.showMinutes}:{props.showSeconds}</strong></div> : null}
                                    <TimePicker
                                    className="mt-2 mb-2"
                                    style={{cursor:'pointer'}}
                                    clearable
                                    ampm={false}
                                    openTo="hours"
                                    views={["hours", "minutes"]}
                                    format="HH:mm"
                                    label={props.timer ? "Reset Timer" : "Set Timer"}
                                    value={val}
                                    onChange={(event) => props.getValue(event)}/>
                                </div>
                            <br></br>
                                <button className="btn primary" onClick={() => props.viewSteps('Steps', false)}>View Steps</button>
                                <button className="btn danger" onClick={props.finish}>Finish Cooking</button>
                            </div>
                        </div></div> : <h3>Nothing is being cooked!</h3>}
                <hr></hr>
                <div style={{width:'100%'}}>
                    <ul>
                        {props.myMeals.length > 0 ? <div><h3>My Meals</h3>
                            {props.myMeals.map((meal,i) => (
                                 <li key={meal.id+""+i}>
                                 <div className="row" style={{justifyContent:'space-between'}}>
                                     <div className="Col-md-3" style={{marginBlock:'auto', maxWidth: '150px'}}>
                                         <img alt="" src={meal.image} style={{width:'100px', height:'100px', padding:'5px'}}/>
                                     </div>
                                     <div className="Col-md-3" style={{marginBlock:'auto', maxWidth: '150px'}}>
                                         <h6>{meal.title}</h6>
                                     </div>
                                     <div className="Col-md-3" style={{marginBlock:'auto', maxWidth: '150px'}}>
                                         <h6>{meal.readyInMinutes}-min.</h6>
                                     </div>
                                     <div className="Col-md-3" style={{marginBlock:'auto', maxWidth: '150px'}}>
                                         <button className="btn warning" onClick={() => props.cook(meal.id)}>Cook again!</button>
                                         <button className="btn primary" onClick={() => props.viewRecipe(meal, 'Cook')}>View</button>
                                         <button className="btn danger" onClick={() => props.deleteRecipe(i)}><strong>X</strong></button>
                                     </div>
                                 </div>
                             </li>
                            ))}</div> : <h4>You don't have any meals yet!</h4>
                        }
                    </ul>
                </div>
            </div>
        );
}

export default cook;