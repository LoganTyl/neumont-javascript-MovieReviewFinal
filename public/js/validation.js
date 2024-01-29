const usernameRegex = /^.{2,15}$/;
const emailRegex = /^.+@.{2,}\.[A-Za-z0-9]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#\$\%\^\&\*\(\)\[\]\{\}\;\:\'\"\\<\>\,\.\/\?]).{8,}$/;

const activeVerify = (evt) => {
    let isValid;
    switch(evt.target.name){
        case "username":
            isValid = usernameRegex.test(evt.target.value);
            evt.target.style.color = isValid ? "#000" : "#F00";
            document.getElementById("usernameError").innerText = isValid ? "" : "Username is invalid. 2-15 Characters";
            break;
        case "email":
                isValid = emailRegex.test(evt.target.value);
                evt.target.style.color = isValid ? "#000" : "#F00";
                document.getElementById("emailError").innerText = isValid ? "" : "Email is invalid (ex. email@email.com)";
            break;
        case "password":
                isValid = passwordRegex.test(evt.target.value);
                evt.target.style.color = isValid ? "#000" : "#F00";
                document.getElementById("passwordError").innerText = isValid ? "" : "Password is invalid. Length of 8, one capital, one special character, and one number";
            break;
    }
};

const checkField = (field) => {
    switch(field.name){
        case "username":
            return usernameRegex.test(field.value);
        case "email":
            return emailRegex.test(field.value);
        case "password":
            return passwordRegex.test(field.value);
        default:
            return true;
    }
};

const checkAllFields = () => {
    for(let field of document.getElementsByClassName("form_field")){
        if(!checkField(field)) {
            return false;
        }
    }
    return true;
};

const finalVerify = (evt) => {
    let allGood = checkAllFields();
    if(allGood) {
        return true;
    } else {
        evt.preventDefault();
        return false;
    }
};

document.getElementById("submitBtn").addEventListener('click', finalVerify);

for(let field of document.getElementsByClassName("signup_field")){
    field.addEventListener('input', activeVerify);
}