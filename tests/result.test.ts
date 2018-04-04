// import * as mocha from "mocha";
import * as chai from "chai";

import * as errors from '../src/errors/decoding/decoding-error';
import { Result } from '../src/result/result';

function identity<T>(x: T): T { return x }
function constant<T>(x: T): () => T { return () => x }

const SuccessfulValue = Math.PI;
const FailureValue = Math.E;

const expect = chai.expect;
describe('Result.success', () => {

  function makeTestModel(): Result<number, string> {
    return Result.success(SuccessfulValue);
  };

  it('should construct correctly', () => {
    const r = makeTestModel();
    expect(r.isSuccess()).to.be.true;
    expect(r.isFailure()).to.be.false;
    expect(r.map<number|string>(identity, identity)).to.be.equal(SuccessfulValue);
  });

  it('should flatMap', () => {
    const r = makeTestModel();
    const result = r.flatMap<true, false>(
      constant(Result.success<true, false>(true)),
      constant(Result.failure<true, false>(false))
    );
    if (result.isSuccess()) {
      expect(result.value).to.be.true;
    } else {
      chai.assert(false);
    }
  });

  it('should mapSuccess', () => {
    const r = makeTestModel();
    const result = r.mapSuccess((x) => x * 2);
    expect(result.isSuccess()).to.be.true;
    expect(result.isFailure()).to.be.false;
    if (result.isSuccess()) {
      expect(result.value).to.be.equal(SuccessfulValue * 2);
    } else {
      chai.assert(false);
    }
  });

  it('should not mapFailure', () => {
    const r = makeTestModel();
    const result = r.mapFailure((x) => x + x);
    expect(result.isSuccess()).to.be.true;
    expect(result.isFailure()).to.be.false;
    if (result.isSuccess()) {
      expect(result.value).to.be.equal(SuccessfulValue);
    } else {
      chai.assert(false);
    }
  });

});

describe('Result.failure', () => {

  function makeTestModel(): Result<string, number> {
    return Result.failure(FailureValue);
  }

  it('should construct correctly', () => {
    const r = makeTestModel();
    expect(r.isSuccess()).to.be.false;
    expect(r.isFailure()).to.be.true;
    expect(r.map<number|string>(identity, identity)).to.be.equal(FailureValue);
  });

  it('should flatMap', () => {
    const r = makeTestModel();
    const result = r.flatMap<true, false>(
      constant(Result.success<true, false>(true)),
      constant(Result.failure<true, false>(false)));
    if (result.isFailure()) {
      expect(result.error).to.be.false;
    } else {
      chai.assert(false);
    }
  });

  it('should not mapSuccess', () => {
    const r = makeTestModel();
    const result = r.mapSuccess(identity);
    expect(result.isFailure()).to.be.true;
    if (result.isFailure()) {
      expect(result.error).to.be.equal(FailureValue);
    } else {
      chai.assert(false);
    }
  });

  it('should mapFailure', () => {
    const r = makeTestModel();
    const result = r.mapFailure((x) => x * 2);
    expect(result.isFailure()).to.be.true;
    if (result.isFailure()) {
      expect(result.error).to.be.equal(FailureValue * 2);
    } else {
      chai.assert(false);
    }
  });

});

describe('Result.all', () => {

  it('should be successful when all are successful', () => {
    const results: Result<boolean, string>[] = [
      Result.success(true),
      Result.success(false),
      Result.success(true)
    ];
    const result = Result.all(results);
    expect(result.isSuccess()).to.be.true;
    expect(result.isFailure()).to.be.false;
    if (result.isSuccess()) {
      expect(result.value).to.be.deep.equal([true, false, true]);
    } else {
      chai.assert(false);
    }
  });

  it('should fail when even one fails', () => {
    const results: Result<boolean, string>[] = [
      Result.success(true),
      Result.failure('no'),
      Result.success(true)
    ];
    const result = Result.all(results);
    expect(result.isSuccess()).to.be.false;
    expect(result.isFailure()).to.be.true;
    if (result.isFailure()) {
      expect(result.error).to.be.deep.equal(['no']);
    } else {
      chai.assert(false);
    }

  })

});