import React, { Component } from 'react';

import './styles.css';
import UserItem from '../user-item';

class UsersList extends Component {
    render() {
        const users = this.props.users;
        const type = this.props.type;

        return (
            <div className="users-list">
                {users.map(user => (
                    <UserItem user={user} type={type} key={user._id} />
                ))}
            </div>
        );
    }
}


export default UsersList;