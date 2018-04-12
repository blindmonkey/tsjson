"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unreachable(message) {
    var msg = 'FATAL ERROR (UNREACHABLE)' + (message && (': ' + message) || '');
    throw Error(msg);
}
exports.unreachable = unreachable;
//# sourceMappingURL=unreachable.js.map