// import * as mocha from 'mocha';
import * as chai from 'chai';
import { expect } from 'chai';

import { PrimitiveReaders } from 'readers/primitive-readers';
import * as errors from 'errors/decoding/decoding-error';

describe('BooleanReader', () => {
  const reader = new PrimitiveReaders.BooleanReader();

  it('should not read numbers', () => {
    const result = reader.read(Math.PI);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(Math.PI, 'Boolean', 'Number'));
    } else {
      chai.assert(false);
    }
  });

  it('should not read strings', () => {
    const value = '3.14159';
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'Boolean', 'String'));
    } else {
      chai.assert(false);
    }
  });

  it('should read booleans', () => {
    const value = false;
    const result = reader.read(value);
    if (result.isSuccess()) {
      expect(result.value).to.be.equal(false);
    } else {
      chai.assert(false);
    }
  });

  it('should fail for arrays', () => {
    const value = [1, 2, 3];
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'Boolean', 'Array<Number>'));
    } else {
      chai.assert(false);
    }
  });

  it('should fail for objects', () => {
    const value = {};
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'Boolean', 'Object'));
    } else {
      chai.assert(false);
    }
  });

});
