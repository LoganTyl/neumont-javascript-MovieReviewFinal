const bcrypt = require("bcrypt");
const { text, json } = require("body-parser");
const e = require("express");
const nodemailer = require("nodemailer");
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const request = require('request');

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/fandingo");

const mdb = mongoose.connection;
mdb.on("error", console.error.bind(console, "connection error:"));
mdb.once("open", function (callback) { });

var accountSchema = mongoose.Schema({
  isAdmin: Boolean,
  username: String,
  fname: String,
  lname: String,
  street: String,
  city: String,
  state: String,
  zip_code: String,
  email: String,
  password: String,
  phone: String,
  reviews: Array,
});

var Account = mongoose.model("accounts", accountSchema);

let genres = "https://api.themoviedb.org/3/genre/movie/list?api_key=da2444bb6b2f3c7c2a698917f8de85e4&language=en-US";

exports.root = (req, res) => {
  Account.find((err, accounts) => {
    if (err) throw err;
    res.render("root", {
      accounts,
    });
  });
};

exports.moviePage = (req, res) => {
  res.render('moviePage', {
    accountData: req.session.user.account
  });
}

exports.moviePageSearch = (req, res) => {
  let r = [];
  let a;

  Account.find((err, accounts) => {
    if (err) throw err;

    accounts.forEach(user => {
      if (user.reviews.length !== 0) {
        user.reviews.forEach(rev => {
          let object = {
            review: rev,
            name: user.username,
            email: user.email
          }
          r.push(object);
        })
      }
    });

    // console.log(r)
  });

  // Use search terms to get API data back.
  let genre_search;
  let title_search
  let actor_search;
  let title = req.body.title;
  let actor = req.body.actor;
  let genreId;


  // Priorities TITLE as a search and then GENRE and then ACTORS
  if (title) {
    title_search = `https://api.themoviedb.org/3/search/movie?api_key=da2444bb6b2f3c7c2a698917f8de85e4&language=en-US&query=${encodeURI(title)}&page=1&include_adult=false`;
    let request = new XMLHttpRequest();

    request.open('GET', title_search, true);

    request.onload = () => {
      let list = JSON.parse(request.responseText).results;
      list.title = true;
      req.session.user.queriedMovies = list;

      res.render('layout', {
        movieList: list,
        reviews: r,
        loggedInUser: req.session.user.account
      });
    }

    request.send();
  }
  if (actor) {
    actor_search = `https://api.themoviedb.org/3/search/person?api_key=da2444bb6b2f3c7c2a698917f8de85e4&language=en-US&query=${encodeURI(actor)}&page=1&include_adult=false&media_type=movie`;
    let request = new XMLHttpRequest();

    request.open('GET', actor_search, true);

    request.onload = () => {
      let list = JSON.parse(request.responseText).results;
      list.actor = true;
      req.session.user.queriedMovies = list;

      res.render('layout', {
        movieList: list,
        reviews: r,
        loggedInUser: req.session.user.account
      });
    }

    request.send();
  }
  if (req.body.genre) {
    // console.log(returnGenreId(req.body.genre));
    // console.log(genre);
    let request = new XMLHttpRequest();
    let request2 = new XMLHttpRequest();

    request.open('GET', genres, true);

    request.onload = () => {
      let data = JSON.parse(request.responseText);
      if (data) {
        data.genres.forEach(genre => {
          if (genre.name.toLowerCase() == req.body.genre.toLowerCase()) {
            genreId = genre.id;
            genre_search = `https://api.themoviedb.org/3/discover/movie?api_key=da2444bb6b2f3c7c2a698917f8de85e4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${encodeURI(genreId)}`;

            request2.open('GET', genre_search, true);

            request2.onload = () => {
              let list = JSON.parse(request2.responseText).results;
              list.genre = true;
              req.session.user.queriedMovies = list;

              res.render('layout', {
                movieList: list,
                reviews: r,
                loggedInUser: req.session.user.account
              });
            }

            request2.send();
          }
        });
      } else {
        console.log('Genre List has not loaded yet.')
      }
    }

    request.send();
  }

}

exports.login = (req, res) => {
  let userName = req.body.username;
  let lowercaseUserName = req.body.username.toLowerCase();
  // If username format is capital first and last letter
  lowercaseUserName = lowercaseUserName.charAt(0).toUpperCase() + lowercaseUserName.slice(1);
  lowercaseUserName = lowercaseUserName.slice(0, -1) + lowercaseUserName[lowercaseUserName.length - 1].toUpperCase();
  //
  console.log(userName);

  Account.findOne({ username: { $in: [userName, lowercaseUserName] } }, (err, account) => {
    if (err) throw err;
    bcrypt.compare(req.body.password, account.password, (err, response) => {
      if (err) console.log(err);

      if (response) {
        req.session.user = {
          isAuthenticated: true,
          account: account
        }
        res.redirect('/moviePage');
      } else {
        res.redirect('/');
      }
    });
  });
}

exports.signup = (req, res) => {
  res.render('signup');
}

exports.createAccount = (req, res) => {
  let body = req.body;
  bcrypt.hash(body.password, 10, (err, response) => {
    if (err) console.log(err);
    let user = new Account({
      email: `${body.email}`,
      username: `${body.username}`,
      password: `${response}`,
    });
    user.save((err, person) => {
      if (err) {
        res.render("signup", {
          errmsg: "Error"
        });
      } else {
        res.redirect("/");
      }
      console.log(`${body.username} added`);
    });
  });
}

exports.handleSend = (req, res) => {
  const secretKey = "6LdLMj8aAAAAAMgyGmCrT1oKQDZEAc7YhWY68ida";
  // const token = req.body.token;
  // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

  if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({ "responseError": "Please select captcha first" });
  }

  const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

  request(verificationURL, function (error, response, body) {
    body = JSON.parse(body);

    if (body.success !== undefined && !body.success) {
      return res.json({ "responseError": "Failed captcha verification" });
    }
    else {
      let body = req.body;
      bcrypt.hash(body.password, 10, (err, response) => {
        if (err) console.log(err);
        let user = new Account({
          email: `${body.email}`,
          username: `${body.username}`,
          password: `${response}`,
        });
        user.save((err, person) => {
          if (err) {
            res.render("signup", {
              errmsg: "Error"
            });
          } else {
            res.redirect("/");
          }
          console.log(`${body.username} added`);
        });
      });
    }
  });
};

exports.test = (req, res) => {
  let rev = {
    review: req.body.review,
    rating: req.body.rating,
    movieId: req.body.movieId
  };
  let reviewedMovieBefore = false;

  Account.find({ email: req.session.user.account.email }, (err, account) => {
    if (err) throw err;
    console.log(account)
    account[0].reviews.forEach(review => {
      if (review.movieId == rev.movieId) {
        reviewedMovieBefore = true;
      }
    });
    if (reviewedMovieBefore) {
      let reviews = account[0].reviews;
      reviews.forEach(review => {
        if (review.movieId == rev.movieId) {
          review.rating = rev.rating;
          review.review = rev.review;
        }
      });
      Account.findOneAndUpdate(
        { email: req.session.user.account.email },
        { $set: { reviews: reviews } },
        (err, data) => {
          if (err) res.send(err);
          console.log(data);
        }
      );
    }
    else {
      Account.findOneAndUpdate(
        { email: req.session.user.account.email },
        { $push: { reviews: rev } },
        (err, data) => {
          if (err) res.send(err);
          console.log(data);
        }
      );
    }
    res.redirect('/moviePage');
    // res.render('/moviePage', {
    //   movieList: req.session.user.queriedMovies
    // });
  })

};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
}

exports.editAccount = (req, res) => {
  Account.findOne({ email: req.session.user.account.email }, (err, account) => {
    if (err) res.send(err);
    res.render("editAccount", {
      account: account
    });
  })

}

exports.adminPage = (req, res) => {
  if (req.session.user.account.isAdmin) {
    Account.find((err, accounts) => {
      if (err) res.redirect('/');
      res.render('admin', {
        accounts,
      });
    });
  }
}

exports.deleteAccount = (req, res) => {
  Account.deleteOne({ email: req.body.email })
    .then(() => {
      console.log(`${req.body.email} was deleted`);
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
}

exports.deleteReview = (req, res) => {
  Account.updateOne({ email: req.body.email }, { $pull: { "reviews": { "movieId": req.body.movieId } } }, { safe: true, multi: true })
    .then(() => {
      console.log(`${req.body.movieId} was deleted`);
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
}

exports.updateAccountInfo = (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    let myHash = hash;
    Account.findOneAndUpdate(
      { email: req.session.user.account.email },
      {
        $set: {
          username: req.body.username, password: myHash, fname: req.body.firstName, lname: req.body.lastName, email: req.body.email,
          street: req.body.street, city: req.body.city, state: req.body.state, zip_code: req.body.zipCode, phone: req.body.phone
        }
      },
      (err, data) => {
        if (err) res.send(err);
        console.log(data);
        let accountReviews = req.session.user.account.reviews;
        let isAccountAnAdmin = req.session.user.account.isAdmin;
        req.session.user.account = {
          isAdmin: isAccountAnAdmin,
          username: req.body.username,
          fname: req.body.firstName,
          lname: req.body.lastName,
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          zip_code: req.body.zipCode,
          email: req.body.email,
          password: myHash,
          phone: req.body.phone,
          reviews: accountReviews
        }
      }
    );
    res.redirect('/');
  })
}

exports.makeAdmin = (req, res) => {
  Account.updateOne({ email: req.body.email }, { isAdmin: true })
    .then(() => {
      console.log(`${req.body.email} is admin.`);
      req.session.user.account.isAdmin = true;
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
}

exports.makeNotAdmin = (req, res) => {
  Account.updateOne({ email: req.body.email }, { isAdmin: false })
    .then(() => {
      console.log(`${req.body.email} is not admin.`);
      req.session.user.account.isAdmin = false;
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
}

exports.sendEmailForPassword = (req, res) => {
  res.render('forgotPasswordSendEmail', {
    failedEmailAttempt: false
  })
}

exports.processSendEmailForPassword = (req, res) => {
  Account.findOne({ email: req.body.email }, (err, account) => {
    if (account) {
      async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: '', // OUTLOOK EMAIL HERE ----------------------------------------------------------------------------------------------------
            pass: '', // OUTLOOK PASSWORD HERE ----------------------------------------------------------------------------------------------------
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: "", // OUTLOOK EMAIL HERE ----------------------------------------------------------------------------------------------------
          // to: `${account.email}`,
          to: '', // OUTLOOK EMAIL HERE ----------------------------------------------------------------------------------------------------
          subject: "Movie Review Forgot Password", // Subject line
          text: "Click on the link to reset your password", // plain text body
          html: `<p>Click on the attached link to reset your password.</p>
          <a href="localhost:3000/reset?id=${account._id}">Reset Password Here!</a>`, // html body
        });
      }

      main().catch(console.error)
        .then(res.redirect('/'));
    }
    else {
      res.render('forgotPasswordSendEmail', {
        failedEmailAttempt: true
      })
    }
  })
}

exports.resetPasswordPage = (req, res) => {
  console.log(req.query.id);
  let validAccount = false;
  Account.findOne({ '_id': req.query.id }, (err, account) => {
    console.log(account)
    if (account) {
      validAccount = true;
    }
    else {
      validAccount = false;
    }
    if (validAccount) {
      res.render('reset')
    } else {
      res.redirect('/')
    }
  })
}

exports.processResetPassword = (req, res) => {
  let accountId = req.query.id;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) console.log(err)
    let myHash = hash;
    Account.findOneAndUpdate(
      { _id: accountId },
      {
        $set: {
          password: myHash,
        }
      },
      (err, data) => {
        if (err) res.send(err);
        console.log(data);
      }
    );
    res.redirect('/');
  })
}