"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as mocha from 'mocha';
var chai = __importStar(require("chai"));
var chai_1 = require("chai");
var primitive_readers_1 = require("readers/primitive-readers");
var errors = __importStar(require("errors/decoding/decoding-error"));
describe('StringReader', function () {
    var reader = new primitive_readers_1.PrimitiveReaders.StringReader();
    it('should not read numbers', function () {
        var result = reader.read(Math.PI);
        if (result.isFailure()) {
            chai_1.expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(Math.PI, 'String', 'Number'));
        }
        else {
            chai.assert(false);
        }
    });
    it('should read strings', function () {
        var value = '3.14159';
        var result = reader.read(value);
        if (result.isSuccess()) {
            chai_1.expect(result.value).to.be.equal(value);
        }
        else {
            chai.assert(false);
        }
    });
    it('should fail for booleans', function () {
        var value = false;
        var result = reader.read(value);
        if (result.isFailure()) {
            chai_1.expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'String', 'Boolean'));
        }
        else {
            chai.assert(false);
        }
    });
    it('should fail for arrays', function () {
        var value = [1, 2, 3];
        var result = reader.read(value);
        if (result.isFailure()) {
            chai_1.expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'String', 'Array<Number>'));
        }
        else {
            chai.assert(false);
        }
    });
    it('should fail for objects', function () {
        var value = {};
        var result = reader.read(value);
        if (result.isFailure()) {
            chai_1.expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'String', 'Object'));
        }
        else {
            chai.assert(false);
        }
    });
});
//# sourceMappingURL=string-reader.test.js.map