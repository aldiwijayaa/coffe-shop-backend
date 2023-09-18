const { Router } = require('express');

const masterRouter = Router();

const usersRoute = require('./users.route');
const productsRoute = require('./products.route');
const historyRoute = require('./history.route');



masterRouter.use('/users', usersRoute);
masterRouter.use('/products', productsRoute);
masterRouter.use('/history', historyRoute);


module.exports = masterRouter;