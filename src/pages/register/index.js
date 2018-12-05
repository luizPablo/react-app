import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';

import './styles.css';
import api from '../../services/api';

class Register extends Component{
    constructor (props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            confirmation: '',
            name: '',
            notify: false,
            notifyMsg: '',
        };

        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.changeConfirmation = this.changeConfirmation.bind(this);
        this.changeName = this.changeName.bind(this);
        this.register = this.register.bind(this);
    }
    
    componentWillMount() {
        const token = localStorage.getItem('access-token');
        if (token) {
            this.props.history.push('/home');
        }
    }
    
    changeUsername (event) {
        this.setState({
            login: event.target.value
        });
    }

    changePassword (event) {
        this.setState({
            password: event.target.value
        });
    }

    changeConfirmation (event) {
        this.setState({
            confirmation: event.target.value
        });
    }

    changeName (event) {
        this.setState({
            name: event.target.value
        });
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({ notify: false });
    };

    async register () {
        if (this.state.password !== this.state.confirmation) {
            this.setState({ 
                notify: true,
                notifyMsg: "The passwords are divergents!",
            });
            return;
        }

        try {
            const response = await api.post('/register', this.state);
            console.log(response);
            if(response.status !== 201){
                this.setState({ 
                    notify: true,
                    notifyMsg: "Error! Maybe the username is in use...",
                });
            } else {
                this.props.history.push('/');
            }
        
        } catch (e) {
            this.setState({ 
                notify: true,
                notifyMsg: "An error occurred during the user registration!"
            });
        }
    }

    render() {
        console.log(this.state);
        return (
            <div className="register-box">
                <div className="form-box">
                    <form className="register">
                        <h2>Sidia App</h2>
                        <input placeholder="Name" value={this.state.name} onChange={this.changeName}></input>
                        <input placeholder="Username" value={this.state.login} onChange={this.changeUsername}></input>
                        <input type="password" placeholder="Password" value={this.state.password} onChange={this.changePassword}></input>
                        <input type="password" placeholder="Confirm password" value={this.state.confirmation} onChange={this.changeConfirmation}></input>
                        <button onClick={this.register} type="button">Register</button>
                    </form>
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.notify}
                    message={this.state.notifyMsg}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    action={[
                        <button className="notification" key="undo" color="inherit" size="small" onClick={this.handleClose}>
                        OK
                        </button>,
                    ]}
                />
            </div>
        );
    }
}

export default withRouter(Register);