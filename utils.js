const dateformat = require('dateformat');

exports.todaysDate = () => {
    var today = new Date();
    return dateformat(today, "dd-mm-yyyy");

}
exports.attendanceTime = () => {
    var today = new Date();
    return dateformat(today, "dd-mm-yyyy hh:MM:ss tt");

}

exports.checkEmailIsValid = (email) => {
    var pattern = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    return pattern.test(email)
}


