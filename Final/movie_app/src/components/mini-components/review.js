import React, { Component, useEffect } from 'react';

class Review extends Component {
    constructor(props){
        super(props);

        this.state = {
            user: JSON.parse(sessionStorage.getItem('user')),
            review: "",
            rating: 0,
            alreadyReviewed: false,
            refresh: false
        };

        this.updateRating = this.updateRating.bind(this);
        this.updateReview = this.updateReview.bind(this);
        this.updateAlreadyReviewed = this.updateAlreadyReviewed.bind(this);

        this.handleReview = this.handleReview.bind(this);
    }

    componentDidMount = () => {
        this.setState({ email: this.state.user.email });
    }
    
    updateRating = evt => {
        this.setState({ rating: evt.target.value });
    }
    updateReview = evt => {
        this.setState({ review: evt.target.value })
    }
    updateAlreadyReviewed = (bool = false) => {
        if (bool) {
            this.props.reviews.forEach(review => {
                if (review.movieId === this.props.movie_id && review.username === this.state.user.username) {
                    console.log('something')
                    this.setState({ alreadyReviewed: true });
                }
            });
        } else {
            this.setState({ alreadyReviewed: true });
        }
    }

    handleReview = evt => {
        let body = {
            "review": this.state.review,
            "rating": this.state.rating,
            "movieId": this.props.movie_id,
            "email": this.state.email
        }

        fetch('http://localhost:3001/submitReview', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
        .then(result => this.props.updateReviews(result))
        .then(this.setState({ rating: 0 }, () => {
            this.setState({ review: "" }, () => {
                this.updateAlreadyReviewed();
            });
        }));
    }

    render() {
        let reviewForm = <>
                    <label htmlFor='review'>Review</label>
                    <textarea onChange={ this.updateReview } 
                    name="review" cols="30" rows="10" value={ this.state.review }/>
                    
                    <label htmlFor='rating'>Rating</label>
                    <input onChange={ this.updateRating } 
                    type='range' min='0' max='9' name="rating" className='slider' 
                    value={ this.state.rating }/>
                    <img src={`img/star_rating_${this.state.rating}.png`} />

                    <button onClick={ this.handleReview }>Submit Review</button>
                </>;
        
        if (this.state.alreadyReviewed || this.props.alreadyReviewed) {
            reviewForm = <>
                <p>You have already reviewed this movie once.</p>
                <p>Edit your review on your <a href='/account'>account page</a></p>
            </> 
        }

        return (
            <div className='review'>
                { reviewForm }
            </div>
        );
    }
}

export default Review;