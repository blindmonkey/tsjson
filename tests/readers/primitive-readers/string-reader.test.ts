// import * as mocha from 'mocha';
import * as chai from 'chai';
import { expect } from 'chai';

import { PrimitiveReaders } from 'readers/primitive-readers';
import * as errors from 'errors/decoding/decoding-error';

describe('StringReader', () => {
  const reader = new PrimitiveReaders.StringReader();

  it('should not read numbers', () => {
    const result = reader.read(Math.PI);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(Math.PI, 'string', 'number'));
    } else {
      chai.assert(false);
    }
  });

  it('should read strings', () => {
    const value = '3.14159';
    const result = reader.read(value);
    if (result.isSuccess()) {
      expect(result.value).to.be.equal(value);
    } else {
      chai.assert(false);
    }
  });

  it('should fail for booleans', () => {
    const value = false;
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'string', 'boolean'));
    } else {
      chai.assert(false);
    }
  });

  it('should fail for arrays', () => {
    const value = [1, 2, 3];
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'string', 'array of number'));
    } else {
      chai.assert(false);
    }
  });

  it('should fail for objects', () => {
    const value = {};
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'string', 'object'));
    } else {
      chai.assert(false);
    }
  });

});
