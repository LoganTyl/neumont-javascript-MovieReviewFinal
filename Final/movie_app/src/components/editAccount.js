import React, { Component } from 'react';

import Header from './header';
import AccountReview from './mini-components/account-review';

class EditAccount extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: "",
            fname: "",
            lname: "",
            email: "",
            street: "",
            city: "",
            state: "",
            zip_code: "",
            phone: "",
            password: "",
            confirm_password: "",
            reviews: [],
            usernameRegex: /^.{2,15}$/,
            emailRegex: /^.+@.{2,}\.[A-Za-z0-9]{2,}$/,
            passRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#\$\%\^\&\*\(\)\[\]\{\}\;\:\'\"\\<\>\,\.\/\?]).{8,}$/,
            doPasswordsMatch: false,
            isPasswordValid: true,
            isUsernameValid: true,
            isEmailValid: true
        };

        this.updateUsername = this.updateUsername.bind(this);
        this.updateFname = this.updateFname.bind(this);
        this.updateLname = this.updateLname.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updateStreet = this.updateStreet.bind(this);
        this.updateCity = this.updateCity.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateZipCode = this.updateZipCode.bind(this);
        this.updatePhone = this.updatePhone.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.updateConfirmPassword = this.updateConfirmPassword.bind(this);

        this.updateReviews = this.updateReviews.bind(this);
    }

    componentDidMount = () => {
        let user = JSON.parse(sessionStorage.getItem('user'));
        
        fetch("http://localhost:3001/", {
            method: "GET",
        })
        .then((res) => res.json())
        .then((result) =>
            this.setState({ accounts: result }, () => {
                this.state.accounts.forEach((account) => {
                    if (account.username === user.username) {
                        this.setState({ reviews: account.reviews });
                    }
                });
            })
        ).catch((e) => console.log(e));

        this.setState({ username: user.username });
        this.setState({ fname: user.fname });
        this.setState({ lname: user.lname });
        this.setState({ email: user.email });
        this.setState({ street: user.street });
        this.setState({ city: user.city });
        this.setState({ state: user.state });
        this.setState({ zip_code: user.zip_code });
        this.setState({ phone: user.phone });
    }

    updateUsername = evt => {
        this.setState({ username: evt.target.value }, () => {
            if (this.state.usernameRegex.test(this.state.username)) {
                this.setState({ isUsernameValid: true });
            } else {
                this.setState({ isUsernameValid: false });
            }
        });
    }
    updateFname = evt => {
        this.setState({ fname: evt.target.value });
    }
    updateLname = evt => {
        this.setState({ lname: evt.target.value });
    }
    updateEmail = evt => {
        this.setState({ email: evt.target.value }, () => {
            if (this.state.emailRegex.test(this.state.email)) {
                this.setState({ isEmailValid: true });
            } else {
                this.setState({ isEmailValid: false });
            }
        });
    }
    updateStreet = evt => {
        this.setState({ street: evt.target.value });
    }
    updateCity = evt => {
        this.setState({ city: evt.target.value });
    }
    updateState = evt => {
        this.setState({ state: evt.target.value });
    }
    updateZipCode = evt => {
        this.setState({ zip_code: evt.target.value });
    }
    updatePhone = evt => {
        this.setState({ phone: evt.target.value });
    }
    updatePassword = evt => {
        this.setState({ password: evt.target.value }, () => {
            if (this.state.passRegex.test(this.state.password)) {
                this.setState({ isPasswordValid: true });
            } else {
                this.setState({ isPasswordValid: false });
            }
            this.passwordMatches();
        });
    }
    updateConfirmPassword = evt => {
        this.setState({ confirm_password: evt.target.value }, () => {
            this.passwordMatches();
        });
    }

    passwordMatches = () => {
        if (this.state.password === this.state.confirm_password) {
            this.setState({ doPasswordsMatch: false });
        } else {
            this.setState({ doPasswordsMatch: true });
        }
    }

    updateReviews = () => {
        fetch("http://localhost:3001/", {
            method: "GET",
        })
        .then(res => res.json())
        .then(result =>{
            result.forEach(account => {
                if (account.username === this.state.username) {
                    sessionStorage.removeItem('user');
                    sessionStorage.setItem('user', JSON.stringify(account));
                    this.setState({ reviews: account.reviews });
                }
            });
        }).catch((e) => console.log(e));
    }
    updateAccountDetails = () => {
        let body = {
            "resetPassword": false,
            "username": this.state.username,
            "fname": this.state.fname,
            "lname": this.state.lname,
            "email": this.state.email,
            "street": this.state.street,
            "city": this.state.city,
            "state": this.state.state,
            "zip_code": this.state.zip_code,
            "phone": this.state.phone,
        }

        if (this.state.doPasswordsMatch && this.state.isPasswordValid) {
            body.password = this.state.password;
            body.resetPassword = true;
        }

        fetch('http://localhost:3001/updateAccount', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
        .then(result => {
            if (result.success) {
                this.updateReviews();
            } else {
                console.log(result.error);
            }
        });
    }

    render() {
        let doPasswordsMatch = <span></span>;
        let isPasswordValid = <span></span>;
        let isUsernameValid = <span></span>;
        let isEmailValid = <span></span>;

        if (this.state.doPasswordsMatch) {
            doPasswordsMatch = <span className='alert'>Passwords do not match!</span>
        }
        if (!this.state.isUsernameValid) {
            isUsernameValid = <span className='alert'><u>USERNAME</u> needs to be 2-15 characters</span>
        }
        if (!this.state.isPasswordValid) {
            isPasswordValid = <span className='alert'><u>PASSWORD</u> needs to contain<ul>
                    <li>1 uppercase letter</li>
                    <li>1 lowercase letter</li>
                    <li>1 special character</li>
                    <li>1 number</li>
                </ul></span>
        }
        if (!this.state.isEmailValid) {
            isEmailValid = <span className='alert'><u>EMAIL</u> needs to look like example@something.com</span>
        }

        return (
            <>
                <Header />
                <div className='container'>
                    <h1>Account Settings</h1>
                    <label htmlFor="username">Username </label>
                    <input type="text" name="username" onChange={this.updateUsername} 
                    value={ this.state.username }/>
                    <br />
                    { isUsernameValid }
                    <br />
                    <label htmlFor="fname">First Name </label>
                    <input type="text" name="fname" onChange={this.updateFname} 
                    value={ this.state.fname }/>
                    <br />
                    <label htmlFor="lname">Last Name </label>
                    <input type="text" name="lname" onChange={this.updateLname} 
                    value={ this.state.lname }/>
                    <br />
                    <label htmlFor="email">Email </label>
                    <input type="text" name="email" onChange={this.updateEmail} 
                    value={ this.state.email }/>
                    <br />
                    { isEmailValid }
                    <br />
                    <label htmlFor="street">Street </label>
                    <input type="text" name="street" onChange={this.updateStreet} 
                    value={ this.state.street }/>
                    <br />
                    <label htmlFor="city">City </label>
                    <input type="text" name="city" onChange={this.updateCity} 
                    value={ this.state.city }/>
                    <br />
                    <label htmlFor="state">State </label>
                    <input type="text" name="state" onChange={this.updateState} 
                    value={ this.state.state }/>
                    <br />
                    <label htmlFor="zipCode">Zip Code </label>
                    <input type="text" name="zipCode" onChange={this.updateZipCode} 
                    value={ this.state.zip_code }/>
                    <br />
                    <label htmlFor="phone">Phone </label>
                    <input type="text" name="phone" onChange={this.updatePhone} 
                    value={ this.state.phone }/>
                    <br />
                    <p className='alert'>If you are not updating your <strong>password</strong> then leave these fields blank.</p>
                    <label htmlFor="password">Password </label>
                    <input type="password" name="password" onChange={this.updatePassword} 
                    value={ this.state.password }/>
                    <br />
                    { isPasswordValid }
                    <br />
                    { doPasswordsMatch }
                    <br />
                    <label htmlFor="newPass">Confirm New Password </label>
                    <input type="password" name="newPass" onChange={this.updateConfirmPassword} 
                    value={ this.state.confirm_password }/>
                    <br />

                    <div className='any-btn'
                    onClick={ this.updateAccountDetails }>Update Your Account Settings</div>
                </div>
                <div className='container'>
                    <h1>Your reviews</h1>
                    {
                        this.state.reviews.map((review, i) => {
                            return <AccountReview key={ i }
                            email={ this.state.email }
                            review={ review }
                            updateReviews={ this.updateReviews }/>
                        })
                    }
                </div>
            </>
        );
    }
}

export default EditAccount;