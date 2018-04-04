// import * as mocha from 'mocha';
import * as chai from 'chai';
import { expect } from 'chai';

import { PrimitiveReaders } from '../../../src/readers/primitive-readers';
import * as errors from '../../../src/errors/decoding/decoding-error';

describe('BooleanReader', () => {
  const reader = new PrimitiveReaders.BooleanReader();

  it('should not read numbers', () => {
    const result = reader.read(Math.PI);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(Math.PI, 'boolean', 'number'));
    } else {
      chai.assert(false);
    }
  });

  it('should not read strings', () => {
    const value = '3.14159';
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'boolean', 'string'));
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
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'boolean', 'array of number'));
    } else {
      chai.assert(false);
    }
  });

  it('should fail for objects', () => {
    const value = {};
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'boolean', 'object'));
    } else {
      chai.assert(false);
    }
  });

});
