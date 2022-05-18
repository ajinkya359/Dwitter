import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../photo.png'
import Button from '@material-ui/core/Button'

class Navbar extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      username:null,
      showOnlyAccount:null
    }
  }

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <p
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={photo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />
          Dwitter
        </p>
        <div>
          <input
            onChange={(e) => this.setState({ showOnlyAccount: e.target.value })}
            title="Search by account "
            placeholder="Search images by account id...."
            style={{ width: "20vw ",height:"5vh" }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => this.props.filterPosts(this.state.showOnlyAccount)}
            style={{"height":"6vh",margin:"1vw"}}
          >
            Search
          </Button>
        </div>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">
                {this.props.username === null
                  ? "New User"
                  : this.props.username}
                  <br/>
                  {this.props.account}
              </small>
            </small>
            {this.props.account ? (
              <img
                className="ml-2"
                width="30"
                height="30"
                src={`data:image/png;base64,${new Identicon(
                  this.props.account,
                  30
                ).toString()}`}
                alt=""
              />
            ) : (
              <span></span>
            )}
          </li>
          {this.props.username === null ? (
            <div>
              <button
                onClick={() => this.props.createUser(this.state.username)}
              >
                Create user
              </button>
              <input
                type="text"
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </div>
          ) : (
            ""
          )}
        </ul>
      </nav>
    );
  }
}

export default Navbar;