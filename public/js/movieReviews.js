// Slider Functionality
let slider = document.getElementsByClassName('slider');

const updateRatingImage = evt => {
    evt.target.parentElement.children[1].src = `img/star_rating_${evt.target.value}.png`;
}

for (let i = 0; i < slider.length; i++) {
    slider[i].onchange = updateRatingImage;
}

// Edit Account Validation
const editAccountForm = document.forms["form_name"].getElementsByTagName("input");
let canSignUp = false

const passwordInput = document.getElementsByName("password")[0];
const passwordReentryInput = document.getElementsByName("passwordReentry")[0];
const passwordWarning = document.getElementById("passwordWarning");

const verifySamePassword = () => {
    if(passwordInput.value === passwordReentryInput.value) {
        passwordWarning.style.display = "none"
        canSignUp = true;
    }
    else {
        passwordWarning.style.display = "block"
        canSignUp = false;
    }
}

passwordReentryInput.addEventListener('input', verifySamePassword);

const verifyUpdateAccount = () => {
    for(input in editAccountForm) {
        if(input.value.trim() === "") {
            return false
        }
    }
    if(canSignUp){
        return true;
    }
    return false;
}
