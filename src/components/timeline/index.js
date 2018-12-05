import React, { Component } from 'react';
import Post from '../post';
import { withRouter } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';

import './styles.css';
import api from '../../services/api';

class Timeline extends Component {

    constructor (props) {
        super(props);
        this.state = {
            posts: [],
            page: 1,
            pages: 1,
        };
    }

    componentWillReceiveProps(){
        const { refresh } = this.props;
        if (refresh) {
            this.getPosts();
        }
    }

    componentWillMount() {
        this.getPosts();
    }

    getPosts = async (page = 1, more = false) => {
        try {
            const posts = await api.post(
                '/graphql', 
                {query: `{ 
                    timelinePosts(page: ${page}){ 
                        docs{
                            _id, 
                            text, 
                            date, 
                            author{ 
                                _id, 
                                name, 
                                login, 
                                url_image, 
                                following { _id }, 
                                followers { _id } 
                            }, 
                            likes{ 
                                _id, 
                                name, 
                                login, 
                                url_image, 
                                following { _id }, 
                                followers { _id } 
                            }
                        },
                        page,
                        pages,
                    } 
                }`},
                {headers: {'x-access-token': localStorage.getItem('access-token')}}
            );

            this.setState({
                posts: more ? [ ...this.state.posts, ...posts.data.data.timelinePosts.docs] : posts.data.data.timelinePosts.docs,
                page: posts.data.data.timelinePosts.page,
                pages: posts.data.data.timelinePosts.pages,
            });

        } catch (e) {
            console.log(e);
            this.setState({ 
                notify: true,
                notifyMsg: "Get posts fails!",
            });
        }
        
    }

    loadMore = () => {
        this.getPosts(this.state.page + 1, true);
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        this.setState({ notify: false });
    };

    render() {
        const { posts, page, pages } = this.state;

        let more;

        if (page !== pages) {
            more = <button onClick={this.loadMore}>+</button>
        } else {
            more = '';
        }

        return (
            <div className="timeline">
                {posts.map(post => (
                    <Post post={post} key={post._id} />
                ))}
                {more}
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


export default withRouter(Timeline);