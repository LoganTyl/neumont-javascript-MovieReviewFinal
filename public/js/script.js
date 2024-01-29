console.log(data);

let email = document.getElementById("emailInput");
// let rating = document.getElementById("ratingInput");
// let review = document.getElementById("reviewInput");
let submit = document.getElementById("submitBtn");

email.addEventListener('input', evt => {
    let log = evt.target;
    let pass = log.parentElement.parentElement.children[2].children[0].value;
    // rating.disabled = true;
    // review.disabled = true;
    submit.disabled = true;
    // review.innerText = "";
    // rating.value = 1;
    data.forEach(user => {
        if (log.value.toLowerCase() === user.username.toLowerCase()) {
            // rating.disabled = false;
            // review.disabled = false;
            submit.disabled = false;
            // if(user.reviews.length != 0){
            //     review.innerText = user.reviews[0].review;
            //     rating.value = user.reviews[0].rating;
            // }
        }
    });
});
