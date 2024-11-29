import { mapToOwnershipContract, createOwnershipContractsModel } from './ownershipContractMapper';
import { RawOwnershipContract, OwnershipContract } from '../../model';

describe('mapToOwnershipContract', () => {
  it('should map RawOwnershipContract to OwnershipContract correctly', () => {
    const raw: RawOwnershipContract = {
      id: '0xfec1af3e023432ef364ef88653094442cfc00020',
      laosContract: '0xffffFfFFFFfFffFffffffFFe0000000000000354',
      bytecodeHash: null,
      name: null,
      symbol: null
    };

    const expected = new OwnershipContract({
      id: '0xfec1af3e023432ef364ef88653094442cfc00020',
      laosContract: '0xffffFfFFFFfFffFffffffFFe0000000000000354',
      assets: [],
      bytecodeHash: null,
      name: null,
      symbol: null
    });

    const result = mapToOwnershipContract(raw);
    
    expect(result).toEqual(expected);
  });
});

describe('createOwnershipContractsModel', () => {
  it('should map an array of RawOwnershipContract to an array of OwnershipContract correctly', () => {
    const rawOwnershipContracts: RawOwnershipContract[] = [
      {
        id: '0xfec1af3e023432ef364ef88653094442cfc00020',
        laosContract: '0xffffFfFFFFfFffFffffffFFe0000000000000354',
        bytecodeHash: null,
        name: null,
        symbol: null
      },
      {
        id: '0xe3f5d',
        laosContract: '0xffffFfFFFFfFffFffffffFFe0000000000000355',
        bytecodeHash: null,
        name: null,
        symbol: null
      },
    ];

    const expected: OwnershipContract[] = [
      new OwnershipContract({
        id: '0xfec1af3e023432ef364ef88653094442cfc00020',
        laosContract: '0xffffFfFFFFfFffFffffffFFe0000000000000354',
        assets: [],
        bytecodeHash: null,
        name: null,
        symbol: null
      }),
      new OwnershipContract({
        id: '0xe3f5d',
        laosContract: '0xffffFfFFFFfFffFffffffFFe0000000000000355',
        assets: [],
        bytecodeHash: null,
        name: null,
        symbol: null
      }),
    ];

    const result = createOwnershipContractsModel(rawOwnershipContracts);
    expect(result).toEqual(expected);
  });
});
