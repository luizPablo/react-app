import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import './styles.css';

class Header extends Component {

    constructor (props) {
        super(props);
        this.state = {
            search: '',
        };

        this.changeSearch = this.changeSearch.bind(this);
    }

    changeSearch (event) {
        this.setState({
            search: event.target.value
        });
    }

    gohome = () => {
        this.props.history.push('/home');
    }



    logout = () => {
        localStorage.clear();
        this.props.history.push('/');
    }

    render() {
        return (
            <header id="main-header">
                <span>Sidia App</span>
        
                <div className="actions">
                    <div>
                        <input type="text" placeholder="Search users, words, hasgtags..." value={this.state.search} onChange={this.changeSearch} />
                        <Link to={{pathname: "/search", state: {search: this.state.search}}}>Search</Link>
                    </div>
                    <button className="header-button" onClick={this.gohome}>Home</button>
                    <button className="header-button" onClick={this.logout}>Logout</button>
                </div>
            </header>
        );
    }
}


export default withRouter(Header);