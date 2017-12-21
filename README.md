# express-router-async-support

[![Greenkeeper badge](https://badges.greenkeeper.io/leizongmin/express-router-async-support.svg)](https://greenkeeper.io/)
async function support for express.Router


## Installation

```bash
$ npm install express-router-async-support --save
```


## Usage

```javascript
'use strict';

const express = require('express');
const wrapRouter = require('express-router-async-support').wrapRouter;
const wrapHandler = require('express-router-async-support').wrapHandler;

const app = express();
// create router instance, use wrapRouter() to support async function
const router = wrapRouter(new express.Router());
app.use(router);

// async function
router.get('/', async function (req, res, next) {
  throw new Error('just for test');
});
// if you visit path "/", it will throws an error,
// express-router-async-support will catch this error
// and pass it to next middleware

// or you can just use wrapHandler() to wrao a single async function
app.use(wrapHandler(async function (req, res, next) {
  throw new Error('just for test');
}));
```


## License

```
MIT License

Copyright (c) 2016-2017 Zongmin Lei <leizongmin@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
