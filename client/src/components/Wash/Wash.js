import React from "react";
import "./Wash.css";

const wash = (props) => {
        return (
            <div className="Wash">
                {props.loads > 0 ? <div>
                <h1>Wash</h1>
                <h6>You have <span>({props.loads})</span> loads.</h6>
                <div className="row" style={{justifyContent:'space-evenly'}}>
                    <div className="Col-md-6">
                        {props.washing ? 
                        [<button key ="b1" className="btn danger" onClick={props.finishWash}>Stop wash</button>,<h6 key ="b2">Time remaining <span>{props.count}</span></h6>]:<button className="btn success" onClick={props.startWash}>Start wash</button>}
                    </div>
                    <div className="Col-md-6">
                        {props.washing ? 
                        <img alt="" className="ml-3" src="https://media0.giphy.com/media/3ohhwvBqI1BE1o3196/giphy.webp?cid=ecf05e47zxjcigayhmzpizpk4no5wfld1ukz8gesox8a15hy&rid=giphy.webp" style={{width:'200px', height:'300px'}}/> : null
                        }
                    </div>
                </div>
                </div> : <h3>No loads!</h3>}
            </div>
        )
}

export default wash;