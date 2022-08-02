const { COMMAND_BILLING_CREATE, COMMAND_BILLING_ADD_SEAT, COMMAND_BILLING_REMOVE_SEAT } = require('service-claire/events');
const { createBilling, addSeat, removeSeat } = require('../controllers/billing');

const exchange = `${process.env.NODE_ENV || 'development'}.billing`;

module.exports = async (connect) => {
  const connection = await connect;
  const ch = await connection.createChannel();

  ch.assertExchange(exchange, 'fanout', { durable: false });

  const q = await ch.assertQueue('');
  const ok = await ch.bindQueue(q.queue, exchange, '');

  ch.consume(q.queue, (msg) => {
    const message = JSON.parse(msg.content.toString());

    switch (message.event) {
      case COMMAND_BILLING_CREATE:
        return createBilling(message.meta);
      case COMMAND_BILLING_ADD_SEAT:
        return addSeat(message.meta);
      case COMMAND_BILLING_REMOVE_SEAT:
        return removeSeat(message.meta);
      default:
        // Do nothing
    }
  }, { noAck: true });

  return ok;
};
