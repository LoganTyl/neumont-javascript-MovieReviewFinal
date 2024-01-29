import { json } from 'body-parser';
import React, { Component } from 'react';
import Review from '../mini-components/review';

class MovieBoxModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            refresh: false,
        };

        this.updateReviews = this.updateReviews.bind(this);
    }

    updateReviews = review => {
        console.log(review);
        this.props.reviews.push(review);
        this.setState({ refresh: true });
    }
    
    render() {
        const showHideClassName = this.props.show ? "movie-modal movie-display-block" : "movie-modal movie-display-none";

        let alreadyReviewed = false;
        let reviews = <p></p>;
        let reviewList = [];
        if (this.props.reviews) {
            reviewList = this.props.reviews.map((review, i) => {
                if (review.movieId === this.props.id) {
                    if (review.username === JSON.parse(sessionStorage.getItem('user')).username) {
                        alreadyReviewed = true;
                        console.log('this')
                    }
                    return(
                        <div className='review' key={i}>
                            <img src={`img/star_rating_${review.rating}.png`} />
                            <p>{ review.review }</p>
                            <p>Reviewed by <em>{ review.username }</em></p>
                        </div>
                    );
                }
            });

            reviews = reviewList;
        }

        return (
            <>
                <div className={ showHideClassName }>
                    <section className="modal-main">
                        <span className="close-button topright"
                        onClick={ this.props.handleClose.bind(this) }>
                            &times;
                        </span>
                        <div className='modal-container'>
                            <div className='left'>
                                <h1>{ this.props.title }</h1>
                                <img src={`https://image.tmdb.org/t/p/w500${ this.props.poster_path }`}/>
                                <p className='movie-info'>Released { this.props.release_date }</p>
                                <p className='movie-info'>{ this.props.overview }</p>
                            </div>
                            <div className='right'>
                                <div className='review'>
                                    <Review movie_id={ this.props.id }
                                    reviews={ this.props.reviews }
                                    alreadyReviewed={ alreadyReviewed }
                                    updateReviews={ this.updateReviews }/>
                                </div>
                                <div className='reviews'>
                                    { reviews }
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                
            </>
        );
    }
}

export default MovieBoxModal;