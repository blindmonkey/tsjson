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
var PrimitiveReaders;
(function (PrimitiveReaders) {
    var BooleanReader = /** @class */ (function (_super) {
        __extends(BooleanReader, _super);
        function BooleanReader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.expectedType = jstypes_1.Types.Boolean;
            return _this;
        }
        BooleanReader.prototype.read = function (obj) {
            if (typeof obj === 'boolean') {
                return result_1.Result.success(obj);
            }
            var inferred = jstypes_1.Types.infer(obj);
            var typeString = inferred && jstypes_1.Types.toString(inferred) || 'Unknown';
            return result_1.Result.failure(decoding_error_1.InvalidTypeError.create(obj, jstypes_1.Types.toString(this.expectedType), typeString));
        };
        return BooleanReader;
    }(abstract_reader_1.AbstractReader));
    PrimitiveReaders.BooleanReader = BooleanReader;
    var StringReader = /** @class */ (function (_super) {
        __extends(StringReader, _super);
        function StringReader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.expectedType = jstypes_1.Types.String;
            return _this;
        }
        StringReader.prototype.read = function (obj) {
            if (typeof obj === 'string') {
                return result_1.Result.success(obj);
            }
            var inferred = jstypes_1.Types.infer(obj);
            var typeString = inferred && jstypes_1.Types.toString(inferred) || 'Unknown';
            return result_1.Result.failure(decoding_error_1.InvalidTypeError.create(obj, jstypes_1.Types.toString(this.expectedType), typeString));
        };
        return StringReader;
    }(abstract_reader_1.AbstractReader));
    PrimitiveReaders.StringReader = StringReader;
    var NumberReader = /** @class */ (function (_super) {
        __extends(NumberReader, _super);
        function NumberReader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.expectedType = jstypes_1.Types.Number;
            return _this;
        }
        NumberReader.prototype.read = function (obj) {
            if (typeof obj === 'number') {
                return result_1.Result.success(obj);
            }
            var inferred = jstypes_1.Types.infer(obj);
            var typeString = inferred && jstypes_1.Types.toString(inferred) || 'Unknown';
            return result_1.Result.failure(decoding_error_1.InvalidTypeError.create(obj, jstypes_1.Types.toString(this.expectedType), typeString));
        };
        return NumberReader;
    }(abstract_reader_1.AbstractReader));
    PrimitiveReaders.NumberReader = NumberReader;
})(PrimitiveReaders = exports.PrimitiveReaders || (exports.PrimitiveReaders = {}));
//# sourceMappingURL=primitive-readers.js.map