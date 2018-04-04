

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