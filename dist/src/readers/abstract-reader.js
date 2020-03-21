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
var jstypes_1 = require("../jstypes");
var AbstractReader = /** @class */ (function () {
    function AbstractReader() {
    }
    AbstractReader.prototype.withDefault = function (value) {
        return new DefaultReader(this, value);
    };
    AbstractReader.prototype.asOptional = function () {
        return new OptionalReader(this);
    };
    AbstractReader.prototype.or = function (other) {
        return new OrReader(this, other);
    };
    AbstractReader.prototype.map = function (mapfn) {
        return new MappingReader(this, mapfn);
    };
    return AbstractReader;
}());
exports.AbstractReader = AbstractReader;
var DefaultReader = /** @class */ (function (_super) {
    __extends(DefaultReader, _super);
    function DefaultReader(reader, defaultValue) {
        var _this = _super.call(this) || this;
        _this.reader = reader;
        _this.default = defaultValue;
        _this.expectedType = reader.expectedType;
        return _this;
    }
    DefaultReader.prototype.read = function (obj) {
        var _this = this;
        return result_1.Result.success(this.reader.read(obj)
            .map(function (success) { return success; }, function () { return _this.default; }));
    };
    return DefaultReader;
}(AbstractReader));
exports.DefaultReader = DefaultReader;
function inferOrUnknown(obj) {
    var inferred = jstypes_1.Types.infer(obj);
    if (inferred != null) {
        return jstypes_1.Types.toString(inferred);
    }
    return 'Unknown';
}
var OrReader = /** @class */ (function (_super) {
    __extends(OrReader, _super);
    function OrReader(readerA, readerB) {
        var _this = _super.call(this) || this;
        _this.readerA = readerA;
        _this.readerB = readerB;
        _this.expectedType = jstypes_1.Types.Union([readerA.expectedType, readerB.expectedType]);
        return _this;
    }
    OrReader.prototype.read = function (obj) {
        var _this = this;
        return this.readerA.read(obj).map(function (success) { return result_1.Result.success(success); }, function (failure) { return _this.readerB.read(obj)
            .mapFailure(function (error) { return decoding_error_1.InvalidTypeError.create(obj, jstypes_1.Types.toString(_this.expectedType), inferOrUnknown(obj), decoding_error_1.ErrorGroup.create(obj, [failure, error])); }); });
    };
    return OrReader;
}(AbstractReader));
exports.OrReader = OrReader;
var OptionalReader = /** @class */ (function (_super) {
    __extends(OptionalReader, _super);
    function OptionalReader(reader) {
        var _this = _super.call(this, reader, null) || this;
        _this.expectedType = jstypes_1.Types.Nullable(reader.expectedType);
        return _this;
    }
    return OptionalReader;
}(DefaultReader));
exports.OptionalReader = OptionalReader;
var MappingReader = /** @class */ (function (_super) {
    __extends(MappingReader, _super);
    function MappingReader(reader, mapfn) {
        var _this = _super.call(this) || this;
        _this.reader = reader;
        _this.mapfn = mapfn;
        _this.expectedType = reader.expectedType;
        return _this;
    }
    MappingReader.prototype.read = function (obj) {
        return this.reader.read(obj).mapSuccess(this.mapfn);
    };
    return MappingReader;
}(AbstractReader));
exports.MappingReader = MappingReader;
//# sourceMappingURL=abstract-reader.js.map