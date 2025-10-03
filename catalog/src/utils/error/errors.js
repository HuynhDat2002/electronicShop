"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = exports.ForbiddenError = exports.AuthorizeError = exports.ValidationError = exports.APIError = void 0;
var statusCodes_1 = require("./statusCodes");
var BaseError = /** @class */ (function (_super) {
    __extends(BaseError, _super);
    function BaseError(name, status, description) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, description) || this;
        _this.name = name;
        _this.status = status;
        _this.message = description;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        Error.captureStackTrace(_this);
        return _this;
    }
    return BaseError;
}(Error));
//500 internal error
var APIError = /** @class */ (function (_super) {
    __extends(APIError, _super);
    function APIError(description) {
        if (description === void 0) { description = "api error"; }
        return _super.call(this, 'api internal server error', statusCodes_1.Status_Codes.INTERNAL_SERVER_ERROR, description) || this;
    }
    return APIError;
}(BaseError));
exports.APIError = APIError;
//400 validation error
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(description) {
        if (description === void 0) { description = "bad request"; }
        return _super.call(this, 'bad request', statusCodes_1.Status_Codes.BAD_REQUEST, description) || this;
    }
    return ValidationError;
}(BaseError));
exports.ValidationError = ValidationError;
//401 authorize error
var AuthorizeError = /** @class */ (function (_super) {
    __extends(AuthorizeError, _super);
    function AuthorizeError(description) {
        if (description === void 0) { description = "access denied"; }
        return _super.call(this, 'access denied', statusCodes_1.Status_Codes.UNAUTHORIZED, description) || this;
    }
    return AuthorizeError;
}(BaseError));
exports.AuthorizeError = AuthorizeError;
//403 forbidden error
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(description) {
        if (description === void 0) { description = "forbidden error"; }
        return _super.call(this, 'forbidden error', statusCodes_1.Status_Codes.FORBIDDEN, description) || this;
    }
    return ForbiddenError;
}(BaseError));
exports.ForbiddenError = ForbiddenError;
//404 notfound error
var NotFound = /** @class */ (function (_super) {
    __extends(NotFound, _super);
    function NotFound(description) {
        if (description === void 0) { description = "not found"; }
        return _super.call(this, 'not found', statusCodes_1.Status_Codes.NOT_FOUND, description) || this;
    }
    return NotFound;
}(BaseError));
exports.NotFound = NotFound;
