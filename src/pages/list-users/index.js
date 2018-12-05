import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Header from '../../components/header';
import ListHeader from '../../components/lists-header';

import './styles.css';
import UsersList from '../../components/users-list';

class ListUsers extends Component {

    constructor (props) {
        super(props);

        const received = this.props.location.state;

        this.state = {
            user: received.user,
            title: received.title,
            type: received.type,
        };
    }

    componentWillReceiveProps(props){
        const received = props.location.state;
        if (this.props.location.state !== received){
            this.setState({
                title: received.title,
                user: received.user,
                type: received.type,
            });
        }
    }

    render() {
        const { user, title, type } = this.state;
        let list;

        if (type === 0) {
            list = <UsersList users={user.following} type={type} />
        } else if (type === 1) {
            list = <UsersList users={user.followers} type={type}/>
        }
        
        return (
            <div>
                <Header />
                <ListHeader title={title} user={user} />
                {list}
            </div>
        );
    }
}


export default withRouter(ListUsers);