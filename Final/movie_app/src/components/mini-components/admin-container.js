import React, { Component } from 'react';


class AdminContainer extends Component {
    constructor(props){
        super(props);

        this.state = {
            reviews: []
        };

        this.makeAccountAdmin = this.makeAccountAdmin.bind(this);
        this.makeAccountNotAdmin = this.makeAccountNotAdmin.bind(this);
    }

    makeAccountAdmin = evt => {
        let body = {
            "email": this.props.account.email
        }

        fetch('http://localhost:3001/makeAdmin', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
        .then(result => {
            if (result.success) {
                this.props.updateAccounts(result.success);
            }
        });
    }
    makeAccountNotAdmin = evt => {
        let body = {
            "email": this.props.account.email
        }

        fetch('http://localhost:3001/makeNotAdmin', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
        .then(result => {
            if (result.success) {
                this.props.updateAccounts(result.success);
            }
        });
    }

    deleteAccount = evt => {
        let body = {
            "email": this.props.account.email
        }

        fetch('http://localhost:3001/deleteAccount', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
        .then(result => {
            if (result.success) {
                this.props.updateAccounts(result.success);
            }
        });
    }

    render() {
        let adminHeader = <></>;
        let makeAdminButton = <div className='any-btn' 
        onClick={ this.makeAccountAdmin }>
            Make { this.props.account.fname } { this.props.account.lname } an Admin
        </div>
        if (this.props.account.isAdmin) {
            adminHeader = <h1>Admin</h1>

            makeAdminButton = <div className='any-btn' 
            onClick={ this.makeAccountNotAdmin }>
                Make { this.props.account.fname } { this.props.account.lname } not an Admin
            </div>
        }

        if (this.props.account.username !== JSON.parse(sessionStorage.getItem('user')).username) {
            return (
                <div className='container'>
                    { adminHeader }
                    <p>{ this.props.account.username }</p>
                    <p>{ this.props.account.email }</p>
                    <p>{ this.props.account.fname }</p>
                    <p>{ this.props.account.lname }</p>
                    <p>{ this.props.account.street }</p>
                    <p>{ this.props.account.city }</p>
                    <p>{ this.props.account.state }</p>
                    <p>{ this.props.account.zip_code }</p>
                    <p>{ this.props.account.phone }</p>
                    { makeAdminButton }
                    <div className='any-btn'
                    onClick={ this.deleteAccount }
                    >Delete Account</div>
                </div>
            );
        } else {
            return (<></>);
        }
    }
}

export default AdminContainer;