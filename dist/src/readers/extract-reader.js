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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors = __importStar(require("../errors/decoding/decoding-error"));
var abstract_reader_1 = require("./abstract-reader");
var jstypes_1 = require("../jstypes");
var ExtractReader = /** @class */ (function (_super) {
    __extends(ExtractReader, _super);
    function ExtractReader(property, reader) {
        var _this = _super.call(this) || this;
        _this.property = property;
        _this.reader = reader;
        var obj = {};
        obj[property] = reader.expectedType;
        console.log('Extract', property, 'of type', reader.expectedType);
        _this.expectedType = jstypes_1.Types.Object(obj);
        console.log('Computed expected type is', _this.expectedType);
        return _this;
    }
    ExtractReader.prototype.read = function (obj) {
        var _this = this;
        if (obj && Object.hasOwnProperty.call(obj, this.property)) {
            return this.reader.read(obj[this.property]);
        }
        else {
            return this.reader.read(null).mapFailure(function () {
                var inferred = jstypes_1.Types.infer(obj);
                var typeString = inferred && jstypes_1.Types.toString(inferred) || 'Unknown';
                return errors.InvalidTypeError.create(obj, jstypes_1.Types.toString(_this.expectedType), typeString);
            });
        }
    };
    return ExtractReader;
}(abstract_reader_1.AbstractReader));
exports.ExtractReader = ExtractReader;
//# sourceMappingURL=extract-reader.js.map