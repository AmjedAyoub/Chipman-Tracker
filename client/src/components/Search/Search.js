import React from "react";
import "./Search.css";

const search = (props) => {
        return (
            <div className="Search">
                <h1>Search</h1>
                <input onChange={(event) => props.changed(event)} value={props.query}></input>
                <button className="btn primary" onClick={() => props.clicked(props.query)}>Search</button>
                <br></br>
                <div style={{border:'2px solid darkOrange', width:'fit-content', display:'inline-block'}}>
                    <strong>Get recipes based on items in your fridge</strong>
                    <button className="btn warning ml-2" onClick={() => props.autoClicked()}>Auto Search</button>
                </div>
                <hr></hr>
                {props.recipesResults.length > 0 ?
                    <ul>
                        {props.recipesResults.map(recipe => (
                            <li key={recipe.id}>
                                <div className="row" style={{ justifyContent: 'space-between' }}>
                                    <div className="Col-md-3" style={{ marginBlock: 'auto', maxWidth: '150px' }}>
                                        <img alt="" src={recipe.image?.startsWith("https://spoonacular.com/recipeImages/") ? recipe.image : "https://spoonacular.com/recipeImages/" + recipe.image} style={{ width: '100px', height: '100px', padding: '5px' }} />
                                    </div>
                                    <div className="Col-md-3" style={{ marginBlock: 'auto', maxWidth: '150px' }}>
                                        <h6>{recipe.title}</h6>
                                    </div>
                                    <div className="Col-md-3" style={{ marginBlock: 'auto', maxWidth: '150px' }}>
                                        <h6>{recipe.readyInMinutes ? recipe.readyInMinutes + '-min.' : recipe.missedIngredientCount+'-missingIngr.'}</h6>
                                    </div>
                                    <div className="Col-md-3" style={{ marginBlock: 'auto', maxWidth: '150px' }}>
                                        <button className="btn warning" onClick={() => props.cook(recipe.id)}>Cook</button>
                                        <button className="btn primary" onClick={() => props.viewRecipe(recipe, 'Search')}>View</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul> : <h4>Please search for recipes!</h4>}
            </div>
        )
}

export default search;