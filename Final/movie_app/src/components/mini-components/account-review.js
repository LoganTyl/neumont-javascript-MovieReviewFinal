import React, { Component, useEffect } from 'react';

class AccountReview extends Component {
    constructor(props){
        super(props);

        this.state = {
            user: JSON.parse(sessionStorage.getItem('user')),
            review: this.props.review.review,
            rating: this.props.review.rating,
            img: "",
            refresh: false
        };

        this.updateRating = this.updateRating.bind(this);
        this.updateReview = this.updateReview.bind(this);

        this.handleReview = this.handleReview.bind(this);
    }

    componentDidMount = () => {
        fetch(`https://api.themoviedb.org/3/movie/${this.props.review.movieId}?api_key=da2444bb6b2f3c7c2a698917f8de85e4&language=en-US`, {
            method: "GET",
        })
        .then(res => res.json())
        .then(result => this.setState({ img: `https://image.tmdb.org/t/p/w500${result.poster_path}` }))
        .catch(e => console.log(e));
    }
    
    updateRating = evt => {
        this.setState({ rating: evt.target.value });
    }
    updateReview = evt => {
        this.setState({ review: evt.target.value })
    }

    handleReview = evt => {
        let body = {
            "review": this.state.review,
            "rating": this.state.rating,
            "movieId": this.props.review.movieId,
            "email": this.props.email
        }

        fetch('http://localhost:3001/submitReview', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
        .then(result => this.props.updateReviews() );
    }

    render() {

        return (
            <div className='account-container'>
                <div className='account-review'>
                    <label htmlFor='review'>Review</label>
                    <textarea onChange={ this.updateReview } 
                    name="review" cols="30" rows="10" value={ this.state.review }/>
                    
                    <label htmlFor='rating'>Rating</label>
                    <input onChange={ this.updateRating } 
                    type='range' min='0' max='9' name="rating" className='slider' 
                    value={ this.state.rating }/>
                    <img src={`img/star_rating_${this.state.rating}.png`} />

                    <div className='any-btn' onClick={ this.handleReview }>Update Review</div>
                </div>
                <div>
                    <img src={this.state.img}/>
                </div>
            </div>
        );
    }
}

export default AccountReview;