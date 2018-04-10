"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as mocha from "mocha";
var chai = __importStar(require("chai"));
var result_1 = require("result/result");
function identity(x) { return x; }
function constant(x) { return function () { return x; }; }
var SuccessfulValue = Math.PI;
var FailureValue = Math.E;
var expect = chai.expect;
describe('Result.success', function () {
    function makeTestModel() {
        return result_1.Result.success(SuccessfulValue);
    }
    ;
    it('should construct correctly', function () {
        var r = makeTestModel();
        expect(r.isSuccess()).to.be.true;
        expect(r.isFailure()).to.be.false;
        expect(r.map(identity, identity)).to.be.equal(SuccessfulValue);
    });
    it('should flatMap', function () {
        var r = makeTestModel();
        var result = r.flatMap(constant(result_1.Result.success(true)), constant(result_1.Result.failure(false)));
        if (result.isSuccess()) {
            expect(result.value).to.be.true;
        }
        else {
            chai.assert(false);
        }
    });
    it('should mapSuccess', function () {
        var r = makeTestModel();
        var result = r.mapSuccess(function (x) { return x * 2; });
        expect(result.isSuccess()).to.be.true;
        expect(result.isFailure()).to.be.false;
        if (result.isSuccess()) {
            expect(result.value).to.be.equal(SuccessfulValue * 2);
        }
        else {
            chai.assert(false);
        }
    });
    it('should not mapFailure', function () {
        var r = makeTestModel();
        var result = r.mapFailure(function (x) { return x + x; });
        expect(result.isSuccess()).to.be.true;
        expect(result.isFailure()).to.be.false;
        if (result.isSuccess()) {
            expect(result.value).to.be.equal(SuccessfulValue);
        }
        else {
            chai.assert(false);
        }
    });
});
describe('Result.failure', function () {
    function makeTestModel() {
        return result_1.Result.failure(FailureValue);
    }
    it('should construct correctly', function () {
        var r = makeTestModel();
        expect(r.isSuccess()).to.be.false;
        expect(r.isFailure()).to.be.true;
        expect(r.map(identity, identity)).to.be.equal(FailureValue);
    });
    it('should flatMap', function () {
        var r = makeTestModel();
        var result = r.flatMap(constant(result_1.Result.success(true)), constant(result_1.Result.failure(false)));
        if (result.isFailure()) {
            expect(result.error).to.be.false;
        }
        else {
            chai.assert(false);
        }
    });
    it('should not mapSuccess', function () {
        var r = makeTestModel();
        var result = r.mapSuccess(identity);
        expect(result.isFailure()).to.be.true;
        if (result.isFailure()) {
            expect(result.error).to.be.equal(FailureValue);
        }
        else {
            chai.assert(false);
        }
    });
    it('should mapFailure', function () {
        var r = makeTestModel();
        var result = r.mapFailure(function (x) { return x * 2; });
        expect(result.isFailure()).to.be.true;
        if (result.isFailure()) {
            expect(result.error).to.be.equal(FailureValue * 2);
        }
        else {
            chai.assert(false);
        }
    });
});
describe('Result.all', function () {
    it('should be successful when all are successful', function () {
        var results = [
            result_1.Result.success(true),
            result_1.Result.success(false),
            result_1.Result.success(true)
        ];
        var result = result_1.Result.all(results);
        expect(result.isSuccess()).to.be.true;
        expect(result.isFailure()).to.be.false;
        if (result.isSuccess()) {
            expect(result.value).to.be.deep.equal([true, false, true]);
        }
        else {
            chai.assert(false);
        }
    });
    it('should fail when even one fails', function () {
        var results = [
            result_1.Result.success(true),
            result_1.Result.failure('no'),
            result_1.Result.success(true)
        ];
        var result = result_1.Result.all(results);
        expect(result.isSuccess()).to.be.false;
        expect(result.isFailure()).to.be.true;
        if (result.isFailure()) {
            expect(result.error).to.be.deep.equal(['no']);
        }
        else {
            chai.assert(false);
        }
    });
});
//# sourceMappingURL=result.test.js.map