const express = require('express');
const bodyParser = require('body-parser');

require('./v1_0/subscriptions');
const routes = require('./routes');
const { settings } = require('service-claire/helpers/config');
const helmet = require('service-claire/middleware/helmet');
const errorHandler = require('service-claire/middleware/errors');
const logger = require('service-claire/helpers/logger');

require('./v1_0/rpc');

logger.register('fa387c96e438588fb001e4f02510f3c3');

const app = express();

app.enable('trust proxy');
app.use(helmet());
app.use(bodyParser.json());
app.use('/billing', routes);
app.use(errorHandler);

const server = app.listen(settings.port, () => logger.log(`✅ 📨 service-billing running on port ${settings.port}`));

module.exports = { app, server }; // For testing
