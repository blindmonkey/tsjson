"use strict";
// function objKeys(obj: {[k:string]: any}): string[] {
//   return Object.keys(obj);
// }
// export namespace Types {
//   export interface Type {
//     isUnknown(): this is UnknownType
//     isNull(): this is NullType
//     isNumber(): this is NumberType
//     isString(): this is StringType
//     isStringValueAny(): this is StringValueType<string>
//     isStringValue<T extends string>(value: T): this is StringValueType<T>
//     isBoolean(): this is BooleanType
//     isAnyObject(): this is AnyObjectType
//     isSpeccedObject(): this is ObjectType
//     isObject(obj: {[k: string]: Type}): this is ObjectType
//     isArray(): this is ArrayType
//     isEnum(): this is EnumType
//     isNullable(): this is NullableType
//     isUnion(): this is UnionType
//     /** Whether they are the exact same type. */
//     equalTo(other: Type): boolean
//     /**
//      * Whether an object of the type `other` can be assigned to a variable of
//      * `this` type.
//      */
//     canBeAssigned(other: Type): boolean
//     /**
//      * This is used for building up a type. It's the equivalent of `&` in TypeScript.
//      * This should return null for everything except objects (since it's not
//      * possible to have a union of anything but objects).
//      */
//     combine(other: Type): Type|null
//     /**
//      * This returns a type that will accept either this type or the other type
//      * when it is assigned to the resulting type. This one should never fail,
//      * since we can always default to a union type.
//      */
//     unify(other: Type): Type|null
//   }
//   export interface UnknownType extends Type {}
//   export interface UnionType extends Type {
//     types: Type[];
//   }
//   export interface NullType extends Type {}
//   export interface NullableType extends Type {
//     subtype: Type;
//   }
//   export interface NumberType extends Type {}
//   export interface StringType extends Type {}
//   export interface StringValueType<T extends string> extends StringType {
//     value: T;
//   }
//   export interface BooleanType extends Type {}
//   export interface EnumType extends Type {
//     values: string[];
//   }
//   export interface AnyObjectType extends Type {}
//   export interface ObjectType extends AnyObjectType {
//     spec: {[key: string]: Type};
//     combine(other: Type): ObjectType|null;
//   }
//   export interface ArrayType extends Type {
//     contained: Type;
//   }
//   export abstract class BaseType implements Type {
//     isUnknown(): this is UnknownType { return false }
//     isNull(): this is NullType { return false }
//     isNumber(): this is NumberType { return false }
//     isString(): this is StringType { return false }
//     isStringValueAny(): this is StringValueType<string> { return false }
//     isStringValue<T extends string>(value: T): this is StringValueType<T> { return false }
//     isBoolean(): this is BooleanType { return false }
//     isEnum(): this is EnumType { return false }
//     isAnyObject(): this is AnyObjectType { return false }
//     isSpeccedObject(): this is ObjectType { return false }
//     isObject(): this is ObjectType { return false }
//     isArray(): this is ArrayType { return false }
//     isNullable(): this is NullableType { return false }
//     isUnion(): this is UnionType { return false }
//     abstract combine(other: Type): Type|null
//     abstract unify(other: Type): Type|null
//     abstract equalTo(other: Type): boolean
//     abstract canBeAssigned(other: Type): boolean
//   }
//   function unifyConsideringNullables(a: Type, b: Type, backup: (a: Type, b: Type) => Type|null): NullableType|NullType|null {
//     if (a.isNull() && b.isNull()) {
//       // Both are null, return null.
//       return a;
//     } else if (a.isNullable() || b.isNullable()) {
//       // At least one is nullable. We need to resolve them to their subtypes, unify those, and return a nullable result.
//       a = a.isNullable() ? a.subtype : a;
//       b = b.isNullable() ? b.subtype : b;
//       // If one of them is null, return a Nullable of the other one.
//       if (a.isNull()) {
//         return Nullable(b);
//       } else if (b.isNull()) {
//         return Nullable(a);
//       }
//       // Both are guaranteed to not be null or nullable.
//       const unified = backup(a, b);
//       if (unified == null) {
//         return null;
//       }
//       return Nullable(unified);
//     } else if (a.isNull() || b.isNull()) {
//       // Neither are nullable, but one is null.
//       // We need to figure out which one of them is null.
//       if (a.isNull()) {
//         return Nullable(b);
//       } else if (b.isNull()) {
//         return Nullable(a)
//       }
//     }
//     return backup(a, b);
//   }
//   class UnknownTypeImpl extends BaseType implements UnknownType {
//     isUnknown(): this is UnknownType { return true }
//     combine(): Type|null { return null }
//     unify(): Type|null { return null }
//     toString(): string { return 'unknown' }
//     equalTo(other: Type): boolean { return other.isUnknown() }
//     canBeAssigned(other: Type): boolean { return false }
//   }
//   class UnionTypeImpl extends BaseType implements UnionType {
//     types: Type[];
//     constructor(types: Type[]) {
//       super();
//       const ts = types.concat([])
//       this.types = [];
//       for (var i = 0; i < ts.length; i++) {
//         const type = ts[i];
//         this.verifyTypeForInclusion(type);
//         if (type.isUnion()) {
//           // Unpack union types
//           ts.push.apply(ts, type.types);
//         } else {
//           this.types.push(type);
//         }
//       }
//       this.types.sort((a, b) => a.toString().localeCompare(b.toString()));
//     }
//     private verifyTypeForInclusion(t: Type) {
//       if (t.isUnknown()) {
//         throw Error('Unknown types are not allowed in unions');
//       }
//     }
//     combine(other: Type): Type|null {
//       return this.equalTo(other) ? this : null;
//     }
//     unify(other: Type): Type {
//     }
//   }
//   class NullTypeImpl extends BaseType implements NullType {
//     isNull(): this is NullType { return true }
//     combine(other: Type): Type|null { return other.isNull() ? this : null }
//     unify(other: Type): Type|null {
//       if (other.isNullable()) {
//         return other;
//       }
//       if (other.isNull()) {
//         return this;
//       }
//       return Nullable(other);
//     }
//     toString(): string { return 'null' }
//   }
//   class NumberTypeImpl extends BaseType implements NumberType {
//     isNumber(): this is NumberType { return true }
//     combine(other: Type): Type|null { return other.isNumber() ? this : null }
//     unify(other: Type): Type|null {
//       return unifyConsideringNullables(this, other, (a, b) => {
//         return a.isNumber() && b.isNumber() ? Types.Number : null;
//       });
//     }
//     toString(): string { return 'number' }
//   }
//   class StringTypeImpl extends BaseType implements StringType {
//     isString(): this is StringType { return true }
//     combine(other: Type): Type|null { return other.isString() ? this : null }
//     unify(other: Type): Type|null {
//       return unifyConsideringNullables(this, other, (a, b) => {
//         return (a.isEnum() || a.isString()) && (b.isEnum() || b.isString()) ? Types.String : null;
//       });
//     }
//     toString(): string { return 'string' }
//   }
//   class NullableTypeImpl extends BaseType implements NullableType {
//     subtype: Type;
//     constructor(subtype: Type) {
//       super();
//       // Disallow nested nullables.
//       this.subtype = subtype.isNullable() ? subtype.subtype : subtype;
//       if (this.subtype.isNull()) {
//         throw Error('Cannot have a Nullable<null>');
//       }
//     }
//     isNullable(): this is NullableType { return true }
//     combine(other: Type): Type|null {
//       if (other.isNullable()) {
//         const combinedSubtype = this.subtype.combine(other.subtype);
//         if (combinedSubtype != null) {
//           return Nullable(combinedSubtype);
//         }
//       }
//       return null;
//     }
//     unify(other: Type): Type|null {
//       return unifyConsideringNullables(this, other, (a, b) => a.unify(b));
//     }
//     toString(): string { return 'Nullable<' + this.subtype.toString() + '>' }
//   }
//   class EnumTypeImpl extends BaseType implements EnumType {
//     values: string[];
//     constructor(values: string[]) {
//       super();
//       this.values = values;
//     }
//     isEnum(): this is EnumType { return true }
//     combine(other: Type): Type|null {
//       if (other.isEnum()) {
//         const combinedValues = this.values.concat([]);
//         const existingValues: {[k: string]: true} = {};
//         for (var i = 0; i < this.values.length; i++) {
//           existingValues[this.values[i]] = true;
//         }
//         for (var i = 0; i < other.values.length; i++) {
//           if (existingValues[other.values[i]]) {
//             continue;
//           }
//           existingValues[other.values[i]] = true;
//           combinedValues.push(other.values[i]);
//         }
//         return new EnumTypeImpl(combinedValues);
//       }
//       return null;
//     }
//     unify(other: Type): Type|null {
//       if (other.isEnum()) {
//         return this.combine(other);
//       }
//       if (other.isString()) {
//         return other;
//       }
//       return unifyConsideringNullables(this, other, (a, b) => a.unify(b));
//     }
//     toString(): string { return 'Enum<' + this.values.map((v) => quoteAndEscape('"', v)).join('|') + '>' }
//   }
//   class StringValueTypeImpl<T extends string> extends BaseType implements StringValueType<T> {
//     value: T;
//     constructor(value: T) {
//       super();
//       this.value = value;
//     }
//     isString(): this is StringType { return true }
//     isStringValueAny(): this is StringValueType<string> {
//       return true;
//     }
//     isStringValue<S extends string>(s: S): this is StringValueType<S> {
//       return <string>s === <string>this.value;
//     }
//     combine(other: Type): Type|null { return other.isStringValue(this.value) ? this : null }
//     unify(other: Type): Type|null {
//       return unifyConsideringNullables(this, other, (a, b) => {
//         if (a.isStringValueAny() && b.isStringValueAny()) {
//           return Enum([a.value, b.value]);
//         } else if ((a.isEnum() || a.isStringValueAny()) && (b.isEnum() || b.isStringValueAny())) {
//           const values: string[] = [];
//           if (a.isEnum()) {
//             values.push.apply(values, a.values);
//           } else if (a.isStringValueAny()) {
//             values.push(a.value);
//           }
//           if (b.isEnum()) {
//             values.push.apply(values, b.values);
//           } else if (b.isStringValueAny()) {
//             values.push(b.value);
//           }
//           return Enum(values);
//         }
//         return null;
//       });
//     }
//     toString(): string {
//       return quoteAndEscape('"', this.value);
//     }
//   }
//   export class BooleanTypeImpl extends BaseType implements BooleanType {
//     isBoolean(): this is BooleanType { return true }
//     combine(other: Type): BooleanType|null { return other.isBoolean() ? this : null }
//     unify(other: Type): Type|null {
//       return unifyConsideringNullables(this, other, (a, b) => {
//         return a.isBoolean() && b.isBoolean() ? Types.Boolean : null;
//       });
//     }
//     toString(): string { return 'boolean' }
//   }
//   export class ObjectTypeImpl extends BaseType implements ObjectType {
//     spec: {[key: string]: Type};
//     constructor(spec: {[key: string]: Type}) {
//       super();
//       this.spec = spec;
//     }
//     isAnyObject(): this is AnyObjectType { return true }
//     isSpeccedObject(): this is ObjectType { return true }
//     isObject(): this is ObjectType { return true }
//     combine(other: Type): ObjectType|null {
//       if (other.isSpeccedObject()) {
//         const otherSpec = other.spec;
//         const combinedSpec: {[key: string]: Type} = {}
//         for (const key in this.spec) {
//           if (Object.hasOwnProperty.call(this.spec, key)) {
//             if (Object.hasOwnProperty.call(otherSpec, key)) {
//               const combined = this.spec[key].combine(otherSpec[key]);
//               if (combined == null) {
//                 return null;
//               }
//               combinedSpec[key] = combined;
//             } else {
//               combinedSpec[key] = this.spec[key];
//             }
//           }
//         }
//         for (const key in otherSpec) {
//           if (Object.hasOwnProperty.call(otherSpec, key) && !Object.hasOwnProperty.call(combinedSpec, key)) {
//             combinedSpec[key] = otherSpec[key];
//           }
//         }
//         return new ObjectTypeImpl(combinedSpec);
//       }
//       return null;
//     }
//     unify(other: Type): Type|null {
//       return unifyConsideringNullables(this, other, (a, b) => {
//         if (a.isAnyObject() && b.isAnyObject() && !(a.isSpeccedObject() && b.isSpeccedObject())) {
//           // If both of them are objects, but one of them is not specced...
//           return Types.AnyObject;
//         } else if (a.isSpeccedObject() && b.isSpeccedObject()) {
//           // If both are specced objects, find the intersection of them.
//         }
//       });
//     }
//     toString(): string {
//       const keyValuePairs: string[] = [];
//       for (var key in this.spec) {
//         if (Object.hasOwnProperty.call(this.spec, key)) {
//           keyValuePairs.push(quoteAndEscape('"', key) + ': ' + this.spec[key].toString());
//         }
//       }
//       return '{' + keyValuePairs.join(', ') + '}';
//     }
//   }
//   export class AnyObjectTypeImpl extends BaseType implements AnyObjectType {
//     isAnyObject(): this is AnyObjectType { return true }
//     combine(other: Type): AnyObjectType|null { return other.isAnyObject() ? this : null }
//     toString(): string { return 'Object' }
//   }
//   export class ArrayTypeImpl extends BaseType implements ArrayType {
//     contained: Type;
//     constructor(contained: Type) {
//       super();
//       this.contained = contained;
//     }
//     isArray(): this is ArrayType { return true }
//     combine(other: Type): ArrayType|null { 
//       if (other.isArray()) {
//         const combinedContained = this.contained.combine(other.contained);
//         if (combinedContained != null) {
//           return new ArrayTypeImpl(combinedContained);
//         }
//       }
//       return null;
//     }
//     toString(): string { return 'Array<' + this.contained.toString() + '>' }
//   }
//   export const Unknown = new UnknownTypeImpl();
//   export const Null = new NullTypeImpl();
//   export const Number = new NumberTypeImpl();
//   export const String = new StringTypeImpl();
//   export const Boolean = new BooleanTypeImpl();
//   export const AnyObject = new AnyObjectTypeImpl();
//   export function Enum(values: string[]): EnumType {
//     return new EnumTypeImpl(values);
//   }
//   export function Nullable(typ: Type): NullableType {
//     if (typ.isNullable()) {
//       return typ;
//     }
//     return new NullableTypeImpl(typ);
//   }
//   export function Object(spec: {[k:string]: Type}): ObjectType {
//     return new ObjectTypeImpl(spec);
//   }
//   export function Array(contained: Type) {
//     return new ArrayTypeImpl(contained);
//   }
//   export function StringValue<T extends string>(value: T): StringValueType<T> {
//     return new StringValueTypeImpl(value);
//   }
//   export function infer(obj: any): Type {
//     if (typeof obj === 'string') {
//       return Types.String;
//     } else if (typeof obj === 'number') {
//       return Types.Number;
//     } else if (typeof obj === 'boolean') {
//       return Types.Boolean;
//     } else if (obj == null) {
//       return Types.Null;
//     } else if (typeof obj.length === 'number')
//     return Types.Unknown;
//   }
//   export const UnknownType = 'unknown';
//   export const NullType = 'null';
//   export const StringType = 'string';
//   export const NumberType = 'number';
//   export const BooleanType = 'boolean';
//   export const ArrayType = 'array';
//   export const ObjectType = 'object';
//   export type TypeObj = {name: string, complex: boolean};
//   export function simple(s: string): TypeObj {
//     return {name: s, complex: false};
//   }
//   export function complex(s: string): TypeObj {
//     return {name: s, complex: true};
//   }
//   export function determineContainedTypes(objs: any[]): TypeObj[] {
//     const containedTypes: {[s: string]: TypeObj} = {};
//     for (let i = 0; i < objs.length; i++) {
//       let type = determineType(objs[i]);
//       containedTypes[type.name] = type;
//     }
//     const keys = objKeys(containedTypes).sort();
//     return keys.map((v) => containedTypes[v]);
//   }
//   export function quoteAndEscape(quote: string, string: string): string {
//     return [quote, string.replace(quote, '\\' + quote), quote].join('');
//   }
//   export function determineType(obj: any): TypeObj {
//     if (typeof obj === 'number') {
//       return simple(NumberType);
//     } else if (typeof obj === 'string') {
//       return simple(StringType);
//     } else if (typeof obj === 'boolean') {
//       return simple(BooleanType);
//     } else if (obj == null) {
//       return simple(NullType);
//     } else if (obj && typeof obj.length === 'number') {
//       return complex(ArrayType + ' of ' + determineContainedTypes(obj).map((v) => v.complex ? '('+v.name+')' : v.name));
//     } else if (typeof obj === 'object') {
//       return simple(ObjectType);
//     }
//     return simple(UnknownType);
//   }
// }
//# sourceMappingURL=type-helper.js.map