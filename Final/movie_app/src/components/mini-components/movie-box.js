import React, { Component } from 'react';
import MovieBoxModal from '../modals/movie-box-modal';

class MovieBox extends Component {
    constructor(props){
        super(props);

        this.state = {
            reviews: [],
            showMovieModal: false
        };

        this.showMovieModal = this.showMovieModal.bind(this);
        this.hideMovieModal = this.hideMovieModal.bind(this);
    }

    componentDidMount = () => {
        fetch('http://localhost:3001/', {
            method: "GET"
        }).then(res => res.json())
        .then(result => this.setState({ accounts: result }, () => {
            // Adds all the reviews to a session variable
            let list = [];
            sessionStorage.removeItem('reviews');
            this.state.accounts.forEach(account => {
                account.reviews.forEach(review => {
                    let rev = {
                        "username": account.username,
                        "review": review.review,
                        "rating": review.rating,
                        "movieId": review.movieId
                    }
                    list.push(rev);
                });
                sessionStorage.setItem("reviews", JSON.stringify(list));
            });
            this.setState({ reviews: list });
        }))
        .catch(e => console.log(e));
    }

    showMovieModal = evt => {
        this.setState({showMovieModal: true});
    }
    hideMovieModal = evt => {
        this.setState({showMovieModal: false});
    }

    render() {
        return (
            <>
                <MovieBoxModal id={ this.props.id } 
                title={ this.props.title }
                poster_path={ this.props.poster_path } 
                release={ this.props.release_date }
                overview={ this.props.overview }
                reviews={ this.state.reviews }
                show={ this.state.showMovieModal }
                handleClose={ this.hideMovieModal }/>
                <div className='movie-box'>
                    {/* <h1>{ this.props.title }</h1> */}
                    <img onClick={ this.showMovieModal } src={`https://image.tmdb.org/t/p/w500${ this.props.poster_path }`}/>
                    {/* <p className='movie-info'>Released { this.props.release_date }</p> */}
                    {/* <p className='movie-info'>{ this.props.overview }</p> */}
                    <div className="any-btn" onClick={ this.showMovieModal }>View More Information Now</div>
                </div>
            </>
        );
    }
}

export default MovieBox;