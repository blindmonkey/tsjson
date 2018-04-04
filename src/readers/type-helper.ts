export namespace Types {
  export const UnknownType = 'unknown';
  export const NullType = 'null';
  export const StringType = 'string';
  export const NumberType = 'number';
  export const BooleanType = 'boolean';
  export const ArrayType = 'array';
  export const ObjectType = 'object';

  export type TypeObj = {name: string, complex: boolean};
  export function simple(s: string): TypeObj {
    return {name: s, complex: false};
  }
  export function complex(s: string): TypeObj {
    return {name: s, complex: true};
  }

  export function determineContainedTypes(objs: any[]): TypeObj[] {
    const containedTypes: {[s: string]: TypeObj} = {};
    for (let i = 0; i < objs.length; i++) {
      let type = determineType(objs[i]);
      containedTypes[type.name] = type;
    }
    const keys = Object.keys(containedTypes).sort();
    return keys.map((v) => containedTypes[v]);
  }

  export function quoteAndEscape(quote: string, string: string): string {
    return [quote, string.replace(quote, '\\' + quote), quote].join('');
  }

  export function determineType(obj: any): TypeObj {
    if (typeof obj === 'number') {
      return simple(NumberType);
    } else if (typeof obj === 'string') {
      return simple(StringType);
    } else if (typeof obj === 'boolean') {
      return simple(BooleanType);
    } else if (obj == null) {
      return simple(NullType);
    } else if (obj && typeof obj.length === 'number') {
      return complex(ArrayType + ' of ' + determineContainedTypes(obj).map((v) => v.complex ? '('+v.name+')' : v.name));
    } else if (typeof obj === 'object') {
      return simple(ObjectType);
    }
    return simple(UnknownType);
  }
}