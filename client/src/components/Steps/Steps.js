import React from "react";
import "./Steps.css";

const steps = (props) => {
    return (
        <div className="Steps">
            {props.isCooking ?
                <div style={{ border: '2px solid indianred' }}>
                    <div className="row" style={{ justifyContent: 'right' }}>
                        <h3>You are cooking</h3>
                    </div>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                        <div className="Col-md-3" style={{ marginBlock: 'auto' }}>
                            <img alt="" src={props.recipe.image} style={{ width: '120px', height: '120px', padding: '5px' }} />
                        </div>
                        <div className="Col-md-3" style={{ marginBlock: 'auto' }}>
                            <h6>{props.recipe.title}</h6>
                        </div>
                        <div className="Col-md-3" style={{ marginBlock: 'auto' }}>
                            <h5>Time</h5>
                            <h6>{props.recipe.readyInMinutes}-min.</h6>
                        </div>
                        <div className="Col-md-3" style={{ marginBlock: 'auto' }}>
                            <button className="btn danger" onClick={props.finish}>Finish Cooking</button>
                        </div>
                    </div></div> : <h3>Nothing is being cooked!</h3>}
            <hr></hr>
            {props.isCooking ?
                <div style={{ width: '100%' }}>
                    <div className="row">
                        <div className="Col-md-6">
                            {props.steps.length > 0 ? <ol>
                            <h3>Steps</h3>
                                {props.steps.map((step, index) => (
                                    <li key={index}>
                                        <strong>{step.step}</strong>
                                    </li>
                                ))}
                            </ol> : <h4>Sorry, No steps available!</h4>}
                        </div>
                    </div>
                    <hr></hr>
                    <div className="row" style={{justifyContent:'space-evenly'}}>
                        <div className="Col-md-6">
                            <h3>Recipe Ingredients</h3>
                            <ol>
                                {props.recipe.nutrition.ingredients.map((ingregient, index) => (
                                    <li key={index}>
                                        <div className="row">
                                            <div className="Col-md-9" style={{ marginBlockStart: 'auto', maxWidth: '150px' }}>
                                                <label htmlFor={index} style={{ margin: '0' }}><strong>{ingregient.name}</strong></label>
                                            </div>
                                            <div className="Col-md-3 ml-2" style={{ marginBlockStart: 'auto', maxWidth: '150px' }}>
                                                <label htmlFor={index} style={{ margin: '0' }}>{ingregient.amount}({ingregient.unit})</label>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div className="Col-md-6" style={{color:'crimson'}}>
                            <h3>Missing Ingredients</h3>
                            <ol>
                                {props.missed.map((ingregient, index) => (
                                    <li key={index}>
                                        <div className="row">
                                            <div className="Col-md-9" style={{ marginBlockStart: 'auto', maxWidth: '150px' }}>
                                                <label htmlFor={index} style={{ margin: '0' }}><strong>{ingregient.name}</strong></label>
                                            </div>
                                            <div className="Col-md-3 ml-2" style={{ marginBlockStart: 'auto', maxWidth: '150px' }}>
                                                <label htmlFor={index} style={{ margin: '0' }}>{ingregient.amount}({ingregient.unit})</label>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div> : null
            }
        </div>
    )
}

export default steps;