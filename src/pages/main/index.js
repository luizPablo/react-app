import React, { Component } from 'react';

import Header from '../../components/header';
import UserTimeline from '../../components/user-timeline';

export default class Main extends Component{
    render() {
        return (
            <div>
                <Header />
                <UserTimeline />
            </div>
        );
    }
}