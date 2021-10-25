import React, { Component } from 'react';

import './Modal.css';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {

    shouldComponentUpdate ( nextProps, nextState ) {
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }

    render () {
        return (
            <div>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div
                    className="Modal"
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0'
                    }}>
                    <div>
                        <button className="btn btn-outline-danger" style={{display: 'flex', marginInlineStart: 'auto'}} onClick={this.props.modalClosed}>X</button>
                    </div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Modal;