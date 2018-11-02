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
var abstract_reader_1 = require("./abstract-reader");
var jstypes_1 = require("../jstypes");
var result_1 = require("../result/result");
var AnyReader = /** @class */ (function (_super) {
    __extends(AnyReader, _super);
    function AnyReader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.expectedType = jstypes_1.Types.Any;
        return _this;
    }
    AnyReader.prototype.read = function (obj) {
        return result_1.Result.success(obj);
    };
    return AnyReader;
}(abstract_reader_1.AbstractReader));
exports.AnyReader = AnyReader;
//# sourceMappingURL=any-reader.js.map