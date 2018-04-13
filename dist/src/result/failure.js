"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResultFailureImpl = /** @class */ (function () {
    function ResultFailureImpl(error) {
        this.type = 'failure';
        this.error = error;
    }
    ResultFailureImpl.prototype.isSuccess = function () { return false; };
    ResultFailureImpl.prototype.isFailure = function () { return true; };
    ResultFailureImpl.prototype.assertSuccess = function () { throw Error('Result is not a Success result.'); };
    ResultFailureImpl.prototype.assertFailure = function () { return this.error; };
    ResultFailureImpl.prototype.map = function (success, failure) {
        return failure(this.error);
    };
    ResultFailureImpl.prototype.flatMap = function (success, failure) {
        return failure(this.error);
    };
    ResultFailureImpl.prototype.mapSuccess = function (f) {
        return new ResultFailureImpl(this.error);
    };
    ResultFailureImpl.prototype.mapFailure = function (f) {
        return new ResultFailureImpl(f(this.error));
    };
    return ResultFailureImpl;
}());
exports.ResultFailureImpl = ResultFailureImpl;
//# sourceMappingURL=failure.js.map