import React, { Component } from 'react';
import AdminContainer from './mini-components/admin-container';

import Header from './header';

class Admin extends Component {
    constructor(props){
        super(props);

        this.state = {
            accounts: [],
            reviews: [],
            refresh: false
        };

        this.updateAccounts = this.updateAccounts.bind(this);
        this.deleteReview = this.deleteReview.bind(this);
    }

    componentDidMount = () => {
        fetch("http://localhost:3001/", {
            method: "GET",
        })
        .then((res) => res.json())
        .then((result) =>
            this.setState({ accounts: result }, () => {
                sessionStorage.removeItem('reviews');
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
                this.setState({ reviews: list });
            })
        ).catch((e) => console.log(e));

        this.setState({ reviews: JSON.parse(sessionStorage.getItem('reviews')) });
    }

    updateAccounts = result => {
        if (result) {
            fetch("http://localhost:3001/", {
                method: "GET",
            })
            .then((res) => res.json())
            .then((result) =>
                this.setState({ accounts: result }, () => {
                    sessionStorage.removeItem('reviews');
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
                    this.setState({ reviews: list });
                })
            ).catch((e) => console.log(e));
        }
    }
    
    deleteReview = (movieId, username) => {
        let body = {
            "username": username,
            "movieId": movieId
        }

        fetch('http://localhost:3001/deleteReview', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
        .then(result => {
            if (result.success) {
                this.updateAccounts(result.success);
            }
        });
    }

    render() {
        if (JSON.parse(sessionStorage.getItem('user')).isAdmin) {
            return (
                <>
                    <Header />
                    <div className='admin2-container'>
                        <div className='admin-container'>
                            <div className='admin-container'>
                                {
                                    this.state.accounts.map((account, i) => {
                                        return <AdminContainer key={ i }
                                        account={ account }
                                        updateAccounts={ this.updateAccounts }/>
                                    })
                                }
                            </div>
                        </div>
                        <div className='account-review'>
                            {
                                this.state.reviews.map((review, i) => {
                                    return <div key={ i }
                                    className='account-review'>
                                        <p>{ review.review }</p>
                                        <p>{ review.rating }</p>
                                        <p>{ review.movieId }</p>
                                        <div className='any-btn'
                                        onClick={ () => { this.deleteReview(review.movieId, review.username) } }>Delete Review</div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <h1>Wait a minute..... you're not an <strong>admin?</strong></h1>
                    <a href='/account'>Get back to your NON-ADMIN account!</a>
                </>
            );
        }
    }
}

export default Admin;