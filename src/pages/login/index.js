import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';

import './styles.css';
import api from '../../services/api';

class Login extends Component{
    constructor (props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            auth: false
        };

        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.signin = this.signin.bind(this);
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

    goRegister = () => {
        this.props.history.push('/register');
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({ notify: false });
    };

    async signin () {
        try {
            const response = await api.post('/login', this.state);
            const user = response.data.user;

            const posts = await api.post(
                '/graphql', 
                {query: `{ postsByUser(_id: "${user._id}") { docs{ _id }, page, pages, total } }`},
                {headers: {'x-access-token': response.data.token}}
            );
            user.posts = posts.data.data.postsByUser.docs;
            user.totalPosts = posts.data.data.postsByUser.total;

            localStorage.setItem('access-token', response.data.token);
            localStorage.setItem('logged-user', JSON.stringify(user));
            this.props.history.push('/home');
        
        } catch (e) {
            this.setState({ 
                notify: true,
                notifyMsg: "Invalid user or password!",
            });

        }
    }

    render() {
        return (
            <div className="page-box">
                <div className="login-box">
                    <form className="login">
                        <h2>Sidia App</h2>
                        <input type="text" placeholder="Username" value={this.state.login} onChange={this.changeUsername}></input>
                        <input type="password" placeholder="Password" value={this.state.password} onChange={this.changePassword}></input>
                        <button type="button" onClick={this.signin}>Sign In</button>
                        <br />
                        <br />
                        <span onClick={this.goRegister}>Registre-se</span>
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

export default withRouter(Login);