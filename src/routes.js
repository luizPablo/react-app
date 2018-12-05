import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/login';
import Main from './pages/main';
import ListUsers from './pages/list-users';
import Register from './pages/register';
import Search from './pages/search';
import Profile  from './pages/profile';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/home" component={Main} />
            <Route exact path="/listusers" component={ListUsers} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/profile" component={Profile} />
        </Switch>
    </BrowserRouter>
);

export default Routes;