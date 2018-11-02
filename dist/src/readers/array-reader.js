"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var decoding_error_1 = require("../errors/decoding/decoding-error");
var result_1 = require("../result/result");
var abstract_reader_1 = require("./abstract-reader");
var jstypes_1 = require("../jstypes");
var ArrayReader = /** @class */ (function (_super) {
    __extends(ArrayReader, _super);
    function ArrayReader(reader) {
        var _this = _super.call(this) || this;
        _this.reader = reader;
        _this.expectedType = jstypes_1.Types.Array(reader.expectedType);
        return _this;
    }
    ArrayReader.prototype.read = function (obj) {
        var _this = this;
        if (obj && typeof obj.length === 'number') {
            var array = obj;
            var results = array.map(function (v, index) { return _this.reader.read(v).mapFailure(function (e) { return ({ index: index, error: e }); }); });
            result_1.Result.all(results);
            return result_1.Result.all(results)
                .mapFailure(function (errors) { return decoding_error_1.ErrorGroup.create(obj, errors.map(function (error) { return decoding_error_1.ArrayChildError.create(error.index, error.error); })); });
        }
        var inferredType = jstypes_1.Types.infer(obj);
        var typeString = inferredType && jstypes_1.Types.toString(inferredType) || 'Unknown';
        return result_1.Result.failure(decoding_error_1.InvalidTypeError.create(obj, this.expectedType.toString(), typeString));
    };
    return ArrayReader;
}(abstract_reader_1.AbstractReader));
exports.ArrayReader = ArrayReader;
//# sourceMappingURL=array-reader.js.map