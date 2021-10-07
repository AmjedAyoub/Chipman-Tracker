import React from 'react';
import './Alert.css';

const alert = (props) => {
        return (
                <div
                    className="Alert"
                    style={{
                        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: props.show ? '1' : '0'
                    }}>
                    {props.message}
                    <br></br>
                    {props.confirm ? <div><button className="btn success mt-3" onClick={props.confirmYes}>YES</button><button className="btn danger mt-3 ml-2" onClick={props.modalClosed}>NO</button></div> : <button className="btn danger mt-3" onClick={props.modalClosed}>OK</button>}
                </div>
        )
}

export default alert;