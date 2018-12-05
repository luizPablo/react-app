import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { MdFavoriteBorder, MdFavorite } from 'react-icons//md';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import UserItem from '../../components/user-item';
import ReactHashtag from 'react-hashtag';

import './styles.css';
import api from '../../services/api';

class Post extends Component {

    constructor (props) {
        super(props);

        this.post = props.post;
        const user = JSON.parse(localStorage.getItem('logged-user'));

        this.state = {
            open: false,
            user: user,
            liked: this.post.likes.filter(like => like._id === user._id).length > 0,
        };
    }

    post = {};

    handleClickOpen = () => {
        this.setState({ open: true });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    likeUnlike = async () => {
        const query = `mutation{ 
            likeOrUnlikePost(_id: "${this.post._id}"){ 
                likes{ 
                    _id, 
                    name, 
                    login, 
                    url_image, 
                    following{ _id }, 
                    followers{ _id } 
                } 
            } 
        }`;

        const post = await api.post(
            '/graphql', 
            {query: query},
            {headers: {'x-access-token': localStorage.getItem('access-token')}}
        );

        const likes = post.data.data.likeOrUnlikePost.likes;
        this.post.likes = likes;
        
        if(likes.filter(like => like._id === this.state.user._id).length > 0){
            this.setState({
                liked: true,
            });
        } else {
            this.setState({
                liked: false,
            });
        }

    };

    render() {
        let liked;

        if (this.state.liked){
            liked = <MdFavorite size={25} onClick={this.likeUnlike} />
        } else {
            liked = <MdFavoriteBorder size={25} onClick={this.likeUnlike} />
        }
        
        return (
            <div className="post">
                <div className="avatar-post">
                    <img alt="Avatar" src={this.post.author.url_image + this.post.author._id} />
                </div>

                <div className="post-text">
                    <Link to={{pathname: '/profile', state: {user: this.post.author}}}>
                        <span>@{this.post.author.login}</span>
                    </Link>
                    <h3>
                        <ReactHashtag 
                            renderHashtag={(hashtagValue) => (
                                <Link key={this.post._id} to={{pathname: '/search', state: {search: hashtagValue}}}>
                                    {hashtagValue}
                                </Link>
                            )
                        }>
                            {this.post.text}
                        </ReactHashtag>
                    </h3>
                    <p>{new Date(this.post.date).toLocaleString()}</p>
                </div>

                <div className="like">
                    {liked}
                    <span onClick={this.handleClickOpen}>
                        {this.post.likes.length} likes
                    </span>
                </div>
                
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    scroll="paper"
                    fullScreen={window.screen.width <= 920 && this.post.likes.length > 0}
                    maxWidth="xl"
                    aria-labelledby="scroll-dialog-title">
                    { !(this.post.likes.length > 0) ? 
                        <h3 className="feedback">Nobody liked this post <br /> :( </h3> :
                        <h3 className="feedback">People who liked... </h3>}
                    {this.post.likes.map(user => (
                        <UserItem user={user} key={user._id} />
                    ))}
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            CLOSE
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}


export default withRouter(Post);