import React, { Component } from 'react';

import './styles.css';
import api from '../../services/api';

class ListHeader extends Component {

    constructor (props) {
        super(props);

        const user = props.user;
        const logged_user = JSON.parse(localStorage.getItem('logged-user'));

        this.state = {
            user: user,
            following: user.followers.filter(user => user._id === logged_user._id).length > 0,
        };
    }

    componentWillReceiveProps(props){
        const received = props;
        if (this.props !== received){
            this.setState({
                user: received.user,
            });
        }
    }

    followUnfollow = async () => {
        let query;
        let user_response;
        let users;
        let update_user;

        query = `mutation{ followOrUnfollowUser(_id: "${this.state.user._id}"){ followers{ _id, name, login, url_image, following { _id }, followers { _id } } } }`;
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
        const { user } = this.state;
        const title = this.props.title;

        let button;

        if (title === 'Profile') {
            if (this.state.following){
                button = <button onClick={this.followUnfollow}>Unfollow</button>
            }else {
                button = <button onClick={this.followUnfollow}>Follow</button>
            }
        } else {
            button = '';
        }

        return (
            <div className="list-header">
                <div className="list-avatar">
                    <img alt="Avatar" src={user.url_image + user._id} />
                    <div className="names">
                        <h3>{user.name}</h3>
                        <h5>@{user.login}</h5>
                    </div>
                </div>
                <div className="title">
                    <h2>{title}</h2>
                    {button}
                </div>
            </div>
        );
    }
}


export default ListHeader;