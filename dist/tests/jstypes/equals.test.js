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
var expect = chai.expect;
describe('toString', function () {
    function createRecursiveType(innerType) {
        var spec = {
            'x': innerType
        };
        var obj = jstypes_1.Types.Object(spec);
        spec['obj'] = jstypes_1.Types.Nullable(obj);
        var top = jstypes_1.Types.Object({ 'test1': obj, 'test2': obj });
        top.spec && (top.spec['obj'] = top);
        return top;
    }
    it('should safely compare recursive types', function () {
        var a = createRecursiveType(jstypes_1.Types.String);
        var b = createRecursiveType(jstypes_1.Types.String);
        var c = createRecursiveType(jstypes_1.Types.Number);
        expect(jstypes_1.Types.equals(a, b)).to.be.true;
        expect(jstypes_1.Types.equals(a, c)).to.be.false;
    });
});
//# sourceMappingURL=equals.test.js.map