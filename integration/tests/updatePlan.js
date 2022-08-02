const chai = require('chai');

const { expect } = chai;
const { createToken } = require('service-claire/helpers/tokens');
const { createForgery } = require('service-claire/test/helpers/forgery');

const { app } = require('../../src/index');
const limits = require('../../src/rate-limits');

describe('Update Plan 1.0', () => {
  afterEach((done) => {
    limits.resetKey('::ffff:127.0.0.1');
    setTimeout(done, 1000);
  });

  describe('PUT /billing/me', () => {
    it('returns forbidden if not the admin', (done) => {
      // Create a token
      const token = createToken({
        userId: 1,
        email: 'test@test.com',
        status: 'active',
        accountId: '1',
        privilege: 'user',
      });

      chai.request(app)
        .put('/billing/me')
        .set({
          'X-Api-Version': '1.0',
          token,
        })
        .end((err, resp) => {
          expect(resp.status).to.be.equal(403);
          expect(resp.body).to.be.an('object');
          expect(resp.body.reason).to.not.be.empty;
          expect(resp.body.code).to.be.equal('Forbidden');

          done();
        });
    });

    it('returns forbidden if the credentials are invalid', (done) => {
      // Create a token
      const token = createToken({
        userId: 1,
        email: 'test@test.com',
        status: 'active',
        accountId: '1',
      });

      // Forge the token
      const forgery = createForgery(token);

      chai.request(app)
        .put('/billing/me')
        .set({
          'X-Api-Version': '1.0',
          token: forgery,
        })
        .end((err, resp) => {
          expect(resp.status).to.be.equal(403);
          expect(resp.body).to.be.an('object');
          expect(resp.body.reason).to.not.be.empty;
          expect(resp.body.code).to.be.equal('Forbidden');

          done();
        });
    });
  });
});
