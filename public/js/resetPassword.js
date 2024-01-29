const passwordInput = document.getElementsByName("password")[0];
const passwordReentryInput = document.getElementsByName("passwordReentry")[0];
const passwordWarning = document.getElementById("passwordWarning");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#\$\%\^\&\*\(\)\[\]\{\}\;\:\'\"\\<\>\,\.\/\?]).{8,}$/;


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

const verifyPassword = () => {
    let isValid = passwordRegex.test()
}

const verifyResetPassword = () => {
    if(passwordInput.value === "" || passwordReentryInput.value === "") {
        passwordWarning.style.display = "none"
        canSignUp = true;
    }
    else {
        passwordWarning.style.display = "block"
        canSignUp = false;
    }
}

passwordReentryInput.addEventListener('input', verifySamePassword);