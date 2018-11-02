"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unreachable(a) {
    return a;
}
function ObjectKeys(obj) {
    return Object.keys(obj);
}
var Sets;
(function (Sets) {
    function create(array) {
        var set = new SetImpl();
        array.forEach(function (v) { return set.add(v); });
        return set;
    }
    Sets.create = create;
})(Sets || (Sets = {}));
var SetImpl = /** @class */ (function () {
    function SetImpl() {
        this.items = [];
        this.index = {};
    }
    SetImpl.create = function (array) {
        var set = new SetImpl();
        array.forEach(function (v) { return set.add(v); });
        return set;
    };
    SetImpl.prototype.size = function () {
        return this.items.length;
    };
    SetImpl.prototype.toArray = function () {
        return this.items.concat([]);
    };
    SetImpl.prototype.copy = function () {
        return Sets.create(this.items);
    };
    SetImpl.prototype.forEach = function (f) {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (!f(item)) {
                return;
            }
        }
    };
    SetImpl.prototype.equals = function (other) {
        return other.size() == this.size() && this.items.every(function (item) { return other.contains(item); });
    };
    SetImpl.prototype.all = function (f) {
        var items = this.items;
        var length = items.length;
        for (var i = 0; i < length; i++) {
            var item = items[i];
            if (!f(item)) {
                return false;
            }
        }
        return true;
    };
    SetImpl.prototype.map = function (f) {
        var output = new SetImpl();
        this.items.forEach(function (item) { return output.add(f(item)); });
        return output;
    };
    SetImpl.prototype.contains = function (value) {
        var hash = value.toString();
        return this.containsHash(hash);
    };
    SetImpl.prototype.add = function (value) {
        var hash = value.toString();
        if (!this.containsHash(hash)) {
            this.index[hash] = { index: this.items.length, value: value };
            this.items.push(value);
            return true;
        }
        return false;
    };
    SetImpl.prototype.remove = function (value) {
        var valueHash = value.toString();
        var existingItem = this.index[valueHash];
        if (existingItem == null) {
            return false;
        }
        delete this.index[valueHash];
        for (var i = existingItem.index + 1; i < this.items.length; i++) {
            this.index[this.items[i].toString()].index--;
        }
        this.items.splice(existingItem.index, 1);
        return true;
    };
    SetImpl.prototype.union = function (other) {
        var output = new SetImpl();
        this.forEach(function (item) { return output.add(item); });
        other.forEach(function (item) { return output.add(item); });
        return output;
    };
    SetImpl.prototype.intersection = function (other) {
        var output = new SetImpl();
        this.forEach(function (item) {
            if (other.contains(item)) {
                output.add(item);
            }
            return true;
        });
        return output;
    };
    SetImpl.prototype.subtract = function (other) {
        var output = new SetImpl();
        this.forEach(function (item) {
            if (!other.contains(item)) {
                output.add(item);
            }
            return true;
        });
        return output;
    };
    SetImpl.prototype.isSubsetOf = function (other) {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (!other.contains(item)) {
                return false;
            }
        }
        return true;
    };
    SetImpl.prototype.isDisjoint = function (other) {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (other.contains(item)) {
                return false;
            }
        }
        return true;
    };
    SetImpl.prototype.containsHash = function (hash) {
        return Object.hasOwnProperty.call(this.index, hash);
    };
    return SetImpl;
}());
function quote(s) {
    if (s.indexOf('\'') < 0) {
        return "'" + s + "'";
    }
    return '"' + s.replace('"', '\\"') + '"';
}
exports.quote = quote;
var Types;
(function (Types) {
    function isNull(a) {
        return a.type === 'null';
    }
    Types.isNull = isNull;
    function isString(a) {
        return a.type === 'string';
    }
    Types.isString = isString;
    function isNumber(a) {
        return a.type === 'number';
    }
    Types.isNumber = isNumber;
    function isBoolean(a) {
        return a.type === 'boolean';
    }
    Types.isBoolean = isBoolean;
    function isArray(a) {
        return a.type === 'array';
    }
    Types.isArray = isArray;
    function isObject(a) {
        return a.type === 'object';
    }
    Types.isObject = isObject;
    function isUnion(a) {
        return a.type === 'union';
    }
    Types.isUnion = isUnion;
    function isNullable(a) {
        return a.type === 'nullable';
    }
    Types.isNullable = isNullable;
    function isMap(a) {
        return a.type === 'map';
    }
    Types.isMap = isMap;
    function isNamed(a) {
        return a.type === 'named';
    }
    Types.isNamed = isNamed;
    function isAny(a) {
        return a.type === 'any';
    }
    Types.isAny = isAny;
    function toStringInternal(a, visited, indices) {
        for (var i = 0; i < visited.length; i++) {
            if (visited[i] === a) {
                var resolvedRecursionIndex = indices.map[i];
                if (resolvedRecursionIndex == null) {
                    resolvedRecursionIndex = indices.map[i] = indices.current;
                    indices.current++;
                }
                return '{$' + resolvedRecursionIndex + '}';
            }
        }
        if (isNull(a)) {
            return 'Null';
        }
        else if (isString(a)) {
            if (a.value == null) {
                return 'String';
            }
            return 'String<' + quote(a.value) + '>';
        }
        else if (isNumber(a)) {
            return 'Number';
        }
        else if (isAny(a)) {
            return 'Any';
        }
        else if (isBoolean(a)) {
            return 'Boolean';
        }
        else if (isNamed(a)) {
            return 'Named<' + a.name + '>';
        }
        else if (isMap(a)) {
            return 'Map<' + toStringInternal(a.value, visited.concat([a]), indices) + '>';
        }
        else if (isNullable(a)) {
            var subtypeStr = toStringInternal(a.subtype, visited.concat([a]), indices);
            return 'Nullable<' + subtypeStr + '>';
        }
        else if (isArray(a)) {
            var containedStr = toStringInternal(a.contained, visited.concat([a]), indices);
            return 'Array<' + containedStr + '>';
        }
        else if (isObject(a)) {
            if (a.spec == null) {
                return 'Object';
            }
            var newVisited = visited.concat([a]);
            var keys = ObjectKeys(a.spec);
            keys.sort();
            var keyPairs = [];
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (Object.hasOwnProperty.call(a.spec, key)) {
                    var valueStr = toStringInternal(a.spec[key], newVisited, indices);
                    keyPairs.push(quote(key) + ': ' + valueStr);
                }
            }
            return '{' + keyPairs.join(', ') + '}';
        }
        else if (isUnion(a)) {
            var newVisited = visited.concat([a]);
            var typeStrings = [];
            for (var _a = 0, _b = a.types; _a < _b.length; _a++) {
                var type = _b[_a];
                var typeStr = toStringInternal(type, newVisited, indices);
                typeStrings.push(typeStr);
            }
            return typeStrings.join('|');
        }
        return unreachable(a);
    }
    function toString(a) {
        return toStringInternal(a, [], { current: 0, map: {} });
    }
    Types.toString = toString;
    Types.Any = { type: 'any' };
    Types.Null = { type: 'null' };
    Types.Number = { type: 'number' };
    Types.String = { type: 'string', value: null };
    function StringValue(value) {
        return { type: 'string', value: value };
    }
    Types.StringValue = StringValue;
    Types.Boolean = { type: 'boolean' };
    function Map(contained) {
        return { type: 'map', value: contained };
    }
    Types.Map = Map;
    function Nullable(subtype) {
        while (subtype.type === 'nullable') {
            subtype = subtype.subtype;
        }
        if (isNull(subtype)) {
            return Types.Null;
        }
        if (isAny(subtype)) {
            return Types.Any;
        }
        return { type: 'nullable', subtype: subtype };
    }
    Types.Nullable = Nullable;
    function Array(contained) {
        return { type: 'array', contained: contained };
    }
    Types.Array = Array;
    function Object(spec) {
        return { type: 'object', spec: spec || null };
    }
    Types.Object = Object;
    function Named(name) {
        return { type: 'named', name: name };
    }
    Types.Named = Named;
    function allNullable(types) {
        return types.every(function (t) { return isNullable(t); });
    }
    function Union(types) {
        var unpackedTypes = [];
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var value = types_1[_i];
            if (isAny(value)) {
                return Types.Any;
            }
            else if (isUnion(value)) {
                value.types.forEach(function (subtype) { return unpackedTypes.push(subtype); });
            }
            else {
                unpackedTypes.push(value);
            }
        }
        if (unpackedTypes.length > 0 && allNullable(unpackedTypes)) {
            var allSubtypes = unpackedTypes.map(function (t) { return t.subtype; });
            return Nullable(Union(allSubtypes));
        }
        return { type: 'union', types: unpackedTypes };
    }
    Types.Union = Union;
    function equalsInternal(a, b, verified) {
        for (var i = 0; i < verified.length; i++) {
            var verifiedType = verified[i];
            if (a === verifiedType.a && b === verifiedType.b) {
                return true;
            }
        }
        if (isNull(a) && isNull(b)) {
            return true;
        }
        else if (isString(a) && isString(b)) {
            return a.value === b.value;
        }
        else if (isAny(a) && isAny(b)) {
            return true;
        }
        else if (isNumber(a) && isNumber(b)) {
            return true;
        }
        else if (isBoolean(a) && isBoolean(b)) {
            return true;
        }
        else if (isNamed(a) && isNamed(b)) {
            return a.name === b.name;
        }
        else if (isNullable(a) && isNullable(b)) {
            return equalsInternal(a.subtype, b.subtype, verified.concat([{ a: a, b: b }]));
        }
        else if (isMap(a) && isMap(b)) {
            return equalsInternal(a.value, b.value, verified.concat([{ a: a, b: b }]));
        }
        else if (isArray(a) && isArray(b)) {
            return equalsInternal(a.contained, b.contained, verified.concat([{ a: a, b: b }]));
        }
        else if (isObject(a) && isObject(b)) {
            var aSpec_1 = a.spec;
            var bSpec_1 = b.spec;
            if (aSpec_1 == null && bSpec_1 == null) {
                return true;
            }
            else if (aSpec_1 != null && bSpec_1 != null) {
                var aKeys = Sets.create(ObjectKeys(aSpec_1));
                var bKeys = Sets.create(ObjectKeys(bSpec_1));
                var intersection = aKeys.intersection(bKeys);
                if (intersection.size() !== aKeys.size()) {
                    return false;
                }
                var newVerified_1 = verified.concat([{ a: a, b: b }]);
                return intersection.all(function (key) { return equalsInternal(aSpec_1[key], bSpec_1[key], newVerified_1); });
            }
        }
        else if (isUnion(a) && isUnion(b)) {
            var sortedATypes = a.types;
            var sortedBTypes = b.types;
            sortedATypes.sort(function (a, b) { return toString(a).localeCompare(toString(b)); });
            sortedBTypes.sort(function (a, b) { return toString(a).localeCompare(toString(b)); });
            if (sortedATypes.length !== sortedBTypes.length)
                return false;
            var newVerified = verified.concat([{ a: a, b: b }]);
            for (var i = 0; i < sortedATypes.length; i++) {
                if (!equalsInternal(sortedATypes[i], sortedBTypes[i], newVerified))
                    return false;
            }
            return true;
        }
        return false;
    }
    function equals(a, b) {
        return equalsInternal(a, b, []);
    }
    Types.equals = equals;
    /**
     * This is used for building up a type. It's the equivalent of `&` in TypeScript.
     * This should return null for everything except objects (since it's not
     * possible to have a union of anything but objects).
     */
    function combine(a, b) {
        if (isNullable(a)) {
            if (isNullable(b)) {
                var combinedSubtype = combine(a.subtype, b.subtype);
                if (combinedSubtype != null) {
                    return Nullable(combinedSubtype);
                }
            }
        }
        else if (isNull(a)) {
            if (isNull(b)) {
                return Types.Null;
            }
        }
        else if (isNumber(a)) {
            if (isNumber(b)) {
                return Types.Number;
            }
        }
        else if (isString(a)) {
            if (isString(b)) {
                return Types.String;
            }
        }
        else if (isBoolean(a)) {
            if (isBoolean(b)) {
                return Types.Boolean;
            }
        }
        else if (isUnion(a)) {
            if (equals(a, b)) {
                return a;
            }
        }
        else if (isArray(a)) {
            if (isArray(b)) {
                return a;
            }
        }
        else if (isAny(a) && isAny(b)) {
            return a;
        }
        else if (isNamed(a) && isNamed(b)) {
            return a.name === b.name ? a : null;
        }
        else if (isMap(a) && isMap(b)) {
            var combinedValue = combine(a.value, b.value);
            if (combinedValue != null) {
                return Map(combinedValue);
            }
        }
        else if (isObject(a) && isObject(b)) {
            var aSpec_2 = a.spec;
            var bSpec_2 = b.spec;
            if (aSpec_2 == null && bSpec_2 == null) {
                return a;
            }
            else if (aSpec_2 == null || bSpec_2 == null) {
                return null;
            }
            var aPropertyISet = Sets.create(ObjectKeys(aSpec_2));
            var bPropertyISet = Sets.create(ObjectKeys(bSpec_2));
            var propertiesUnion = aPropertyISet.union(bPropertyISet);
            var combinedSpec_1 = {};
            if (!propertiesUnion.all(function (prop) {
                var aProp = aSpec_2[prop];
                var bProp = bSpec_2[prop];
                if (aProp != null && bProp != null) {
                    var combined = combine(aProp, bProp);
                    if (combined == null) {
                        return false;
                    }
                    combinedSpec_1[prop] = combined;
                }
                else if (aProp != null) {
                    combinedSpec_1[prop] = aProp;
                }
                else {
                    combinedSpec_1[prop] = bProp;
                }
                return true;
            })) {
                return null;
            }
            return Object(combinedSpec_1);
        }
        return null;
    }
    Types.combine = combine;
    /**
     * This returns a type that will accept either this type or the other type
     * when it is assigned to the resulting type. This one should never fail,
     * since we can always default to a union type.
     */
    function unify(a, b) {
        if ((isNull(a) || isNullable(a)) && (isNull(b) || isNullable(b))) {
            // Either both are nullable, or one is nullable and the other is null
            if (isNullable(a) && isNullable(b)) {
                return Nullable(unify(a.subtype, b.subtype));
            }
            else if (isNullable(a)) {
                // b must be null
                return a;
            }
            else if (isNullable(b)) {
                // a must be null
                return b;
            }
            else if (isNull(a)) {
                return b;
            }
            else if (isNull(b)) {
                return a;
            }
            return unreachable(a), unreachable(b);
        }
        else if (isNull(a) || isNullable(a)) {
            // One of them is null or nullable
            if (isNull(a)) {
                return Nullable(b);
            }
            else if (isNullable(a)) {
                return Nullable(unify(a.subtype, b));
            }
            return unreachable(a);
        }
        else if (isNull(b) || isNullable(b)) {
            if (isNull(b)) {
                return Nullable(a);
            }
            else if (isNullable(b)) {
                return Nullable(unify(a, b.subtype));
            }
            return unreachable(b);
        }
        return Union([a, b]);
    }
    Types.unify = unify;
    function infer(obj) {
        if (typeof obj === 'number') {
            return Types.Number;
        }
        else if (typeof obj === 'string') {
            return Types.String;
        }
        else if (typeof obj === 'boolean') {
            return Types.Boolean;
        }
        else if (obj == null) {
            return Types.Null;
        }
        else if (obj && typeof obj.length === 'number') {
            var knownTypes = [];
            for (var i = 0; i < obj.length; i++) {
                var inferred = infer(obj[i]);
                var found = false;
                for (var j = 0; j < knownTypes.length; j++) {
                    if (equals(knownTypes[j], inferred)) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    knownTypes.push(inferred);
                }
            }
            if (knownTypes.length === 1) {
                return Array(knownTypes[0]);
            }
            return Array(Union(knownTypes));
        }
        else if (typeof obj === 'object') {
            return Object();
        }
        return Types.Any;
    }
    Types.infer = infer;
})(Types = exports.Types || (exports.Types = {}));
/*


namespace Types {
  export interface JsType<T> {
    isUnknown(): this is JsUnknown
    isNull(): this is JsNull
    isNumber(): this is JsNumber
    isString(): this is JsString
    isBoolean(): this is JsBoolean
    isArray(): this is JsArray<any, JsType<any>>
    isArrayOf<T>(t: JsType<T>): this is JsArray<T, JsType<T>>
    isObject(): this is JsObject
    isMap(): this is JsMap<any, JsType<any>>
    isMapOf<T>(t: JsType<T>): this is JsMap<T, JsType<T>>
    isEqualTo(other: JsType<any>): boolean
    isNullable(): this is JsNullable<any>
    isNullableOf<T>(t: JsType<T>): this is JsNullable<T>
  }
  export interface JsUnknown extends JsType<any> {
    type: 'unknown';
  }
  export interface JsNull extends JsType<null> {
    type: 'null';
  }
  export interface JsNumber extends JsType<number> {
    type: 'number';
  }
  export interface JsString extends JsType<string> {
    type: 'string';
  }
  export interface JsBoolean extends JsType<boolean> {
    type: 'boolean';
  }
  export type JsPrimitive = JsNumber | JsString | JsBoolean | JsNull;

  export interface JsNullable<T> extends JsType<T|null> {
    type: 'nullable';
    subtype: JsType<T>;
  }

  export interface JsObject extends JsType<Object> {
    type: 'object';
  }
  export interface JsMap<Contained, JsContained extends JsType<Contained>> extends JsType<Object> {
    type: 'map';
    contained: JsContained;
  }
  export interface JsArray<Contained, JsContained extends JsType<Contained>> extends JsType<Array<Contained>> {
    type: 'array';
    contained: JsContained;
  }

  abstract class BaseJsType<T> implements JsType<T> {
    isUnknown(): this is JsUnknown { return false }
    isNull(): this is JsNull { return false }
    isNumber(): this is JsNumber { return false }
    isString(): this is JsString { return false }
    isBoolean(): this is JsBoolean { return false }
    isArray(): this is JsArray<any, JsType<any>> { return false }
    isArrayOf<T>(t: JsType<T>): this is JsArray<T, JsType<T>> { return false }
    isObject(): this is JsObject { return false }
    isMap(): this is JsMap<any, JsType<any>> { return false }
    isMapOf<T>(t: JsType<T>): this is JsMap<T, JsType<T>> { return false }
    isEqualTo(other: JsType<any>): boolean { return false }
    isNullable(): this is JsNullable<any> { return false }
    isNullableOf<T>(t: JsType<T>): this is JsNullable<T> { return false }
  }

  class JsUnknownImpl extends BaseJsType<any> implements JsUnknown {
    type: 'unknown' = 'unknown';
    isUnknown(): this is JsUnknown { return true }
    isEqualTo(other: JsType<any>): boolean { return false }
  }
  export const unknown = new JsUnknownImpl();

  class JsNullableImpl<T> extends BaseJsType<null|T> implements JsNullable<T> {
    type: 'nullable' = 'nullable';
    subtype: JsType<T>;
    constructor(subtype: JsType<T>) {
      super();
      this.subtype = subtype;
    }
    isNullable(): this is JsNullable<any> { return true }
    isNullableOf<T>(t: JsType<T>): this is JsNullable<T> {
      return this.subtype.isEqualTo(t);
    }
  }

  class JsNumberImpl extends BaseJsType<number> implements JsNumber {
    type: 'number' = 'number';
    isNumber(): this is JsNumber { return true }
    isEqualTo(other: JsType<any>): boolean { return other.isNumber() }
  }
  export const number = new JsNumberImpl();

  class JsStringImpl extends BaseJsType<string> implements JsString {
    type: 'string' = 'string';
    isString(): this is JsString { return true }
    isEqualTo(other: JsType<any>): boolean { return other.isString() }
  }
  export const string = new JsStringImpl();

  class JsBooleanImpl extends BaseJsType<boolean> implements JsBoolean {
    type: 'boolean' = 'boolean';
    isBoolean(): this is JsBoolean { return true }
    isEqualTo(other: JsType<any>): boolean { return other.isBoolean() }
  }
  export const boolean = new JsBooleanImpl();

  class JsArrayImpl<T> extends BaseJsType<Array<T>> implements JsArray<T, JsType<T>> {
    type: 'array' = 'array';
    contained: JsType<T>;
    constructor(contained: JsType<T>) {
      super();
      this.contained = contained;
    }
    isBoolean(): this is JsBoolean { return true }
    isEqualTo(other: JsType<any>): boolean { return other.isArrayOf(this.contained) }
  }
  export function array<T>(contained: JsType<T>): JsArray<T, JsType<T>> {
    return new JsArrayImpl(contained);
  }
  

  class Typed<T> {
    value: T;
    type: Types.JsType<T>;

    constructor(value: T, type: Types.JsType<T>) {
      this.value = value;
      this.type = type;
    }x

    isNumber(): this is Typed<number> {
      return this.type.isNumber();
    }
    isString(): this is Typed<string> {
      return this.type.isString();
    }
    isBoolean(): this is Typed<boolean> {
      return this.type.isBoolean();
    }
    isArray(): this is TypedArray<any> {
      return this.type.isArray();
    }
    isArrayOf<T>(type: Types.JsType<T>): this is TypedArray<T> {
      return this.type.isArrayOf(type);
    }
  }

  class TypedArray<T> extends Typed<Array<T>> {
    containedType: Types.JsType<T>;
    constructor(value: Array<T>, type: Types.JsArray<T, Types.JsType<T>>) {
      super(value, type);
      this.containedType = type.contained;
    }
  }

  class TypedArrayAny extends TypedArray<any> {
    typedValues: Typed<any>[];
    constructor(value: any[]) {
      super(value, Types.array(Types.unknown));
      this.typedValues = value.map((v) => asTyped(v))
    }
    isArrayOf<T>(type: Types.JsType<T>): this is TypedArray<T> {
      return this.typedValues.every((t) => t.type.isEqualTo(type));
    }
    asArrayOf<T>(type: Types.JsType<T>): Result<TypedArray<T>, Error> {

    }
  }

  function asTyped(value: any): Typed<any> {
    if (typeof value === 'number') {
      return new Typed(value, Types.number);
    } else if (typeof value === 'string') {
      return new Typed(value, Types.string);
    } else if (typeof value === 'boolean') {
      return new Typed(value, Types.boolean);
    } else if (value && typeof value.length === 'number') {
      const arrayValue = value as Array<any>;
      return new TypedArrayAny(arrayValue);
    }
    return new Typed(value, Types.unknown);
  }
}
// */
//# sourceMappingURL=jstypes.js.map