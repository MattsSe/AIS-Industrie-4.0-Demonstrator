"use strict";
exports.__esModule = true;
var status = require("http-status");
var ApiRoute = (function () {
    function ApiRoute() {
    }
    ApiRoute.create = function (router) {
        // add home page route
        router.get('/api', function (req, res, next) {
            new ApiRoute().index(req, res, next);
        });
    };
    ApiRoute.prototype.index = function (req, res, next) {
        console.log('api dummy called');
        res.status(status.OK).send({
            message: 'dummy message'
        });
    };
    return ApiRoute;
}());
exports.ApiRoute = ApiRoute;
