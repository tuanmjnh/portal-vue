// Returns if a value is a string
function isString(value) {
    return typeof value === 'string' || value instanceof String;
}
// Returns if a value is really a number
function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}
// Returns if a value is an array
function isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
}
// ES5 actually has a method for this (ie9+)
// Array.isArray(value);
// Returns if a value is a function
function isFunction(value) {
    return typeof value === 'function';
}
// Returns if a value is an object
function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
}
// Returns if a value is null
function isNull(value) {
    return value === null;
}
// Returns if a value is undefined
function isUndefined(value) {
    return typeof value === 'undefined';
}
// Returns if a value is a boolean
function isBoolean(value) {
    return typeof value === 'boolean';
}
// Returns if a value is a regexp
function isRegExp(value) {
    return value && typeof value === 'object' && value.constructor === RegExp;
}
// Returns if value is an error object
function isError(value) {
    return value instanceof Error && typeof value.message !== 'undefined';
}
// Returns if value is a date object
function isDate(value) {
    return value instanceof Date;
}
// Returns if a Symbol
function isSymbol(value) {
    return typeof value === 'symbol';
}