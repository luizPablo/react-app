import React, { Component } from 'react';
import Header from '../../components/header';
import Post from '../../components/post';
import UserItem from '../../components/user-item';
import Snackbar from '@material-ui/core/Snackbar';

import api from '../../services/api';
import './styles.css';

export default class Search extends Component {

    constructor (props) {
        super(props);
        this.state = {
            users: [],
            posts: [],
            list_type: -1,
            page: 1,
            pages: 1,
        };

        this.propsReceived = this.props.location.state;
    }

    componentWillMount(){
        this.getList();
    }

    componentWillReceiveProps(props){
        this.propsReceived = props.location.state;
        this.getList();
    }

    propsReceived = {};

    getList = (page = 1, more = false) => {
        const search = this.propsReceived.search;
        const users = search.match(/@\w*\b/g);
        const hashtags = search.match(/#\w*\b/g);
        
        if (users !== null && hashtags !== null) {
            this.showList(0, hashtags, users, page, more);

        } else if (users !== null) {
            this.showList(1, [], users, page, more);

        } else if (hashtags !== null) {
            this.showList(2, hashtags, [], page, more);

        } else {
            this.showList(3, [], [], page, more);

        }
    }

    showList = async (list_type, hashtags, users, page = 1, more = false) => {
        if (list_type === 0) {
            try {
                const posts = await api.post(
                    '/graphql', 
                    {query: `{ 
                        usersPosts(users: "${users}", hashtags: "${hashtags}", page: ${page}){
                            docs{
                                _id, 
                                text, 
                                date, 
                                author{ 
                                    _id, 
                                    name, 
                                    login, 
                                    url_image 
                                }, 
                                likes{
                                    _id,
                                    name, 
                                    login, 
                                    url_image 
                                    following{
                                        _id,
                                        name, 
                                        login, 
                                        url_image,
                                        following { _id }
                                    },
                                    followers{
                                        _id,
                                        name, 
                                        login, 
                                        url_image,
                                        following { _id }
                                    } 
                                }
                            },
                            page,
                            pages
                        } 
                    }`},
                    {headers: {'x-access-token': localStorage.getItem('access-token')}}
                );
    
                this.setState({
                    posts: more ? [...this.state.posts, ...posts.data.data.usersPosts.docs] : posts.data.data.usersPosts.docs,
                    list_type: 0,
                    page: posts.data.data.usersPosts.page,
                    pages: posts.data.data.usersPosts.pages,
                });

            } catch (e) {
                console.log(e);
                this.setState({ 
                    notify: true,
                    notifyMsg: "Get posts fails!",
                });
            }

            return;
        }

        if (list_type === 1) {
            try {
                const users_response = await api.post(
                    '/graphql', 
                    {query: `{ 
                        users(filter: "${users}", page: ${page}){
                            docs {
                                _id,
                                login,
                                name,
                                url_image,
                                following{
                                    _id,
                                    name,
                                    login,
                                    url_image,
                                    following{ _id },
                                    followers { _id }
                                },
                                followers{
                                    _id,
                                    name,
                                    login,
                                    url_image,
                                    following{ _id },
                                    followers { _id }
                                },
                            },
                            page,
                            pages
                        }
                    }`},
                    {headers: {'x-access-token': localStorage.getItem('access-token')}}
                );
    
                this.setState({
                    users: more ? [...this.state.users, ...users_response.data.data.users.docs ] : users_response.data.data.users.docs,
                    list_type: 1,
                    page: users_response.data.data.users.page,
                    pages: users_response.data.data.users.pages,
                });
    
            } catch (e) {
                console.log(e);
                this.setState({ 
                    notify: true,
                    notifyMsg: "Get users fails!",
                });
            }

            return;
        }

        if (list_type === 2) {
            try {
                const posts = await api.post(
                    '/graphql', 
                    {query: `{ 
                        hashtagsPosts(filter: "${hashtags}", page: ${page}){
                            docs{
                                _id, 
                                text, 
                                date, 
                                author{ 
                                    _id, 
                                    name, 
                                    login, 
                                    url_image 
                                }, 
                                likes{ 
                                    _id,
                                    name, 
                                    login, 
                                    url_image 
                                    following{
                                        _id,
                                        name, 
                                        login, 
                                        url_image,
                                        following { _id }
                                    },
                                    followers{
                                        _id,
                                        name, 
                                        login, 
                                        url_image,
                                        following { _id }
                                    } 
                                } 
                            },
                            page,
                            pages
                        } 
                    }`},
                    {headers: {'x-access-token': localStorage.getItem('access-token')}}
                );
    
                this.setState({
                    posts: more? [...this.state.posts, ...posts.data.data.hashtagsPosts.docs] : posts.data.data.hashtagsPosts.docs,
                    list_type: 2,
                    page: posts.data.data.hashtagsPosts.page,
                    pages: posts.data.data.hashtagsPosts.pages,
                });
    
            } catch (e) {
                console.log(e);
                this.setState({ 
                    notify: true,
                    notifyMsg: "Get posts fails!",
                });
            }

            return;
        }

        if (list_type === 3) {
            try {
                const posts = await api.post(
                    '/graphql', 
                    {query: `{ 
                        filteredPosts(filter: "${this.propsReceived.search}", page: ${page}){
                            docs{
                                _id, 
                                text,
                                date, 
                                author{ 
                                    _id, 
                                    name, 
                                    login, 
                                    url_image 
                                }, 
                                likes{
                                    _id,
                                    name, 
                                    login, 
                                    url_image 
                                    following{
                                        _id,
                                        name, 
                                        login, 
                                        url_image,
                                        following { _id }
                                    },
                                    followers{
                                        _id,
                                        name, 
                                        login, 
                                        url_image,
                                        following { _id }
                                    } 
                                } 
                            },
                            page,
                            pages
                        } 
                    }`},
                    {headers: {'x-access-token': localStorage.getItem('access-token')}}
                );
    
                this.setState({
                    posts: more? [...this.state.posts, ...posts.data.data.filteredPosts.docs] : posts.data.data.filteredPosts.docs,
                    list_type: 3,
                    page: posts.data.data.filteredPosts.page,
                    pages: posts.data.data.filteredPosts.pages,
                });
    
            } catch (e) {
                console.log(e);
                this.setState({ 
                    notify: true,
                    notifyMsg: "Get posts fails!",
                });
            }

            return;
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({ notify: false });
    };

    loadMore = () => {
        this.getList(this.state.page + 1, true);
    }

    render() {
        const { posts, users, list_type, page, pages } = this.state;

        let list = <h1>Nothing found!</h1>;
        let more;

        if (list_type === -1) {
            list = <h1>Nothing found!</h1>;

        } else if (list_type === 1) {
            if (users.length > 0){
                list = users.map(user => (
                    <UserItem user={user} key={user._id} />
                ));

            } else {
                list = <h1>Nothing found!</h1>;

            }

        } else {
            if (posts.length > 0) {
                list = posts.map(post => (
                    <Post post={post} key={post._id} />
                ));
            } else {
                list = <h1>Nothing found!</h1>;
            }

        }

        if (page !== pages) {
            more = <button className="more" onClick={this.loadMore}>+</button>
        } else {
            more = '';
        }

        return (
            <div>
                <Header />
                <div className="search-list">
                    {list}
                    {more}
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