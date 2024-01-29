import React, { Component } from "react";

import Header from "./header";
import MovieBox from "./mini-components/movie-box";

class Movie extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genres: [],
      query: "",
      movie_list: [],
    };

    this.updateQuery = this.updateQuery.bind(this);

    this.handleGenreSearch = this.handleGenreSearch.bind(this);
    this.handleQuerySearch = this.handleQuerySearch.bind(this);
  }

  updateQuery = (evt) => {
    this.setState({ query: evt.target.value });
    // console.log(this.state.query);
  };

  handleQuerySearch = (evt) => {
    // Use the genre id to search by genre
    let data = {
      query: `${this.state.query}`,
    };

    fetch("http://localhost:3001/searchQuery", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) =>
        this.setState({ movie_list: result }, () => {
          console.log(this.state.movie_list);
        })
      )
      .catch((e) => console.log(e));
  };
  handleGenreSearch = (evt) => {
    // Use the genre id to search by genre
    let data = {
      genreId: `${evt.target.id}`,
    };

    fetch("http://localhost:3001/searchGenre", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) =>
        this.setState({ movie_list: result }, () => {
          console.log(this.state.movie_list);
        })
      )
      .catch((e) => console.log(e));
  };

  render() {
    return (
      <>
        <Header />
        <div className="container">
          <h1 className="title-page">FANDINGO</h1>
          <label htmlFor="query">Search by Actor or Title </label>
          <br />
          <input
            type="text"
            name="query"
            className="search-input"
            onChange={this.updateQuery}
          />
          <br />
          <div className="any-btn" onClick={this.handleQuerySearch}>
            Search
          </div>
          <br />
          <label htmlFor="genre" className="body-head">
            Genres
          </label>
          <br />
          <div name="genre" className="btn-grid">
            <div id="28" onClick={this.handleGenreSearch}>
              Action
            </div>
            <div id="12" onClick={this.handleGenreSearch}>
              Adventure
            </div>
            <div id="16" onClick={this.handleGenreSearch}>
              Animation
            </div>
            <div id="35" onClick={this.handleGenreSearch}>
              Comedy
            </div>
            <div id="80" onClick={this.handleGenreSearch}>
              Crime
            </div>
            <div id="99" onClick={this.handleGenreSearch}>
              Documentary
            </div>
            <div id="18" onClick={this.handleGenreSearch}>
              Drama
            </div>
            <div id="10751" onClick={this.handleGenreSearch}>
              Family
            </div>
            <div id="14" onClick={this.handleGenreSearch}>
              Fantasy
            </div>
            <div id="36" onClick={this.handleGenreSearch}>
              History
            </div>
            <div id="27" onClick={this.handleGenreSearch}>
              Horror
            </div>
            <div id="10402" onClick={this.handleGenreSearch}>
              Music
            </div>
            <div id="9648" onClick={this.handleGenreSearch}>
              Mystery
            </div>
            <div id="10749" onClick={this.handleGenreSearch}>
              Romance
            </div>
            <div id="878" onClick={this.handleGenreSearch}>
              Science Fiction
            </div>
            <div id="10770" onClick={this.handleGenreSearch}>
              TV Movie
            </div>
            <div id="53" onClick={this.handleGenreSearch}>
              Thriller
            </div>
            <div id="10752" onClick={this.handleGenreSearch}>
              War
            </div>
            <div id="37" onClick={this.handleGenreSearch}>
              Western
            </div>
          </div>
        </div>
        <div className="movie-container">
          {this.state.movie_list.map((movie, i) => {
            if ("known_for" in movie) {
              return movie.known_for.map((m, x) => (
                <MovieBox
                  key={x}
                  id={m.id}
                  title={m.title}
                  poster_path={m.poster_path}
                  overview={m.overview}
                  release_date={m.release_date}
                />
              ));
            }

            return (
              <MovieBox
                key={i}
                id={movie.id}
                title={movie.title}
                poster_path={movie.poster_path}
                overview={movie.overview}
                release_date={movie.release_date}
              />
            );
          })}
        </div>
      </>
    );
  }
}

export default Movie;
