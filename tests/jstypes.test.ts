// import * as mocha from "mocha";
import * as chai from "chai";

import { Types } from 'jstypes';


const primitiveTypes = [Types.Boolean, Types.Null, Types.String, Types.StringValue('hello'), Types.Number];

const expect = chai.expect;
describe('Nullable', () => {
  it('should construct primitives', () => {
    primitiveTypes.forEach((type) => {
      const constructed = Types.Nullable(type);
      if (Types.isNull(type)) {
        expect(constructed).to.be.deep.equal({type: 'null'});
      } else {
        expect(constructed).to.be.deep.equal({type: 'nullable', subtype: type});
      }
    })
  });

  it('should coalesce nullables', () => {
    primitiveTypes.forEach((type) => {
      let constructed: any = type;
      for (let i = 0; i < 100000; i++) {
        constructed = {type: 'nullable', subtype: constructed};
      }
      const constructedNullable = Types.Nullable(constructed);
      if (Types.isNull(type)) {
        expect(constructedNullable).to.be.deep.equal({type: 'null'});
      } else {
        expect(constructedNullable).to.be.deep.equal({type: 'nullable', subtype: type});
      }
    });
  });


});

describe('equals', () => {
  it('should compare primitives', () => {
    for (let i = 0; i < primitiveTypes.length; i++) {
      for (let j = 0; j < primitiveTypes.length; j++) {
        if (i === j) {
          expect(Types.equals(primitiveTypes[i], primitiveTypes[j])).to.be.true;
        } else {
          expect(Types.equals(primitiveTypes[i], primitiveTypes[j])).to.be.false;
        }
      }
    }
  });
});
