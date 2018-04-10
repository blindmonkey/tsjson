"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var success_1 = require("./success");
var failure_1 = require("./failure");
var unreachable_1 = require("../unreachable");
var Result;
(function (Result) {
    function success(value) {
        return new success_1.ResultSuccessImpl(value);
    }
    Result.success = success;
    function failure(value) {
        return new failure_1.ResultFailureImpl(value);
    }
    Result.failure = failure;
    function all(results) {
        var successes = [];
        var failures = [];
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            if (result.isSuccess()) {
                successes.push(result);
            }
            else if (result.isFailure()) {
                failures.push(result);
            }
            else {
                /* istanbul ignore next */
                return unreachable_1.unreachable("A result must either be a success or a failure.");
            }
        }
        if (failures.length > 0) {
            return Result.failure(failures.map(function (f) { return f.error; }));
        }
        return Result.success(successes.map(function (f) { return f.value; }));
    }
    Result.all = all;
})(Result = exports.Result || (exports.Result = {}));
//# sourceMappingURL=result.js.map