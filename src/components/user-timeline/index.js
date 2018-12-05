import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Timeline from '../timeline';
import Snackbar from '@material-ui/core/Snackbar';

import './styles.css';
import api from '../../services/api';

class UserTimeline extends Component {

    constructor (props) {
        super(props);
        this.state = {
            post: '',
            user: {},
            totalPosts: 0, 
        };

        this.changePost = this.changePost.bind(this);
    }

    componentWillMount() {
        const user = JSON.parse(localStorage.getItem('logged-user'));

        this.setState({
            user: user,
            totalPosts: user.totalPosts,
        });
    }

    componentDidMount() {
        this.updateSate();
    }

    createPost = async () => {
        try {
            const query = `mutation{ createPost( 
                input: { 
                    text: "${this.state.post}", 
                    date: "${new Date()}", 
                    author: "${this.state.user._id}" 
                } ){ _id } }`;
            await api.post(
                '/graphql', 
                {query: query},
                {headers: {'x-access-token': localStorage.getItem('access-token')}}
            );
            
            this.updateSate();

            return true;

        } catch (e) {
            console.log(e);
            this.setState({ 
                notify: true,
                notifyMsg: "Create posts fail!",
            });
            
            return false;
        }
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({ notify: false });
    };

    changePost (event) {
        this.setState({
            post: event.target.value
        });
    }

    updateSate = async () => {
        let user = JSON.parse(localStorage.getItem('logged-user'));

        const user_response = await api.post(
            '/graphql', 
            {query: `{ 
                user(_id: "${user._id}") {
                    _id,
                    name,
                    login
                    url_image,
                    following{
                        _id,
                        name,
                        login,
                        url_image,
                        following{ _id },
                        followers{ _id }
                    },
                    followers{
                        _id,
                        name,
                        login,
                        url_image,
                        following{ _id },
                        followers{ _id }
                    } 
                } 
            }`},
            {headers: {'x-access-token': localStorage.getItem('access-token')}}
        );
        user = user_response.data.data.user;

        const posts_response = await api.post(
            '/graphql', 
            {query: `{ postsByUser(_id: "${user._id}") { docs{ _id }, page, pages, total } }`},
            {headers: {'x-access-token': localStorage.getItem('access-token')}}
        );
        const response = posts_response.data.data.postsByUser;
        user.posts = response.docs;
        
        localStorage.setItem('logged-user', JSON.stringify(user));

        this.setState({
            user: user,
            post: '',
            totalPosts: response.total
        });
    }

    render() {
        const { user, totalPosts } = this.state;

        return (
            <div>
                <div className="box">
                    <div className="informations">
                        <div className="avatar">
                            <img alt="Avatar" src={user.url_image + user._id} />
                            <div className="names">
                                <h3>{user.name}</h3>
                                <Link to={{pathname: '/profile', state: {user: user}}}><h5>@{user.login}</h5></Link>
                            </div>
                        </div>
                        <div className="numbers">
                            <div className="posts">
                                <span>Posts</span>
                                <h3>{totalPosts}</h3>
                            </div>
                            <div className="following">
                                <Link className="label" to={{pathname: "/listusers", state: {title: "Following these people", user: user, type: 0}}}>
                                    Following
                                </Link>
                                <Link className="count" to={{pathname: "/listusers", state: {title: "Following these people", user: user, type: 0}}}>
                                    {user.following.length}
                                </Link>
                            </div>
                            <div className="followers">
                                <Link className="label" to={{pathname: "/listusers", state: {title: "Followed by these people", user: user, type: 1}}}>
                                    Followers
                                </Link>
                                <Link className="count" to={{pathname: "/listusers", state: {title: "Followed by these people", user: user, type: 1}}}>
                                    {user.followers.length}
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-area">
                        <textarea 
                            rows="3" 
                            maxLength="280" 
                            placeholder="What's happening?" 
                            value={this.state.post} 
                            onChange={this.changePost}>
                        </textarea>
                        <button onClick={this.createPost}>Post It</button>
                    </div>
                </div>
                <Timeline refresh={this.createPost} />

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

export default withRouter(UserTimeline);