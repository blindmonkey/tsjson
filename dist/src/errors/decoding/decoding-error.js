"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayChildError;
(function (ArrayChildError) {
    function create(index, error) {
        return {
            type: 'array-error',
            index: index,
            error: error
        };
    }
    ArrayChildError.create = create;
})(ArrayChildError = exports.ArrayChildError || (exports.ArrayChildError = {}));
var ErrorGroup;
(function (ErrorGroup) {
    function create(value, errors) {
        return {
            type: 'error-group',
            value: value,
            errors: errors
        };
    }
    ErrorGroup.create = create;
})(ErrorGroup = exports.ErrorGroup || (exports.ErrorGroup = {}));
var InconsistentTypesError;
(function (InconsistentTypesError) {
    function create(value, found) {
        return {
            type: 'inconsistent-types',
            value: value,
            found: found
        };
    }
    InconsistentTypesError.create = create;
})(InconsistentTypesError = exports.InconsistentTypesError || (exports.InconsistentTypesError = {}));
var InvalidTypeError;
(function (InvalidTypeError) {
    function create(value, expected, actual, forwarded) {
        return {
            type: 'invalid-type',
            expected: expected,
            actual: actual,
            value: value,
            error: forwarded || null
        };
    }
    InvalidTypeError.create = create;
})(InvalidTypeError = exports.InvalidTypeError || (exports.InvalidTypeError = {}));
//# sourceMappingURL=decoding-error.js.map