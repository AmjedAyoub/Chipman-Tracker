import React from "react";
import "./Recipe.css";

const recipe = (props) => {
    return (
        <div className="Recipe">
                <div style={{ border: '2px solid indianred' }}>
                    <div className="row" style={{ justifyContent: 'right' }}>
                        <button className="btn primary" onClick={() => props.back()}>Back</button>
                        <h3 className="ml-4">Details</h3>
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
                            <button className="btn warning" onClick={() => props.cook()}>Cook</button>
                        </div>
                    </div>
                </div>
                <hr></hr>
            <div className="row" style={{ width: '100%' }}>
                <div className="Col-md-12">
                    {props.steps?.length > 0 ? 
                    <ol><h3>Steps</h3>
                        {props.steps.map((step, index) => (
                            <li key={index}>
                                <strong>{step.step}</strong>
                            </li>
                        ))}
                    </ol> : <h4>Sorry, No steps available!</h4>}
                </div>
            </div>
            <hr></hr>
            <div className="row" style={{ width: '100%', justifyContent:'space-evenly'}}>
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
        </div>
    );
};

export default recipe;
