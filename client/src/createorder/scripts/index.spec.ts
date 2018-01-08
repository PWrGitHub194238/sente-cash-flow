// Imports functions from index.ts to be tested.
import { mochaTests } from './index';
// Imports 'expect' function to write BDD assertions
import { expect } from 'chai';
// Imports mocha testing framework.
import 'mocha';

describe('getArrayElement - unique key', () => {
  it('should return a first element from an array or null, based on given callback', () => {

    let array = [
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
        { key: "key3", value: "value3" },
        { key: "key4", value: "value3" },
        { key: "key5", value: "value4" },
    ];

    let callback = (element) => {
        return element.key === "key4";
    };

    const result = mochaTests.getArrayElement(array, callback);

    expect(result.value).to.equal("value3");
  });
});

describe('getArrayElement - multiple value', () => {
  it('should return a first element from an array or null, based on given callback', () => {

    let array = [
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
        { key: "key3", value: "value3" },
        { key: "key4", value: "value3" },
        { key: "key5", value: "value4" },
    ];

    let callback = (element) => {
        return element.value === "value3";
    };

    const result = mochaTests.getArrayElement(array, callback);

    expect(result.key).to.equal("key3");
  });
});


describe('getArrayElement - firts element', () => {
    it('should return a first element from an array or null, based on given callback', () => {
  
      let array = [
          { key: "key1", value: "value1" },
          { key: "key2", value: "value2" },
          { key: "key3", value: "value3" },
          { key: "key4", value: "value3" },
          { key: "key5", value: "value4" },
      ];
  
      let callback = (element) => {
          return true;
      };
  
      const result = mochaTests.getArrayElement(array, callback);
  
      expect(result.key).to.equal("key1");
    });
  });

describe('getArrayElement - null', () => {
    it('should return a first element from an array or null, based on given callback', () => {
  
      let array = [
          { key: "key1", value: "value1" },
          { key: "key2", value: "value2" },
          { key: "key3", value: "value3" },
          { key: "key4", value: "value3" },
          { key: "key5", value: "value4" },
      ];
  
      let callback = (element) => {
          return false;
      };
  
      const result = mochaTests.getArrayElement(array, callback);
  
      expect(result).to.be.null;
    });
  });