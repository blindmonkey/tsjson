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
var jstypes_1 = require("jstypes");
var primitiveTypes = [jstypes_1.Types.Boolean, jstypes_1.Types.Null, jstypes_1.Types.String, jstypes_1.Types.StringValue('hello'), jstypes_1.Types.Number];
var expect = chai.expect;
describe('Nullable', function () {
    it('should construct primitives', function () {
        primitiveTypes.forEach(function (type) {
            var constructed = jstypes_1.Types.Nullable(type);
            if (jstypes_1.Types.isNull(type)) {
                expect(constructed).to.be.deep.equal({ type: 'null' });
            }
            else {
                expect(constructed).to.be.deep.equal({ type: 'nullable', subtype: type });
            }
        });
    });
    it('should coalesce nullables', function () {
        primitiveTypes.forEach(function (type) {
            var constructed = type;
            for (var i = 0; i < 100000; i++) {
                constructed = { type: 'nullable', subtype: constructed };
            }
            var constructedNullable = jstypes_1.Types.Nullable(constructed);
            if (jstypes_1.Types.isNull(type)) {
                expect(constructedNullable).to.be.deep.equal({ type: 'null' });
            }
            else {
                expect(constructedNullable).to.be.deep.equal({ type: 'nullable', subtype: type });
            }
        });
    });
});
describe('equals', function () {
    it('should compare primitives', function () {
        for (var i = 0; i < primitiveTypes.length; i++) {
            for (var j = 0; j < primitiveTypes.length; j++) {
                if (i === j) {
                    expect(jstypes_1.Types.equals(primitiveTypes[i], primitiveTypes[j])).to.be.true;
                }
                else {
                    expect(jstypes_1.Types.equals(primitiveTypes[i], primitiveTypes[j])).to.be.false;
                }
            }
        }
    });
});
//# sourceMappingURL=jstypes.test.js.map