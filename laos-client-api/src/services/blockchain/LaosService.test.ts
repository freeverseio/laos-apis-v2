import { ethers } from "ethers";
import { LaosService } from "./LaosService"; 
import { IPFSService } from "../ipfs/IPFSService"; 
import { MintSingleNFTParams, EvolveNFTParams, EvolveBatchResult, BatchMintNFTParams } from "../../types";
import { TransactionReceiptType } from "../../types/graphql/outputs/MintOutput";
import * as EvolutionCollection from "../../abi/EvolutionCollection";
import { AttributeInput,  } from "../../types/graphql/inputs/MintInput";


jest.mock("../../types/graphql/outputs/MintOutput", () => ({
  TransactionReceiptType: jest.fn(),
}));
jest.mock("../../types/graphql/inputs/MintInput", () => ({
  AttributeInput: jest.fn(),
}));

jest.mock("../../types/graphql/outputs/EvolveOutput", () => ({
  EvolveResponse: jest.fn(),
}));

jest.mock("ethers");
jest.mock("../ipfs/IPFSService");
jest.mock("../../abi/EvolutionCollection", () => ({
  events: {
    MintedWithExternalURI: {
      decode: jest.fn(),
    },
    EvolvedWithExternalURI: {
      decode: jest.fn(),
    },
  },
}));

const mockEventNameToEventTypeMap = {
  MintedWithExternalURI: {
    decode: jest.fn(),
  },
  EvolvedWithExternalURI: {
    decode: jest.fn(),
  },
};

describe("LaosService", () => {
  let mockProvider: jest.Mocked<ethers.JsonRpcProvider>;
  let mockWallet: jest.Mocked<ethers.Wallet>;
  let mockContract: jest.Mocked<ethers.Contract>;
  let mockIPFSService: jest.Mocked<IPFSService>;
  let laosService: LaosService;

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockProvider = new ethers.JsonRpcProvider() as jest.Mocked<ethers.JsonRpcProvider>;
    mockWallet = new ethers.Wallet("mockPrivateKey", mockProvider) as jest.Mocked<ethers.Wallet>;
    
    // Mock the methods of ethers.Contract
    mockContract = {
      mintWithExternalURI: jest.fn(),
      evolveWithExternalURI: jest.fn(),
      evolveWithExternalURIBatch: jest.fn(),
      mintWithExternalURIBatch: jest.fn(),
    } as unknown as jest.Mocked<ethers.Contract>;

    mockIPFSService = new IPFSService("mockApiKey", "mockApiSecret") as jest.Mocked<IPFSService>;

    const config = {
      minterPvks: "mockPrivateKey",
      rpcMinter: "mockRpcMinter",
    };

    laosService = new LaosService(config, mockIPFSService);
    (laosService as any).provider = mockProvider;
    (laosService as any).wallet = mockWallet;
    (laosService as any).contract = mockContract;
    (laosService as any).eventNameToEventTypeMap = mockEventNameToEventTypeMap;
    (laosService as any).getEthersContract = jest.fn().mockReturnValue(mockContract);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should mint an NFT successfully", async () => {
    const params: BatchMintNFTParams  = {
      laosBatchMinterContractAddress: "mockMinterLaosCollection",
      tokens: [
        {
          mintTo: "0xAB95002fe661Dc5168b29307098E5985A3295232",
          tokenUri: "ipfs://testImage",
        },
      ],
    };

    mockWallet.getNonce = jest.fn().mockResolvedValue(1);
    mockIPFSService.uploadAssetMetadataToIPFS = jest.fn().mockResolvedValue("mockIpfsCid");
    mockIPFSService.getCid = jest.fn().mockResolvedValue("mockIpfsCid");
    mockContract.mintWithExternalURIBatch.mockResolvedValue({
      hash: "mockHash",
      wait: jest.fn().mockResolvedValue({
        status: 1,
        logs: [
          {
            topics: ["0xMockTopic"],
            data: "0xMockData",
          },
        ],
      }),
    });
    mockProvider.waitForTransaction = jest.fn().mockResolvedValue({
        status: 1,
        logs: [
        {
          topics: ["0xMockTopic"],
          data: "0xMockData",
        },
      ],
    });
    (EvolutionCollection.events.MintedWithExternalURI.decode as jest.Mock).mockReturnValue({ _tokenId: BigInt(1) });

    const result = await laosService.batchMint(params, '550e8400-e29b-41d4-a716-446655440001');

    expect(result).toEqual({
      numberOfTokens: 1,
      status: "success",
      tokenIds: ["1"],
      tx: "mockHash",
    });
  });

  

  it("should evolve NFTs in a batch successfully", async () => {
    const params: EvolveNFTParams = {
      laosContractAddress: "mockMinterLaosCollection",
      tokens: [
        {
          tokenId: "0",
          assetMetadata: {
            name: "Test NFT",
            description: "A test NFT",
            image: "ipfs://testImage",
            attributes: [],
          },
        },
        {
          tokenId: "1",
          assetMetadata: {
            name: "Test NFT 2",
            description: "A test NFT 2",
            image: "ipfs://testImage2",
            attributes: [],
          },
        },
      ],
    };

    mockWallet.getNonce = jest.fn().mockResolvedValue(1);
    mockIPFSService.uploadAssetMetadataToIPFS = jest.fn().mockResolvedValueOnce("mockIpfsCid1").mockResolvedValueOnce("mockIpfsCid2");
    mockIPFSService.getCid = jest.fn().mockResolvedValueOnce("mockIpfsCid1").mockResolvedValueOnce("mockIpfsCid2");
    mockContract.evolveWithExternalURIBatch.mockResolvedValue({
      hash: "mockHash",
      wait: jest.fn().mockResolvedValue({
        status: 1,
        logs: [
          {
            topics: ["0xMockTopic"],
            data: "0xMockData",
          },
          {
            topics: ["0xMockTopic"],
            data: "0xMockData",
          },
        ],
      }),
    });
    mockProvider.waitForTransaction = jest.fn().mockResolvedValue({
      status: 1,
      logs: [
        {
          topics: ["0xMockTopic"],
          data: "0xMockData",
        },
        {
          topics: ["0xMockTopic"],
          data: "0xMockData",
        },
      ],
    });
    (EvolutionCollection.events.EvolvedWithExternalURI.decode as jest.Mock).mockReturnValueOnce({ _tokenId: BigInt(0) }).mockReturnValueOnce({ _tokenId: BigInt(1) });

    const result = await laosService.evolveBatch(params, '550e8400-e29b-41d4-a716-446655440001');
    expect(result).toEqual({
      status: "success",
      tokens: [
        { tokenId: "0", tokenUri: "ipfs://mockIpfsCid1" },
        { tokenId: "1", tokenUri: "ipfs://mockIpfsCid2" },
      ],
      tx: "mockHash",
    });
  });

  it("should fail to evolve NFTs in a batch", async () => {
    const params: EvolveNFTParams = {
      laosContractAddress: "mockMinterLaosCollection",
      tokens: [
        {
          tokenId: "0",
          assetMetadata: {
            name: "Test NFT",
            description: "A test NFT",
            image: "ipfs://testImage",
            attributes: [],
          },
        },
      ],
    };

    mockWallet.getNonce = jest.fn().mockResolvedValue(1);
    mockIPFSService.uploadAssetMetadataToIPFS = jest.fn().mockResolvedValue("mockIpfsCid");
    mockIPFSService.getCid = jest.fn().mockResolvedValue("mockIpfsCid");
    mockContract.evolveWithExternalURIBatch.mockRejectedValue(new Error("Evolve failed"));
    mockProvider.waitForTransaction = jest.fn();

    const result = await laosService.evolveBatch(params, '550e8400-e29b-41d4-a716-446655440001');

    expect(result).toEqual({
      status: "failed",
      tokens: [],
      tx: undefined,
      error: "Evolve failed",
    });
  });

});

describe("LaosService", () => {
  let laosService: LaosService;
  let mockIPFSService: jest.Mocked<IPFSService>;

  beforeEach(() => {
    //jest.spyOn(console, "log").mockImplementation(() => {});
    //jest.spyOn(console, "error").mockImplementation(() => {});

    

    mockIPFSService = new IPFSService("mockApiKey", "mockApiSecret") as jest.Mocked<IPFSService>;

    const config = {
      minterPvks: "mockPrivateKey",
      rpcMinter: "mockRpcMinter",
    };

    laosService = new LaosService(config, mockIPFSService);
    
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      initOwner: "0x90abcdef1234567890abcdef1234567890abcdef",
      slot: '0x1234567890abcdef',
      expected: "1917151762750544880654683969214147817878133287987683378847961304559",
      expectedToHex: "0x000000001234567890abcdef90abcdef1234567890abcdef1234567890abcdef",
    },
    {
      initOwner: "0xffffffffffffffffffffffffffffffffffffffff",
      slot: 0,
      expected: "1461501637330902918203684832716283019655932542975",
      expectedToHex: "0x000000000000000000000000ffffffffffffffffffffffffffffffffffffffff",
    },
    {
      initOwner: "0x0000000000000000000000000000000000000000",
      slot: 0,
      expected: "0",
      expectedToHex: "0x0000000000000000000000000000000000000000000000000000000000000000",
    },    {
      initOwner: "0x0000000000000000000000000000000000000001",
      slot: 1,
      expected: "1461501637330902918203684832716283019655932542977",
      expectedToHex: "0x0000000000000000000000010000000000000000000000000000000000000001",
    },
    {
      initOwner: "0x1234567890abcdef1234567890abcdef12345678",
      slot: '0xffffffffffffffffffff',
      expected: "1766847064778384329583296143170286492852322417545392043886226158472418936",
      expectedToHex:"0x0000ffffffffffffffffffff1234567890abcdef1234567890abcdef12345678",
    },
  ];

  testCases.forEach((testCase) => {
    it(`should get token id from slot number ${testCase.slot}`, () => {
      const result = laosService.getTokenIdFromSlotNumber(testCase.initOwner, BigInt(testCase.slot));
      expect(result).toEqual(testCase.expected);
    });
  });

  it("should get token id from large slot number", () => {
    const randomSlot = 2174978765669407158848668786n
    console.log("randomSlot", Number(randomSlot));
    const result = laosService.getTokenIdFromSlotNumber("0x883FE5b3766155f075a8E1f207a9689294fE528f", randomSlot);
    expect(result).toEqual("3178735027185784784067903705027605327914747787316705371027793621268624724623");
  });
});
