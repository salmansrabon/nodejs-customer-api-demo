const express=require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:"Server is up"
    });
});
const apiRoute="/api/v1";

const db=path.join(__dirname, './data.json'); //Locate the data file
const data = fs.readFileSync(db); //Read data from data file
const stats = JSON.parse(data); //To make data in json format

router.get(apiRoute+'/list', function (req, res) {
    res.status(200).json(stats);
});

router.get(apiRoute+'/get/:id', (req, res, next) => {
    try {
        const customerStats = stats.find(customer => customer.id === Number(req.params.id));
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

router.post(apiRoute+'/create', (req, res, next) => {
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
            fs.writeFileSync(db, JSON.stringify(stats));
            res.status(201).json({
                message:"Success",
                Customers:newStats
            });
            
        }
        else{
            const err = new Error('Customer already exists');
            err.status = 200;
            throw err;
        }
    } 
    catch (e) 
    {
        next(e);
    }
});
router.put(apiRoute+'/update/:id', (req, res, next) => {
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
        fs.writeFileSync(db, JSON.stringify(newStats));
        res.status(200).json({
            message:"Success",
            Customers:newStatsData
        });
    } 
    catch (e) 
    {
        next(e);
    }

});

router.delete(apiRoute+'/delete/:id', (req, res, next) => {
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
        fs.writeFileSync(db, JSON.stringify(newStats));
        res.status(200).json({
            message: 'Customer deleted!'
        })
    } 
    catch (e) {
        next(e);
    }
});

module.exports=router;