"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = exports.logger = void 0;
var pino_http_1 = require("pino-http");
var pino_1 = require("pino");
exports.logger = (0, pino_1.default)({
    level: 'info',
    base: {
        serviceName: "catalog-service",
    },
    serializers: pino_1.default.stdSerializers,
    timestamp: function () { return ",\"time\":\"".concat(new Date(Date.now()).toISOString(), "\""); },
    transport: {
        target: "pino-pretty",
        level: "error",
    },
});
exports.httpLogger = (0, pino_http_1.pinoHttp)({
    level: "error",
    logger: exports.logger,
});
