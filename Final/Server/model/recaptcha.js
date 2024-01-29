var widgetId1;

var verifyCallback = function (response) {
    alert(response)
};
var onloadCallback = function () {
    widgetId1 = grecaptcha.render('result', {
        'sitekey': '6LdLMj8aAAAAAGW2SUWdVFKCC94OBcc6A4KMM3DZ',
        'theme': 'dark'
    });
    grecaptcha.ready(function () {
        grecaptcha.execute('6LdLMj8aAAAAAGW2SUWdVFKCC94OBcc6A4KMM3DZ', { action: 'signup' })
            .then(function (token) {
            });
    });
};