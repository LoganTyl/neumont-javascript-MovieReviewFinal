import React, { Component } from "react";

import Header from "./header";
import "../App.css";

class SendEmail extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        accounts: [],
        username: "",
        password: "",
        redirect: false,
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
}

render() {
  return (
    <>
      <Header />
      <br />
      <div className="send-email-container">
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

export default SendEmail