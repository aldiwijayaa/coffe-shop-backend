const usersModel = require('../models/users.model');
const bcrypt = require('bcrypt')

const getUsers = async(req, res) => {
    try {
        const { query } = req;
        const result = await usersModel.getUsers(query);
        if (result.rows.length === 0) {
            res.status(404).json({
                data: result.rows,
                msg: "Data not found"
            });
        } else {
            res.status(200).json({
                data: result.rows,
                msg: "Get users data"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};


const findUsers = async (req, res) => {
    try {
        const { params } = req;
        const result = await usersModel.findUsers(params);
        if (result.rows.length === 0) {
            res.status(404).json({
                data: result.rows,
                msg: "Data not found"
            });
        } else {
            res.status(200).json({
                data: result.rows,
                msg: "Get users data"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const createUsers = async (req, res) => {
    try {
        const { email, password, phoneNumber } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10)
        const result = await usersModel.createUsers(email, encryptedPassword, phoneNumber);
        res.status(201).json({
            data: result.rows,
            msg: "Success create new account"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};

const updateUsers = async (req, res) => {
    try {
        const { body, params } = req;
        const result = await usersModel.updateUsers(body, params);
        res.status(201).json({
            data: result.rows,
            msg: "Account updated"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};

const deleteUsers = async (req, res) => {
    try {
        const { params } = req;
        const result = await usersModel.findUsers(params)
        await usersModel.deleteUsers(params);
        res.status(201).json({
            data: result.rows,
            msg: "Account deleted"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};

module.exports = {
    getUsers,
    createUsers,
    updateUsers,
    deleteUsers,
    findUsers
};