'use strict';

var express = require('express');
var controller = require('./business.controller');

var router = express.Router();

/**
* GET
*/
router.get('/', controller.index);
router.get('/:id', controller.showByIdReq);

/**
* POST
*/
router.post('/', controller.createReq);

/**
* PUT/PATCH
*/
router.put('/:id', controller.updateReqById);
router.patch('/:id', controller.updateReqById);

/**
* DELETE
*/
router.delete('/:id', controller.destroyReqById);

module.exports = router;