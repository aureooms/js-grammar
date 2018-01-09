'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = _nextchild;

var _error = require('../error');

var _parse2 = require('./_parse');

var _parse3 = _interopRequireDefault(_parse2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Get next child of table-driven predictive parsing.
 *
 * @param eof
 * @param productions
 * @param table
 * @param stream
 * @param expected
 * @returns {Array}
 */
function _nextchild(eof, productions, table, stream, expected) {

	var lookahead = stream.read();

	if (expected.terminal === eof) {
		if (lookahead === stream.eof) return expected;else throw new _error.ExpectedEndOfFileError(lookahead.terminal);
	}

	if (expected.type === 'leaf') {
		if (lookahead.terminal === expected.terminal) return lookahead;else throw new _error.LookaheadMismatchError(lookahead.terminal, [expected.terminal]);
	}

	stream.unread(lookahead);

	var router = table.get(expected.nonterminal);

	var next = router.get(lookahead === stream.eof ? eof : lookahead.terminal);

	if (next === undefined) throw new _error.LookaheadMismatchError(lookahead.terminal, [].concat(_toConsumableArray(router.keys())));else return (0, _parse3.default)(eof, productions, table, productions.get(expected.nonterminal).get(next), stream, expected.nonterminal, next);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sbDEvX25leHRjaGlsZC5qcyJdLCJuYW1lcyI6WyJfbmV4dGNoaWxkIiwiZW9mIiwicHJvZHVjdGlvbnMiLCJ0YWJsZSIsInN0cmVhbSIsImV4cGVjdGVkIiwibG9va2FoZWFkIiwicmVhZCIsInRlcm1pbmFsIiwidHlwZSIsInVucmVhZCIsInJvdXRlciIsImdldCIsIm5vbnRlcm1pbmFsIiwibmV4dCIsInVuZGVmaW5lZCIsImtleXMiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWF3QkEsVTs7QUFieEI7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7QUFVZSxTQUFTQSxVQUFULENBQXNCQyxHQUF0QixFQUEyQkMsV0FBM0IsRUFBeUNDLEtBQXpDLEVBQWlEQyxNQUFqRCxFQUEwREMsUUFBMUQsRUFBcUU7O0FBRW5GLEtBQU1DLFlBQVlGLE9BQU9HLElBQVAsRUFBbEI7O0FBRUEsS0FBS0YsU0FBU0csUUFBVCxLQUFzQlAsR0FBM0IsRUFBaUM7QUFDaEMsTUFBS0ssY0FBY0YsT0FBT0gsR0FBMUIsRUFBZ0MsT0FBT0ksUUFBUCxDQUFoQyxLQUNLLE1BQU0sa0NBQTRCQyxVQUFVRSxRQUF0QyxDQUFOO0FBQ0w7O0FBRUQsS0FBS0gsU0FBU0ksSUFBVCxLQUFrQixNQUF2QixFQUFnQztBQUMvQixNQUFLSCxVQUFVRSxRQUFWLEtBQXVCSCxTQUFTRyxRQUFyQyxFQUFnRCxPQUFPRixTQUFQLENBQWhELEtBQ0ssTUFBTSxrQ0FBMkJBLFVBQVVFLFFBQXJDLEVBQStDLENBQUNILFNBQVNHLFFBQVYsQ0FBL0MsQ0FBTjtBQUNMOztBQUVESixRQUFPTSxNQUFQLENBQWNKLFNBQWQ7O0FBRUEsS0FBTUssU0FBU1IsTUFBTVMsR0FBTixDQUFVUCxTQUFTUSxXQUFuQixDQUFmOztBQUVBLEtBQU1DLE9BQU9ILE9BQU9DLEdBQVAsQ0FBV04sY0FBY0YsT0FBT0gsR0FBckIsR0FBMkJBLEdBQTNCLEdBQWlDSyxVQUFVRSxRQUF0RCxDQUFiOztBQUVBLEtBQUtNLFNBQVNDLFNBQWQsRUFBMEIsTUFBTSxrQ0FBMkJULFVBQVVFLFFBQXJDLCtCQUFtREcsT0FBT0ssSUFBUCxFQUFuRCxHQUFOLENBQTFCLEtBRUssT0FBTyxxQkFBT2YsR0FBUCxFQUFZQyxXQUFaLEVBQXlCQyxLQUF6QixFQUFnQ0QsWUFBWVUsR0FBWixDQUFnQlAsU0FBU1EsV0FBekIsRUFBc0NELEdBQXRDLENBQTBDRSxJQUExQyxDQUFoQyxFQUFpRlYsTUFBakYsRUFBMEZDLFNBQVNRLFdBQW5HLEVBQWlIQyxJQUFqSCxDQUFQO0FBRUwiLCJmaWxlIjoiX25leHRjaGlsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvb2thaGVhZE1pc21hdGNoRXJyb3IgLCBFeHBlY3RlZEVuZE9mRmlsZUVycm9yIH0gZnJvbSAnLi4vZXJyb3InIDtcbmltcG9ydCBfcGFyc2UgZnJvbSAnLi9fcGFyc2UnIDtcblxuLyoqXG4gKiBHZXQgbmV4dCBjaGlsZCBvZiB0YWJsZS1kcml2ZW4gcHJlZGljdGl2ZSBwYXJzaW5nLlxuICpcbiAqIEBwYXJhbSBlb2ZcbiAqIEBwYXJhbSBwcm9kdWN0aW9uc1xuICogQHBhcmFtIHRhYmxlXG4gKiBAcGFyYW0gc3RyZWFtXG4gKiBAcGFyYW0gZXhwZWN0ZWRcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX25leHRjaGlsZCAoIGVvZiwgcHJvZHVjdGlvbnMgLCB0YWJsZSAsIHN0cmVhbSAsIGV4cGVjdGVkICkge1xuXG5cdGNvbnN0IGxvb2thaGVhZCA9IHN0cmVhbS5yZWFkKCApIDtcblxuXHRpZiAoIGV4cGVjdGVkLnRlcm1pbmFsID09PSBlb2YgKSB7XG5cdFx0aWYgKCBsb29rYWhlYWQgPT09IHN0cmVhbS5lb2YgKSByZXR1cm4gZXhwZWN0ZWQgO1xuXHRcdGVsc2UgdGhyb3cgbmV3IEV4cGVjdGVkRW5kT2ZGaWxlRXJyb3IoIGxvb2thaGVhZC50ZXJtaW5hbCApIDtcblx0fVxuXG5cdGlmICggZXhwZWN0ZWQudHlwZSA9PT0gJ2xlYWYnICkge1xuXHRcdGlmICggbG9va2FoZWFkLnRlcm1pbmFsID09PSBleHBlY3RlZC50ZXJtaW5hbCApIHJldHVybiBsb29rYWhlYWQgO1xuXHRcdGVsc2UgdGhyb3cgbmV3IExvb2thaGVhZE1pc21hdGNoRXJyb3IobG9va2FoZWFkLnRlcm1pbmFsLCBbZXhwZWN0ZWQudGVybWluYWxdKSA7XG5cdH1cblxuXHRzdHJlYW0udW5yZWFkKGxvb2thaGVhZCk7XG5cblx0Y29uc3Qgcm91dGVyID0gdGFibGUuZ2V0KGV4cGVjdGVkLm5vbnRlcm1pbmFsKTtcblxuXHRjb25zdCBuZXh0ID0gcm91dGVyLmdldChsb29rYWhlYWQgPT09IHN0cmVhbS5lb2YgPyBlb2YgOiBsb29rYWhlYWQudGVybWluYWwpIDtcblxuXHRpZiAoIG5leHQgPT09IHVuZGVmaW5lZCApIHRocm93IG5ldyBMb29rYWhlYWRNaXNtYXRjaEVycm9yKGxvb2thaGVhZC50ZXJtaW5hbCwgWy4uLnJvdXRlci5rZXlzKCldKSA7XG5cblx0ZWxzZSByZXR1cm4gX3BhcnNlKGVvZiwgcHJvZHVjdGlvbnMsIHRhYmxlLCBwcm9kdWN0aW9ucy5nZXQoZXhwZWN0ZWQubm9udGVybWluYWwpLmdldChuZXh0KSwgc3RyZWFtICwgZXhwZWN0ZWQubm9udGVybWluYWwgLCBuZXh0KTtcblxufVxuIl19