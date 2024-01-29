import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../App.css";
import Header from "./header";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
      username: "",
      password: "",
      redirect: false,
      wrong_credentials: false,
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);

    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentDidMount = () => {
    fetch("http://localhost:3001/", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) =>
        this.setState({ accounts: result }, () => {
          // Adds all the reviews to a session variable
          let list = [];
          this.state.accounts.forEach((account) => {
            if (account.reviews.length > 0) {
              account.reviews.forEach(review => {
                review.username = account.username;
                list.push(review);
              });
            }
          });
          sessionStorage.setItem("reviews", JSON.stringify(list));
        })
      )
      .catch((e) => console.log(e));
  };

  updateUsername = (evt) => {
    this.setState({ username: evt.target.value });
  };
  updatePassword = (evt) => {
    this.setState({ password: evt.target.value });
  };

  handleSignIn = () => {
    let data = {
      username: `${this.state.username}`,
      password: `${this.state.password}`,
    };

    fetch("http://localhost:3001/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status) {
          this.setState({ redirect: true }, () => {
            sessionStorage.setItem("user", JSON.stringify(result.account));
            this.setState({ redirect: true });
          });
        } else {
          this.setState({ wrong_credentials: true });
        }
      });
  };

  render() {
    let wrong_credentials = <span></span>;
    if (this.state.wrong_credentials) {
      wrong_credentials = <span className='alert'>Username or Password is incorrect.</span>;
    }

    let afterLoggedIn;
    let beforeLoggedIn = (
      <div className="login-form">
        <h1 className="title-before">FANDINGO</h1>
        <img src="./img/dingo.png" className="login-dingo-before"/>
        <label htmlFor="username">Username </label>
        <br />
        <input type="text" name="username" placeholder="Username..." className="login-input" onChange={this.updateUsername} />
        <br />
        { wrong_credentials }
        <br />
        <label htmlFor="password">Password </label>
        <br />
        <input type="password" name="password" placeholder="Password..." className="login-input" onChange={this.updatePassword} />
        <br />
        <br />
        <br />
        <a onClick={this.handleSignIn} className="any-btn">
          Log In
        </a>
        <br />
        <br />
        <br />
        <label className="signup-label">Not a member? </label>
        <a href="/signUp" className="any-btn">Sign Up!</a>
        <p>agustind</p>
        <p>UoNt-Kvx2</p>
      </div>
    );

    if (this.state.redirect || sessionStorage.getItem("user")) {
      beforeLoggedIn = <p></p>;
      afterLoggedIn = (
          <div className="login-after">
            <h1 className="title-after">WELCOME TO FANDINGO!</h1>
            <a href="/movies" className="any-btn">Visit Movie Page!</a>
            <br />
            <br />
            <img src="./img/dingo.png" className="login-dingo-after"/>
        </div>
      );
    }

    return (
      <>
        <Header />
        <br />
        <div className="login-container">
          {beforeLoggedIn}
          {afterLoggedIn}
            <div className='personality-container'>
              <h2>
                This website is for all shapes and sizes! Male and females as well as anything 
                in between are welcome to view our website!
              </h2>
              <h2>
                Handmade by the Grunts at Neumont
              </h2>
            </div>
          </div>
      </>
    );
  }
}

export default Login;
