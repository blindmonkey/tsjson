"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decoding_error_1 = require("errors/decoding/decoding-error");
var result_1 = require("result/result");
var jstypes_1 = require("../jstypes");
var MapReader = /** @class */ (function () {
    function MapReader(valueReader) {
        this.valueReader = valueReader;
        this.expectedType = jstypes_1.Types.Map(valueReader.expectedType);
    }
    MapReader.prototype.read = function (obj) {
        if (typeof obj === 'object') {
            var decoded = {};
            for (var key in obj) {
                if (Object.hasOwnProperty.call(obj, key)) {
                    var value = obj[key];
                    var decodedValue = this.valueReader.read(value);
                    if (decodedValue.isSuccess()) {
                        decoded[key] = decodedValue.value;
                    }
                    else {
                        var typeString = '{' + jstypes_1.quote(key) + ': Unknown}';
                        var objSpec = {};
                        var inferredType_1 = jstypes_1.Types.infer(value);
                        if (inferredType_1 != null) {
                            objSpec[key] = inferredType_1;
                            typeString = jstypes_1.Types.toString(jstypes_1.Types.Object(objSpec));
                        }
                        return result_1.Result.failure(decoding_error_1.InvalidTypeError.create(obj, jstypes_1.Types.toString(this.expectedType), typeString, decodedValue.isFailure() ? decodedValue.error : undefined));
                    }
                }
            }
            return result_1.Result.success(decoded);
        }
        var inferredType = jstypes_1.Types.infer(obj);
        return result_1.Result.failure(decoding_error_1.InvalidTypeError.create(obj, jstypes_1.Types.toString(this.expectedType), inferredType && jstypes_1.Types.toString(inferredType) || 'Unknown'));
    };
    return MapReader;
}());
exports.MapReader = MapReader;
//# sourceMappingURL=map-reader.js.map