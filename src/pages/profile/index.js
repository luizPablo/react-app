import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Post from '../../components/post';
import Header from '../../components/header';
import ListHeader from '../../components/lists-header';

import api from '../../services/api';
import './styles.css';

class ListUsers extends Component {

    constructor (props) {
        super(props);
        this.state = {
            posts: [],
            user: this.props.location.state.user,
            totalPosts: 0, 
            page: 1,
            pages: 1,
        };
    }

    async componentWillMount() {
        this.getPosts();
    }

    getPosts = async (page = 1, more = false) => {
        const posts = await api.post(
            '/graphql', 
            {query: `{ 
                postsByUser(_id: "${this.state.user._id}", page: ${page}){ 
                    docs { 
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
                            url_image, 
                            following{ _id }, 
                            followers{ _id } 
                        } 
                    }, 
                    total,
                    page,
                    pages,
                } 
            }`},
            {headers: {'x-access-token': localStorage.getItem('access-token')}}
        );

        const response = posts.data.data.postsByUser;
        
        this.setState({
            posts: more? [...this.state.posts, ...response.docs] : response.docs,
            totalPosts: response.total,
            page: response.page,
            pages: response.pages,
        });
    }

    loadMore = () => {
        this.getPosts(this.state.page + 1, true);
    }

    render() {
        const { user, totalPosts, posts, page, pages } = this.state;

        let more;

        if (page !== pages) {
            more = <button className="more" onClick={this.loadMore}>+</button>
        } else {
            more = '';
        }
        return (
            <div>
                <Header />
                <ListHeader title="Profile" user={user} />
                <div className="profile-information">
                    <div className="information">
                        <div className="profile-posts">
                            <h5>Posts</h5>
                            <h3>{totalPosts}</h3>
                        </div>
                        <div className="profile-following">
                            <h5>Following</h5>
                            <h3>{user.following.length}</h3>
                        </div>
                        <div className="profile-followers">
                            <h5>Followers</h5>
                            <h3>{user.followers.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="profile-list">
                    {posts.map(post => (
                        <Post post={post} key={post._id} />
                    ))}
                    {more}
                </div>
            </div>
        );
    }
}


export default withRouter(ListUsers);