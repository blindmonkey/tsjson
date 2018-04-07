// import * as mocha from 'mocha';
import * as chai from 'chai';
import { expect } from 'chai';

import { PrimitiveReaders } from 'readers/primitive-readers';
import * as errors from 'errors/decoding/decoding-error';

describe('NumberReader', () => {
  const reader = new PrimitiveReaders.NumberReader();

  it('should read numbers', () => {
    const result = reader.read(Math.PI);
    if (result.isSuccess()) {
      expect(result.value).to.be.equal(Math.PI);
    } else {
      chai.assert(false);
    }
  });

  it('should fail for strings', () => {
    const value = '3.14159';
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'Number', 'String'));
    } else {
      chai.assert(false);
    }
  });

  it('should fail for booleans', () => {
    const value = false;
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'Number', 'Boolean'));
    } else {
      chai.assert(false);
    }
  });

  it('should fail for arrays', () => {
    const value = [1, 2, 3];
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'Number', 'Array<Number>'));
    } else {
      chai.assert(false);
    }
  });

  it('should fail for objects', () => {
    const value = {};
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'Number', 'Object'));
    } else {
      chai.assert(false);
    }
  });
});
