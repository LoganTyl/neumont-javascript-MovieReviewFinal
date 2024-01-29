//Site key: 6LdLMj8aAAAAAGW2SUWdVFKCC94OBcc6A4KMM3DZ
//Secret key: 6LdLMj8aAAAAAMgyGmCrT1oKQDZEAc7YhWY68ida

var widgetId1;

// function handleClick(token) {
//     return function () {
//         var data = {
//             token: token
//         };

//         fetch('/signup', {
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             method: 'post',
//             body: JSON.stringify(data)
//         })
//             .then(response => response.text())
//             .then(text => showResult(text))
//             .catch(error => showResult(error));
//     }
// }

var verifyCallback = function (response) {
    alert(response)
};
var onloadCallback = function () {
    widgetId1 = grecaptcha.render('result', {
        'sitekey': '6LdLMj8aAAAAAGW2SUWdVFKCC94OBcc6A4KMM3DZ',
        'theme': 'light'
    });
    grecaptcha.ready(function () {
        grecaptcha.execute('6LdLMj8aAAAAAGW2SUWdVFKCC94OBcc6A4KMM3DZ', { action: 'signup' })
            .then(function (token) {
            });
    });
};
