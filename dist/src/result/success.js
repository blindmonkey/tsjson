"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResultSuccessImpl = /** @class */ (function () {
    function ResultSuccessImpl(value) {
        this.type = 'success';
        this.value = value;
    }
    ResultSuccessImpl.prototype.isSuccess = function () { return true; };
    ResultSuccessImpl.prototype.isFailure = function () { return false; };
    ResultSuccessImpl.prototype.assertSuccess = function () { return this.value; };
    ResultSuccessImpl.prototype.assertFailure = function () { throw Error('Result is not a Failure result.'); };
    ResultSuccessImpl.prototype.map = function (success, failure) {
        return success(this.value);
    };
    ResultSuccessImpl.prototype.flatMap = function (success, failure) {
        return success(this.value);
    };
    ResultSuccessImpl.prototype.mapSuccess = function (f) {
        return new ResultSuccessImpl(f(this.value));
    };
    ResultSuccessImpl.prototype.mapFailure = function (f) {
        return new ResultSuccessImpl(this.value);
    };
    return ResultSuccessImpl;
}());
exports.ResultSuccessImpl = ResultSuccessImpl;
//# sourceMappingURL=success.js.map