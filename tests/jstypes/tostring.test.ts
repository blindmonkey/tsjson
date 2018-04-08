// import * as mocha from "mocha";
import * as chai from "chai";

import { Types } from 'jstypes';

const expect = chai.expect;

describe('toString', () => {

  it('should safely stringify recursive types', () => {
    const spec: {[k: string]: Types.Type} = {
      'x': Types.Number
    };
    const obj = Types.Object(spec);
    spec['obj'] = Types.Nullable(obj);
    const top = Types.Object({'a': Types.Object({'x': Types.String}), 'test1': obj, 'test2': obj});
    top.spec && (top.spec['obj'] = top);
    const expectedObjString = "{'obj': Nullable<{$1}>, 'x': Number}";
    expect(Types.toString(top)).to.be.equal('{\'a\': {\'x\': String}, \'obj\': {$0}, \'test1\': ' + expectedObjString + ', \'test2\': ' + expectedObjString + '}');
  });

});