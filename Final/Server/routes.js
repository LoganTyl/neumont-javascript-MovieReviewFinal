module.exports = function(app) {
    const controller = require('./controllers/controller');
    
    app.route('/')
    .get(controller.list)
    .post(controller.handleSignIn);

    app.route('/signup')
    .post(controller.handleSignUp)

    app.route('/searchGenre')
    .post(controller.searchByGenre);
    app.route('/searchQuery')
    .post(controller.searchByQuery);
    
    app.route('/submitReview')
    .post(controller.submitReview);

    app.route('/makeAdmin')
    .post(controller.makeAdmin);
    app.route('/makeNotAdmin')
    .post(controller.makeNotAdmin);

    app.route('/deleteAccount')
    .post(controller.deleteAccount);
    app.route('/deleteReview')
    .post(controller.deleteReview);

    app.route('/updateAccount')
    .post(controller.updateAccount);
}