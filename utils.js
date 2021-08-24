const dateformat = require('dateformat');

exports.todaysDate = () => {
    var today = new Date();
    return dateformat(today, "dd-mm-yyyy");

}
exports.attendanceTime = () => {
    var today = new Date();
    var nowTime=today.setDate(today.getDate()+6);
    return dateformat(nowTime, "dd-mm-yyyy hh:MM:ss tt");

}

exports.checkEmailIsValid = (email) => {
    var pattern = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    return pattern.test(email)
}


