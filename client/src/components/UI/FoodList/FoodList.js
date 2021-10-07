import React from "react";
import "./FoodList.css"

const foodList = (props) => {
  
  const itemsUnits = ['teaspoon', 't', 'tsp', 'tablespoon', 'T', 'tbl', 'tbs', 'tbsp', 'ounce', 'fl', 'oz', 'gill', 'cup', 'c', 'pint', 'p', 'pt', 'quart', 'q', 'qt', "gallon", 'gl', 'gal', 'ml', 'milliliter', 'millilitre', 'cc' , 'mL', 'l', 'liter', 'litre', 'L', 'dl', 'deciliter', 'decilitre', 'dL', 'pound', 'lb', '#', 'mg', 'milligram', 'milligramme', 'g', 'gr', 'gram', 'gramme', 'kg', 'kilogram', 'kilogramme']

  return (
    <div id="FoodList">
      {props.groceryResults.length > 0 ? (
        <div>
          <ul>
            {props.groceryResults.map((result, i) => (
              <li key={i}>
                <div className="row mt-2" style={{justifyContent:'center'}}>
                  <div className="Col-md-9">
                <img alt="recipe" src={result.image?.startsWith("https://spoonacular.com") ? (result.image) : ("https://spoonacular.com/cdn/ingredients_100x100/" + result.image)} height="75px" width="75px"></img>
                    <strong>
                      Item:
                    </strong>
                    <input
                      value={result.annotation.toLowerCase() || ""}
                      onChange={props.receiptItemsChangedHandler.bind(this,i)}
                      name="annotation"
                      placeholder="item name"
                    />
                  </div>
                  <div className="Col-md-3">
                    <strong>
                      Quantity:
                    </strong>
                    <input id="qtybutton"
                      value={result.tag || ""}
                      onChange={props.receiptItemsChangedHandler.bind(this,i)}
                      name="tag"
                      type="number"
                    />
                    <select className="custom-select" id="SelectUnit" name="unit"
                            onChange={props.receiptItemsChangedHandler.bind(this,i)} style={{ width: 'max-content' }}>
                        <option key={result.unit} value={result.unit} name="unit">{result.unit}.</option>
                        {itemsUnits.map((u,i) => (
                            <option key={u+""+i} value={u} name="unit">{u}.</option>
                        ))}
                      </select>
                    <button className="btn danger" onClick={() => props.receiptItemDeleteHandler(i, this)} style={{float:'right'}}><strong>X</strong></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <button className="btn warning" onClick={props.addItemsHandler} > Add items </button>
        </div>
      ) : null}
    </div>
  )
}

export default foodList;


