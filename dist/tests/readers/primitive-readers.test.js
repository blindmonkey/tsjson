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
describe('NumberReader', function () {
    var reader = new primitive_readers_1.PrimitiveReaders.NumberReader();
    it('should read numbers', function () {
        var result = reader.read(Math.PI);
        if (result.isSuccess()) {
            chai_1.expect(result.value).to.be.equal(Math.PI);
        }
        else {
            chai.assert(false);
        }
    });
    it('should fail for strings', function () {
        var value = '3.14159';
        var result = reader.read(value);
        if (result.isFailure()) {
            chai_1.expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'Number', 'String'));
        }
        else {
            chai.assert(false);
        }
    });
    it('should fail for booleans', function () {
        var value = false;
        var result = reader.read(value);
        if (result.isFailure()) {
            chai_1.expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'Number', 'Boolean'));
        }
        else {
            chai.assert(false);
        }
    });
    it('should fail for arrays', function () {
        var value = [1, 2, 3];
        var result = reader.read(value);
        if (result.isFailure()) {
            chai_1.expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'Number', 'Array<Number>'));
        }
        else {
            chai.assert(false);
        }
    });
    it('should fail for objects', function () {
        var value = {};
        var result = reader.read(value);
        if (result.isFailure()) {
            chai_1.expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'Number', 'Object'));
        }
        else {
            chai.assert(false);
        }
    });
});
//# sourceMappingURL=primitive-readers.test.js.map