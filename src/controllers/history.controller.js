const historyModel = require('../models/history.model');

const getHistory = async (req, res) => {
    try {
        const { query, params } = req;
        const result = await historyModel.getHistory(params, query);
        if (result.rows.length === 0) {
            return res.status(200).json({
                data: result.rows,
                msg: "Data not found"
            });
        }
        res.status(200).json({
            data: result.rows,
            msg: "Get history data"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};

const deleteHistory = async (req, res) => {
    try {
        const { params } = req;
        await historyModel.deleteCart(params);
        const result = await historyModel.deleteTransaction(params);
        res.status(201).json({
            data: result.rows,
            msg: "Transactions deleted"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};

module.exports = {
    getHistory,
    deleteHistory,
   
};