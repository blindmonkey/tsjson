function unreachable(a: never): never {
  return a;
}

function ObjectKeys(obj: object) {
  return Object.keys(obj);
}

// namespace Objects {
//   export function merge<Value>(obj1: {[k: string]: Value}, obj2: {[k: string]: Value}): {[k: string]: Value} {
//     const obj: {[k: string]: Value} = {};
//     for (var key in obj1) {
//       obj[key] = obj1[key];
//     }
//     for (var key in obj2) {
//       obj[key] = obj2[key];
//     }
//     return obj;
//   }
// }

interface ISet<T> {
  size(): number;
  add(value: T): boolean;
  remove(value: T): boolean;
  contains(value: T): boolean;
  toArray(): T[];
  copy(): ISet<T>;
  equals(other: ISet<T>): boolean;
  // Iterable
  all(f: (v: T) => boolean): boolean;
  forEach(f: (v: T) => boolean): void;
  map<Out>(f: (v: T) => Out): ISet<Out>;
  // ISet operations
  union(other: ISet<T>): ISet<T>;
  intersection(other: ISet<T>): ISet<T>;
  subtract(other: ISet<T>): ISet<T>;
  isSubsetOf(other: ISet<T>): boolean;
  isDisjoint(other: ISet<T>): boolean;
}

namespace Sets {
  export function create<T>(array: T[]): ISet<T> {
    const set: ISet<T> = new SetImpl();
    array.forEach((v) => set.add(v));
    return set;
  }
}

class SetImpl<T> implements ISet<T> {
  private items: T[] = [];
  private index: { [k: string]: { index: number, value: T } } = {};

  public static create<T>(array: T[]): ISet<T> {
    const set: ISet<T> = new SetImpl();
    array.forEach((v) => set.add(v));
    return set;
  }

  public size(): number {
    return this.items.length;
  }
  public toArray(): T[] {
    return this.items.concat([]);
  }

  public copy(): ISet<T> {
    return Sets.create(this.items);
  }

  public forEach(f: (v: T) => boolean): void {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (!f(item)) {
        return;
      }
    }
  }

  public equals(other: ISet<T>): boolean {
    return other.size() == this.size() && this.items.every((item) => other.contains(item));
  }

  all(f: (v: T) => boolean): boolean {
    const items = this.items;
    const length = items.length;
    for (let i = 0; i < length; i++) {
      const item = items[i];
      if (!f(item)) {
        return false;
      }
    }
    return true;
  }

  map<Out>(f: (v: T) => Out): ISet<Out> {
    const output = new SetImpl<Out>();
    this.items.forEach((item) => output.add(f(item)));
    return output;
  }

  contains(value: T): boolean {
    const hash = value.toString();
    return this.containsHash(hash);
  }

  public add(value: T): boolean {
    const hash = value.toString();
    if (!this.containsHash(hash)) {
      this.index[hash] = { index: this.items.length, value };
      this.items.push(value);
      return true;
    }
    return false;
  }

  public remove(value: T): boolean {
    const valueHash = value.toString();
    const existingItem = this.index[valueHash];
    if (existingItem == null) {
      return false;
    }
    delete this.index[valueHash];
    for (let i = existingItem.index + 1; i < this.items.length; i++) {
      this.index[this.items[i].toString()].index--;
    }
    this.items.splice(existingItem.index, 1);
    return true;
  }

  public union(other: ISet<T>): ISet<T> {
    const output: ISet<T> = new SetImpl();
    this.forEach((item) => output.add(item));
    other.forEach((item) => output.add(item));
    return output;
  }

  public intersection(other: ISet<T>): ISet<T> {
    const output: ISet<T> = new SetImpl();
    this.forEach((item) => {
      if (other.contains(item)) {
        output.add(item);
      }
      return true;
    });
    return output;
  }

  public subtract(other: ISet<T>): ISet<T> {
    const output: ISet<T> = new SetImpl();
    this.forEach((item) => {
      if (!other.contains(item)) {
        output.add(item);
      }
      return true;
    });
    return output;
  }

  public isSubsetOf(other: ISet<T>): boolean {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (!other.contains(item)) {
        return false;
      }
    }
    return true;
  }

  public isDisjoint(other: ISet<T>): boolean {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (other.contains(item)) {
        return false;
      }
    }
    return true;
  }

  private containsHash(hash: string): boolean {
    return Object.hasOwnProperty.call(this.index, hash);
  }
}

function quote(s: string) {
  if (s.indexOf('\'') < 0) {
    return "'" + s + "'";
  }
  return '"' + s.replace('"', '\\"') + '"';
}

export namespace Types {
  export interface NullType {
    type: 'null';
  }
  export interface StringType {
    type: 'string';
    value: null|string;
  }
  export interface NumberType {
    type: 'number';
  }
  export interface BooleanType {
    type: 'boolean';
  }
  export interface ArrayType {
    type: 'array';
    contained: Type;
  }
  export interface ObjectType {
    type: 'object';
    spec: null|{[k:string]: Type};
  }
  type NonNullPrimitiveType = StringType | NumberType | BooleanType;
  // type PrimitiveType = NullType | NonNullPrimitiveType;
  type NonNullSimpleType = NonNullPrimitiveType | ArrayType | ObjectType;
  type SimpleType = NonNullSimpleType | NullType;

  export interface UnionType {
    type: 'union';
    types: NonUnionType[];
  }
  export interface NullableType {
    type: 'nullable';
    subtype: NonNullableNonNullType;
  }

  type NonUnionType = SimpleType | NullableType;
  type NonNullableNonNullType = NonNullSimpleType | UnionType;
  type NonNullableType = SimpleType | UnionType;

  export type Type = NonUnionType | NonNullableType | NullType;

  export function isNull(a: Type): a is NullType {
    return a.type === 'null';
  }
  export function isString(a: Type): a is StringType {
    return a.type === 'string';
  }
  export function isNumber(a: Type): a is NumberType {
    return a.type === 'number';
  }
  export function isBoolean(a: Type): a is BooleanType {
    return a.type === 'boolean';
  }
  export function isArray(a: Type): a is ArrayType {
    return a.type === 'array';
  }
  export function isObject(a: Type): a is ObjectType {
    return a.type === 'object';
  }
  export function isUnion(a: Type): a is UnionType {
    return a.type === 'union';
  }
  export function isNullable(a: Type): a is NullableType {
    return a.type === 'nullable';
  }

  function toStringInternal(a: Type, visited: Type[],
                            indices: {current: number, map: {[k: string]: number}}): string {

    for (let i = 0; i < visited.length; i++) {
      if (visited[i] === a) {
        let resolvedRecursionIndex = indices.map[i];
        if (resolvedRecursionIndex == null) {
          resolvedRecursionIndex = indices.map[i] = indices.current;
          indices.current++;
        }
        return '{$' + resolvedRecursionIndex + '}';
      }
    }

    if (isNull(a)) {
      return 'Null';
    } else if (isString(a)) {
      if (a.value == null) {
        return 'String';
      }
      return 'String<' + quote(a.value) + '>';
    } else if (isNumber(a)) {
      return 'Number';
    } else if (isBoolean(a)) {
      return 'Boolean';
    } else if (isNullable(a)) {
      const subtypeStr = toStringInternal(a.subtype, visited.concat([a]), indices);
      return 'Nullable<' + subtypeStr + '>';
    } else if (isArray(a)) {
      const containedStr = toStringInternal(a.contained, visited.concat([a]), indices);
      return 'Array<' + containedStr + '>';
    } else if (isObject(a)) {
      if (a.spec == null) {
        return 'Object';
      }
      const newVisited = visited.concat([a]);
      const keys = ObjectKeys(a.spec);
      keys.sort();
      const keyPairs: string[] = [];
      for (const key of keys) {
        if (Object.hasOwnProperty.call(a.spec, key)) {
          const valueStr = toStringInternal(a.spec[key], newVisited, indices);
          keyPairs.push(quote(key) + ': ' + valueStr);
        }
      }
      return '{' + keyPairs.join(', ') + '}';
    } else if (isUnion(a)) {
      const newVisited = visited.concat([a]);
      const typeStrings: string[] = [];
      for (const type of a.types) {
        const typeStr = toStringInternal(type, newVisited, indices);
        typeStrings.push(typeStr);
      }
      return typeStrings.join('|');
    }
    return unreachable(a);
  }
  export function toString(a: Type): string {
    return toStringInternal(a, [], {current: 0, map: {}});
  }

  export const Null: NullType = { type: 'null' };
  export const Number: NumberType = { type: 'number' };
  export const String: StringType = { type: 'string', value: null };
  export function StringValue(value: string): StringType {
    return { type: 'string', value: value };
  }
  export const Boolean: BooleanType = { type: 'boolean' };
  export function Nullable(subtype: Type): NullableType|NullType {
    while (subtype.type === 'nullable') {
      subtype = subtype.subtype;
    }
    if (isNull(subtype)) { return Null; }
    return { type: 'nullable', subtype: subtype };
  }
  export function Array(contained: Type): ArrayType {
    return { type: 'array', contained: contained };
  }
  export function Object(spec?: null|{[k:string]: Type}): ObjectType {
    return { type: 'object', spec: spec || null };
  }
  function allNullable(types: NonUnionType[]): types is NullableType[] {
    return types.every((t) => isNullable(t));
  }
  export function Union(types: Type[]): UnionType | NullableType {
    const unpackedTypes: NonUnionType[] = [];
    types.forEach((value) => {
      if (isUnion(value)) {
        value.types.forEach((subtype) => unpackedTypes.push(subtype));
      } else {
        unpackedTypes.push(value);
      }
    });
    if (allNullable(unpackedTypes)) {
      const allSubtypes = unpackedTypes.map((t) => t.subtype);
      return Nullable(Union(allSubtypes)) as NullableType;
    }
    return { type: 'union', types: unpackedTypes };
  }


  function equalsInternal(a: Type, b: Type, verified: {a: Type, b: Type}[]): boolean {
    for (let i = 0; i < verified.length; i++) {
      const verifiedType = verified[i];
      if (a === verifiedType.a && b === verifiedType.b) {
        return true;
      }
    }

    if (isNull(a) && isNull(b)) {
      return true;
    } else if (isString(a) && isString(b)) {
      return a.value === b.value;
    } else if (isNumber(a) && isNumber(b)) {
      return true;
    } else if (isBoolean(a) && isBoolean(b)) {
      return true;
    } else if (isNullable(a) && isNullable(b)) {
      return equalsInternal(a.subtype, b.subtype, verified.concat([{a: a, b: b}]));
    } else if (isArray(a) && isArray(b)) {
      return equalsInternal(a.contained, b.contained, verified.concat([{a: a, b: b}]));
    } else if (isObject(a) && isObject(b)) {
      const aSpec = a.spec;
      const bSpec = b.spec;
      if (aSpec == null && bSpec == null) {
        return true;
      } else if (aSpec != null && bSpec != null) {
        const aKeys = Sets.create(ObjectKeys(aSpec));
        const bKeys = Sets.create(ObjectKeys(bSpec));
        const intersection = aKeys.intersection(bKeys);
        if (intersection.size() !== aKeys.size()) {
          return false;
        }
        const newVerified = verified.concat([{a: a, b: b}]);
        return intersection.all((key) => equalsInternal(aSpec[key], bSpec[key], newVerified));
      }
    } else if (isUnion(a) && isUnion(b)) {
      const sortedATypes = a.types;
      const sortedBTypes = b.types;
      sortedATypes.sort((a, b) => toString(a).localeCompare(toString(b)));
      sortedBTypes.sort((a, b) => toString(a).localeCompare(toString(b)));
      if (sortedATypes.length !== sortedBTypes.length) return false;
      const newVerified = verified.concat([{a: a, b: b}]);
      for (let i = 0; i < sortedATypes.length; i++) {
        if (!equalsInternal(sortedATypes[i], sortedBTypes[i], newVerified)) return false;
      }
      return true;
    }
    return false
  }
  export function equals(a: Type, b: Type): boolean {
    return equalsInternal(a, b, []);
  }

  /**
   * This is used for building up a type. It's the equivalent of `&` in TypeScript.
   * This should return null for everything except objects (since it's not
   * possible to have a union of anything but objects).
   */
  export function combine(a: Type, b: Type): Type|null {
    if (isNullable(a)) {
      if (isNullable(b)) {
        const combinedSubtype = combine(a.subtype, b.subtype);
        if (combinedSubtype != null) {
          return Nullable(combinedSubtype);
        }
      }
    } else if (isNull(a)) {
      if (isNull(b)) {
        return Null;
      }
    } else if (isNumber(a)) {
      if (isNumber(b)) {
         return Number;
      }
    } else if (isString(a)) {
      if (isString(b)) {
        return String;
      }
    } else if (isBoolean(a)) {
      if (isBoolean(b)) {
        return Boolean;
      }
    } else if (isUnion(a)) {
      if (equals(a, b)) {
        return a;
      }
    } else if (isArray(a)) {
      if (isArray(b)) {
        return a;
      }
    } else if (isObject(a) && isObject(b)) {
      const aSpec = a.spec;
      const bSpec = b.spec;
      if (aSpec == null && bSpec == null) {
        return a;
      } else if (aSpec == null || bSpec == null) {
        return null;
      }
      const aPropertyISet = Sets.create(ObjectKeys(aSpec));
      const bPropertyISet = Sets.create(ObjectKeys(bSpec));
      const propertiesUnion = aPropertyISet.union(bPropertyISet);
      const combinedSpec: {[k: string]: Type} = {};
      if (!propertiesUnion.all((prop) => {
        const aProp = aSpec[prop];
        const bProp = bSpec[prop];
        if (aProp != null && bProp != null) {
          const combined = combine(aProp, bProp);
          if (combined == null) {
            return false;
          }
          combinedSpec[prop] = combined;
        } else if (aProp != null) {
          combinedSpec[prop] = aProp;
        } else {
          combinedSpec[prop] = bProp;
        }
        return true;
      })) {
        return null;
      }
      return Object(combinedSpec);
    }
    return null;
  }

  /**
   * This returns a type that will accept either this type or the other type
   * when it is assigned to the resulting type. This one should never fail,
   * since we can always default to a union type.
   */
  export function unify(a: Type, b: Type): Type {
    if ((isNull(a) || isNullable(a)) && (isNull(b) || isNullable(b))) {
      // Either both are nullable, or one is nullable and the other is null
      if (isNullable(a) && isNullable(b)) {
        return Nullable(unify(a.subtype, b.subtype));
      } else if (isNullable(a)) {
        // b must be null
        return a;
      } else if (isNullable(b)) {
        // a must be null
        return b;
      } else if (isNull(a)) {
        return b;
      } else if (isNull(b)) {
        return a;
      }
      return unreachable(a), unreachable(b);
    } else if (isNull(a) || isNullable(a)) {
      // One of them is null or nullable
      if (isNull(a)) {
        return Nullable(b)
      } else if (isNullable(a)) {
        return Nullable(unify(a.subtype, b));
      }
      return unreachable(a);
    } else if (isNull(b) || isNullable(b)) {
      if (isNull(b)) {
        return Nullable(a);
      } else if (isNullable(b)) {
        return Nullable(unify(a, b.subtype));
      }
      return unreachable(b);
    }
    return Union([a, b]);
  }

  export function infer(obj: any): Type|null {
    if (typeof obj === 'number') {
      return Number;
    } else if (typeof obj === 'string') {
      return String;
    } else if (typeof obj === 'boolean') {
      return Boolean;
    } else if (obj == null) {
      return Null;
    } else if (obj && typeof obj.length === 'number') {
      const knownTypes: Type[] = [];
      for (let i = 0; i < obj.length; i++) {
        const inferred = infer(obj[i]);
        if (inferred == null) return null;
        let found = false;
        for (let j = 0; j < knownTypes.length; j++) {
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
    } else if (typeof obj === 'object') {
      return Object();
    }
    return null;
  }
}

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
