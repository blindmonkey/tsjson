export declare function quote(s: string): string;
export declare namespace Types {
    interface NullType {
        type: 'null';
    }
    interface StringType {
        type: 'string';
        value: null | string;
    }
    interface NumberType {
        type: 'number';
    }
    interface BooleanType {
        type: 'boolean';
    }
    interface ArrayType {
        type: 'array';
        contained: Type;
    }
    interface ObjectType {
        type: 'object';
        spec: null | {
            [k: string]: Type;
        };
    }
    interface MapType {
        type: 'map';
        value: Type;
    }
    type NonNullPrimitiveType = StringType | NumberType | BooleanType;
    type NonNullSimpleType = NonNullPrimitiveType | ArrayType | ObjectType | MapType;
    type SimpleType = NonNullSimpleType | NullType;
    interface UnionType {
        type: 'union';
        types: NonUnionType[];
    }
    interface NullableType {
        type: 'nullable';
        subtype: NonNullableNonNullType;
    }
    type NonUnionType = SimpleType | NullableType;
    type NonNullableNonNullType = NonNullSimpleType | UnionType;
    type NonNullableType = SimpleType | UnionType;
    type Type = NonUnionType | NonNullableType | NullType;
    function isNull(a: Type): a is NullType;
    function isString(a: Type): a is StringType;
    function isNumber(a: Type): a is NumberType;
    function isBoolean(a: Type): a is BooleanType;
    function isArray(a: Type): a is ArrayType;
    function isObject(a: Type): a is ObjectType;
    function isUnion(a: Type): a is UnionType;
    function isNullable(a: Type): a is NullableType;
    function isMap(a: Type): a is MapType;
    function toString(a: Type): string;
    const Null: NullType;
    const Number: NumberType;
    const String: StringType;
    function StringValue(value: string): StringType;
    const Boolean: BooleanType;
    function Map(contained: Type): MapType;
    function Nullable(subtype: Type): NullableType | NullType;
    function Array(contained: Type): ArrayType;
    function Object(spec?: null | {
        [k: string]: Type;
    }): ObjectType;
    function Union(types: Type[]): UnionType | NullableType;
    function equals(a: Type, b: Type): boolean;
    /**
     * This is used for building up a type. It's the equivalent of `&` in TypeScript.
     * This should return null for everything except objects (since it's not
     * possible to have a union of anything but objects).
     */
    function combine(a: Type, b: Type): Type | null;
    /**
     * This returns a type that will accept either this type or the other type
     * when it is assigned to the resulting type. This one should never fail,
     * since we can always default to a union type.
     */
    function unify(a: Type, b: Type): Type;
    function infer(obj: any): Type | null;
}
