'use strict';

const assert = require('assert');
const wrapRouter = require('../').wrapRouter;
const wrapHandler = require('../').wrapHandler;
const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const async = require('async');

describe('normal', function () {

  it('get, post, put, delete', function (done) {

    const app = express();
    const router = wrapRouter(new express.Router());
    app.use(bodyParser.json());
    app.use(router);

    router.get('/a', async function (req, res) {
      res.json(req.query);
    });

    router.post('/b', async function (req, res) {
      res.json(req.body);
    });

    router.put('/c', async function (req, res) {
      res.json(req.body);
    });

    router.delete('/d', async function (req, res) {
      res.json(req.body);
    });

    async.series([
      function (next) {
        request(app)
          .get('/a')
          .query({ a: 123 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { a: 123 });
            next();
          });
      },
      function (next) {
        request(app)
          .post('/b')
          .send({ a: 456 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { a: 456 });
            next();
          });
      },
      function (next) {
        request(app)
          .put('/c')
          .send({ a: 123, b: 456 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { a: 123, b: 456 });
            next();
          });
      },
      function (next) {
        request(app)
          .delete('/d')
          .send({ a: 'abcd' })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { a: 'abcd' });
            next();
          });
      },
    ], done);

  });

  it('all', function (done) {

    const app = express();
    const router = wrapRouter(new express.Router());
    app.use(bodyParser.json());
    app.use(router);

    router.all('/test', async function (req, res) {
      res.json({ method: req.method, data: Object.assign(req.query, req.body) });
    });

    async.series([
      function (next) {
        request(app)
          .get('/test')
          .query({ a: 111, b: 222 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { method: 'GET', data: { a: 111, b: 222 }});
            next();
          });
      },
    ], done);

  });

  it('use', function (done) {

    const app = express();
    const router = wrapRouter(new express.Router());
    app.use(bodyParser.json());
    app.use(router);

    router.use(async function (req, res, next) {
      req.query.c = 789;
      next();
    });

    router.get('/test', async function (req, res, next) {
      req.query.d = 888;
      next();
    }, async function (req, res) {
      res.json({ method: req.method, data: Object.assign(req.query, req.body) });
    });

    async.series([
      function (next) {
        request(app)
          .get('/test')
          .query({ a: 111, b: 222 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { method: 'GET', data: { a: 111, b: 222, c: 789, d: 888 }});
            next();
          });
      },
    ], done);

  });

  it('param', function (done) {

    const app = express();
    const router = wrapRouter(new express.Router());
    app.use(bodyParser.json());
    app.use(router);

    router.param('id', async function (req, res, next, id) {
      req.query.id = id;
      next();
    });

    router.get('/:id', async function (req, res) {
      res.json({ method: req.method, data: Object.assign(req.query, req.body) });
    });

    async.series([
      function (next) {
        request(app)
          .get('/test')
          .query({ a: 111, b: 222 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { method: 'GET', data: { a: 111, b: 222, id: 'test' }});
            next();
          });
      },
    ], done);

  });

  it('route', function (done) {

    const app = express();
    const router = wrapRouter(new express.Router());
    app.use(router);

    router
      .route('/test')
      .get(async function (req, res) {
        res.json(req.query);
      })
      .post(bodyParser.json(), async function (req, res) {
        res.json(req.body);
      });

    async.series([
      function (next) {
        request(app)
          .get('/test')
          .query({ a: 123 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { a: 123 });
            next();
          });
      },
      function (next) {
        request(app)
          .post('/test')
          .send({ a: 456 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { a: 456 });
            next();
          });
      },
    ], done);

  });

});

describe('error', function () {

  it('throw error', function (done) {

    const app = express();
    const router = wrapRouter(new express.Router());
    app.use(router);

    router.get('/test', async function (_req, _res) {
      throw new Error('abcd');
    });

    app.use(function (err, req, res, _next) {
      res.json({ error: err.message });
    });

    async.series([
      function (next) {
        request(app)
          .get('/test')
          .query({ a: 111, b: 222 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { error: 'abcd' });
            next();
          });
      },
    ], done);

  });

  it('error handler', function (done) {

    const app = express();
    const router = wrapRouter(new express.Router());
    app.use(router);

    router.get('/test', async function (_req, _res) {
      throw new Error('abcd');
    });

    router.use(async function (err, req, res, _next) {
      res.json({ error: err.message });
    });

    async.series([
      function (next) {
        request(app)
          .get('/test')
          .query({ a: 111, b: 222 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { error: 'abcd' });
            next();
          });
      },
    ], done);

  });

  it('wrapHandler', function (done) {

    const app = express();
    const router = new express.Router();
    app.use(bodyParser.json());
    app.use(router);

    router.get('/a', wrapHandler(async function (req, res) {
      res.json(req.query);
    }));

    router.post('/b', wrapHandler(async function (req, res) {
      res.json(req.body);
    }));

    router.put('/c', wrapHandler(async function (req, res) {
      res.json(req.body);
    }));

    router.delete('/d', wrapHandler(async function (req, res) {
      res.json(req.body);
    })) ;

    async.series([
      function (next) {
        request(app)
          .get('/a')
          .query({ a: 123 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { a: 123 });
            next();
          });
      },
      function (next) {
        request(app)
          .post('/b')
          .send({ a: 456 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { a: 456 });
            next();
          });
      },
      function (next) {
        request(app)
          .put('/c')
          .send({ a: 123, b: 456 })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { a: 123, b: 456 });
            next();
          });
      },
      function (next) {
        request(app)
          .delete('/d')
          .send({ a: 'abcd' })
          .end((err, res) => {
            if (err) return next(err);
            assert.deepEqual(res.body, { a: 'abcd' });
            next();
          });
      },
    ], done);

  });

});
