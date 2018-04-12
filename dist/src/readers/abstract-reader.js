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
var result_1 = require("result/result");
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
//# sourceMappingURL=abstract-reader.js.map