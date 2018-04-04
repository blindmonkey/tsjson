// import * as mocha from 'mocha';
import * as chai from 'chai';
import { expect } from 'chai';

import { PrimitiveReaders } from '../../src/readers/primitive-readers';
import * as errors from '../../src/errors/decoding/decoding-error';

import { Types } from '../../src/readers/type-helper';


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
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'number', 'string'));
    } else {
      chai.assert(false);
    }
  });

  it('should fail for booleans', () => {
    const value = false;
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'number', 'boolean'));
    } else {
      chai.assert(false);
    }
  });

  it('should fail for arrays', () => {
    const value = [1, 2, 3];
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'number', 'array of number'));
    } else {
      chai.assert(false);
    }
  });

  it('should fail for objects', () => {
    const value = {};
    const result = reader.read(value);
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(errors.InvalidTypeError.create(value, 'number', 'object'));
    } else {
      chai.assert(false);
    }
  });

});