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
    it('should safely stringify recursive types', function () {
        var spec = {
            'x': jstypes_1.Types.Number
        };
        var obj = jstypes_1.Types.Object(spec);
        spec['obj'] = jstypes_1.Types.Nullable(obj);
        var top = jstypes_1.Types.Object({ 'a': jstypes_1.Types.Object({ 'x': jstypes_1.Types.String }), 'test1': obj, 'test2': obj });
        top.spec && (top.spec['obj'] = top);
        var expectedObjString = "{'obj': Nullable<{$1}>, 'x': Number}";
        expect(jstypes_1.Types.toString(top)).to.be.equal('{\'a\': {\'x\': String}, \'obj\': {$0}, \'test1\': ' + expectedObjString + ', \'test2\': ' + expectedObjString + '}');
    });
});
//# sourceMappingURL=tostring.test.js.map