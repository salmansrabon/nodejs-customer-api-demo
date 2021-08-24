const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('../../jwtMiddleware');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Server is up"
    });
});
const apiRoute = "/api/v1";

const customerdb = path.join(__dirname, './db/data.json'); //Locate the data file
const customerInfo = fs.readFileSync(customerdb); //Read data from data file
const stats = JSON.parse(customerInfo); //To make data in json format

const userdb = path.join(__dirname, './db/user.json'); //Locate the data file
const userdata = fs.readFileSync(userdb); //Read data from data file
const users = JSON.parse(userdata); //To make data in json format

router.get(apiRoute + '/list', authenticateJWT, function (req, res) {
    const data = fs.readFileSync(customerdb); //Read data from data file
    const stats = JSON.parse(data); //To make data in json format
    var count = Object.keys(stats).length;

    res.json({
        Count: count,
        Customers: stats
    });

});

router.get(apiRoute + '/get/:id', authenticateJWT, (req, res, next) => {
    try {
        const data = fs.readFileSync(customerdb); //Read data from data file
        const stats = JSON.parse(data); //To make data in json format
        const customerStats = stats.find(customer => customer.id === Number(req.params.id));
        console.log(customerStats);
        if (!customerStats) {
            const err = new Error('Customer info not found');
            err.status = 404;
            throw err;
        }
        res.json(customerStats);

    } catch (e) {
        next(e);
    }
});
router.post(apiRoute + '/find', authenticateJWT, (req, res, next) => {
    try {
        const customerStats = stats.find(customer => customer.email === String(req.body.email));
        console.log(customerStats);
        if (!customerStats) {
            const err = new Error('Customer info not found');
            err.status = 404;
            throw err;
        }
        res.json(customerStats);

    } catch (e) {
        next(e);
    }
});

router.post(apiRoute + '/create', authenticateJWT, (req, res, next) => {
    try {
        const customerStats = stats.find(customer => customer.id === Number(req.body.id));
        if (!customerStats) {
            const newStats = {
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                address: req.body.address,
                phone_number: req.body.phone_number,
            };
            stats.push(newStats);
            fs.writeFileSync(customerdb, JSON.stringify(stats));
            res.status(201).json({
                message: "Success",
                Customers: newStats
            });

        }
        else {
            const err = new Error('Customer already exists');
            err.status = 208;
            throw err;
        }
    }
    catch (e) {
        next(e);
    }
});
router.put(apiRoute + '/update/:id', authenticateJWT, (req, res, next) => {
    try {
        const customerStats = stats.find(customer => customer.id === Number(req.params.id));
        if (!customerStats) {
            const err = new Error('Customer data not found');
            err.status = 404;
            throw err;
        }
        const newStatsData = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            phone_number: req.body.phone_number,
        };
        const newStats = stats.map(customer => {
            if (customer.id === Number(req.params.id)) {
                return newStatsData;
            } else {
                return customer;
            }
        });
        fs.writeFileSync(customerdb, JSON.stringify(newStats));
        res.status(200).json({
            message: "Success",
            Customers: newStatsData
        });
    }
    catch (e) {
        next(e);
    }

});

router.delete(apiRoute + '/delete/:id', authenticateJWT, (req, res, next) => {
    try {
        const customerStats = stats.find(customer => customer.id === Number(req.params.id));
        if (!customerStats) {
            const err = new Error('Customer not found');
            err.status = 404;
            throw err;
        }
        const newStats = stats.map(customer => {
            if (customer.id === Number(req.params.id)) {
                return null;
            } else {
                return customer;
            }
        })
            .filter(customer => customer !== null);
        fs.writeFileSync(customerdb, JSON.stringify(newStats));
        res.status(200).json({
            message: 'Customer deleted!'
        })
    }
    catch (e) {
        next(e);
    }
});

const accessTokenSecret = 'myaccesstokensecret';
router.post(apiRoute + '/login', (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Filter user from the users array by username and password
        const user = users.find(u => { return u.username === username && u.password === password });

        if (user) {
            // Generate an access token
            const token = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '30m' });

            res.json({
                token
            });
        } else {
            const err = new Error('Username or password incorrect');
            err.status = 401;
            throw err;
        }

    } catch (e) {
        next(e);
    }
});

module.exports = router;