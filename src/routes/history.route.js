const { Router } = require('express');
const historyRoute = Router();

const historyController = require('../controllers/history.controller');


historyRoute.get('/:userId', historyController.getHistory);
historyRoute.delete('/:transactionId', historyController.deleteHistory);

module.exports = historyRoute;