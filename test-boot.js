/* eslint-disable */

const chai = require('chai');
const chaiHttp = require('chai-http');

const { server } = require('./src');

chai.use(chaiHttp);

/*
 * Manually close the server down so that
 * when we run the tests in watch mode, the
 * port doesn't appear to be used
 */
after(done => {
  console.log('Closing server...');
  server.close();
  done();
});
