import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './styles.css';
import api from '../../services/api';

class UserItem extends Component {

    constructor (props) {
        super(props);

        const user = props.user;
        user.posts = [];

        this.state = {
            user: props.user,
            totalPosts: 0,
            following: false,
        };
    }

    componentWillMount(){
        this.getPosts();
    }

    getPosts = async () => {
        const posts = await api.post(
            '/graphql', 
            {query: `{ postsByUser(_id: "${this.state.user._id}"){ 
                    docs { 
                        _id, 
                        likes { _id } 
                    }, 
                    total 
                } 
            }`},
            {headers: {'x-access-token': localStorage.getItem('access-token')}}
        );

        const get_user = await api.post(
            '/graphql', 
            {query: `{ user(_id: "${this.state.user._id}") { 
                following { 
                    _id, 
                    name, 
                    login, 
                    url_image, 
                    following { _id }, 
                    followers { _id } 
                }, 
                followers { 
                    _id, 
                    name, 
                    login, 
                    url_image, 
                    following { _id }, 
                    followers { _id } 
                } 
            } }`},
            {headers: {'x-access-token': localStorage.getItem('access-token')}}
        );

        const response_user = get_user.data.data.user;
        const posts_response = posts.data.data.postsByUser.docs;

        const logged_user = JSON.parse(localStorage.getItem('logged-user'));
        const user = this.state.user;

        user.posts = posts_response;
        user.following = response_user.following;
        user.followers = response_user.followers;

        this.setState({
            user: user,
            following: user.followers.filter(follower => follower._id === logged_user._id).length > 0,
            totalPosts: posts.data.data.postsByUser.total,
        });
    }

    followUnfollow = async () => {
        let query;
        let user_response;
        let users;
        let update_user;

        query = `mutation{ followOrUnfollowUser(_id: "${this.state.user._id}"){ 
            followers{ 
                _id, 
                name, 
                login, 
                url_image, 
                following { _id }, 
                followers { _id } 
            } 
        } }`;
        user_response = await api.post(
            '/graphql', 
            {query: query},
            {headers: {'x-access-token': localStorage.getItem('access-token')}}
        );

        users = user_response.data.data.followOrUnfollowUser.followers;
        update_user = this.state.user;
        update_user.followers = users;

        const logged_user = JSON.parse(localStorage.getItem('logged-user'));
        
        if(users.filter(user => user._id === logged_user._id).length > 0){
            this.setState({
                user: update_user,
                following: true,
            });
        } else {
            this.setState({
                user: update_user,
                following: false,
            });
        }

    };

    render() {
        const { user, following, totalPosts } = this.state;
        let button;

        if (following) {
            button = <button onClick={this.followUnfollow}>Unfollow</button>
        } else {
            button = <button onClick={this.followUnfollow}>Follow</button>
        }

        return (
            <div className="user-item">
                <div className="avatar-item">
                    <img alt="Avatar" src={user.url_image + user._id} />
                </div>

                <div className="item-info">
                    <Link to={{pathname: '/profile', state: {user: user}}}>
                        <span>@{user.login}</span>
                    </Link>
                    <h3>{user.name}</h3>
                </div>

                <div className="item-numbers">
                    <div className="item-number posts-numbers">
                        <span>Posts</span>
                        <h3>{totalPosts}</h3>
                    </div>
                    <div className="item-number">
                        <Link className="label" to={{pathname: "/listusers", state: {title: "Following these people", user: user, type: 0}}}>
                            <span>Following</span>
                        </Link>
                        <Link className="label" to={{pathname: "/listusers", state: {title: "Following these people", user: user, type: 0}}}>
                            <h3>{user.following.length}</h3>
                        </Link>
                    </div>
                    
                    <div className="item-number">
                        <Link className="label" to={{pathname: "/listusers", state: {title: "Followed by these people", user: user, type: 1}}}>
                            <span>Followers</span>
                        </Link>
                        <Link className="label" to={{pathname: "/listusers", state: {title: "Followed by these people", user: user, type: 1}}}>
                            <h3>{user.followers.length}</h3>
                        </Link>
                    </div>
                </div>

                <div className="follow-unfollow">
                    {button}
                </div>
            </div>
        );
    }
}


export default UserItem;