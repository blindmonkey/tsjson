// import * as mocha from "mocha";
import * as chai from "chai";

import { Types } from 'jstypes';

const expect = chai.expect;

describe('toString', () => {

  function createRecursiveType(innerType: Types.Type): Types.Type {
    const spec: {[k: string]: Types.Type} = {
      'x': innerType
    };
    const obj = Types.Object(spec);
    spec['obj'] = Types.Nullable(obj);
    const top = Types.Object({'test1': obj, 'test2': obj});
    top.spec && (top.spec['obj'] = top);
    return top;
  }

  it('should safely compare recursive types', () => {
    const a = createRecursiveType(Types.String);
    const b = createRecursiveType(Types.String);
    const c = createRecursiveType(Types.Number);
    expect(Types.equals(a, b)).to.be.true;
    expect(Types.equals(a, c)).to.be.false;
  });

});