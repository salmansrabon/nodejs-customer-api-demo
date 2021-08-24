const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { todaysDate, attendanceTime, checkEmailIsValid } = require('../../utils');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Server is up"
    });
});
const apiRoute = "/api/v1";

const studentdb = path.join(__dirname, './db/student.json'); //Locate the data file
const studentdata = fs.readFileSync(studentdb); //Read data from data file
const students = JSON.parse(studentdata); //To make data in json format

router.get(apiRoute + '/list', function (req, res) {

    var count = Object.keys(students).length;
    res.json({
        Count: count,
        Customers: students
    });

});

router.get(apiRoute + '/email/:email', (req, res, next) => {

    try {

        const { email } = req.params;
        const stuObj = students.find(s => { return s.email === email && s.datetime.includes(String(todaysDate())) })

        const newInfo = {
            email: req.params.email,
            datetime: attendanceTime()
        };
        if (stuObj) {
            res.status(200).json({
                message: 'Already submitted!'
            })
        }
        else {
            if (checkEmailIsValid(req.params.email)) {
                const start = 13 * 60 + 50;
                const end = 16 * 60 + 00;
                const date = new Date();
                const now = date.getHours() * 60 + date.getMinutes();
                if (date.getDay() == 3 || date.getDay() == 6) {
                    if (start <= now && now <= end) {
                        students.push(newInfo);
                        fs.writeFileSync(studentdb, JSON.stringify(students));
                        res.status(201).json({
                            message: "success",
                            Students: newInfo
                        });
                    }
                    else {
                        res.status(200).json({
                            message: '' + date + ' This is not class time! You can give attendance from 07:50 PM'
                        })
                    }
                }
                else {
                    res.status(200).json({
                        message: 'Today is not class day! Only Saturday and Wednesday is the scheduled class day'
                    })
                }

            }
            else {
                res.status(200).json({
                    message: 'Invalid email format'
                })
            }


        }


    } catch (e) {
        next(e);
    }

});

module.exports = router;
