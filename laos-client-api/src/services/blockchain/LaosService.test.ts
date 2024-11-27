import { ethers } from "ethers";
import { LaosService } from "./LaosService"; 
import { IPFSService } from "../ipfs/IPFSService"; 
import { MintSingleNFTParams, EvolveNFTParams } from "../../types";
import * as EvolutionCollection from "../../abi/EvolutionCollection";


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
    const params: MintSingleNFTParams = {
      laosContractAddress: "mockMinterLaosCollection",
      to: "0x123",
      assetMetadata: {
        name: "Test NFT",
        description: "A test NFT",
        image: "ipfs://testImage",
        attributes: [],
      },
    };

    mockWallet.getNonce = jest.fn().mockResolvedValue(1);
    mockIPFSService.uploadAssetMetadataToIPFS = jest.fn().mockResolvedValue("mockIpfsCid");
    mockContract.mintWithExternalURI.mockResolvedValue({
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
    (EvolutionCollection.events.MintedWithExternalURI.decode as jest.Mock).mockReturnValue({ _tokenId: BigInt(0) });

    const result = await laosService.mint(params, '550e8400-e29b-41d4-a716-446655440001');

    expect(result).toEqual({
      status: "success",
      tokenId: "0",
      tx: "mockHash",
    });
  });

  it("should fail to mint an NFT", async () => {
    const params: MintSingleNFTParams = {
      laosContractAddress: "mockMinterLaosCollection",
      to: "0x123",
      assetMetadata: {
        name: "Test NFT",
        description: "A test NFT",
        image: "ipfs://testImage",
        attributes: [],
      },
    };

    mockWallet.getNonce = jest.fn().mockResolvedValue(1);
    mockIPFSService.uploadAssetMetadataToIPFS = jest.fn().mockResolvedValue("mockIpfsCid");
    mockContract.mintWithExternalURI.mockRejectedValue(new Error("Mint failed"));
    mockProvider.waitForTransaction = jest.fn();

    const result = await laosService.mint(params, '550e8400-e29b-41d4-a716-446655440001');

    expect(result).toEqual({
      status: "failed",
      tx: undefined,
      error: "Mint failed",
    });
  });

  it("should evolve an NFT successfully", async () => {
    const params: EvolveNFTParams = {
      laosContractAddress: "mockMinterLaosCollection",
      tokenId: "0",
      assetMetadata: {
        name: "Test NFT",
        description: "A test NFT",
        image: "ipfs://testImage",
        attributes: [],
      },
    };

    mockWallet.getNonce = jest.fn().mockResolvedValue(1);
    mockIPFSService.uploadAssetMetadataToIPFS = jest.fn().mockResolvedValue("mockIpfsCid");
    mockContract.evolveWithExternalURI.mockResolvedValue({
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
    mockProvider.waitForTransaction = jest.fn().mockResolvedValue({
        status: 1,
        logs: [
        {
          topics: ["0xMockTopic"],
          data: "0xMockData",
        },
      ],
    });
    (EvolutionCollection.events.EvolvedWithExternalURI.decode as jest.Mock).mockReturnValue({ _tokenId: BigInt(0) });

    const result = await laosService.evolve(params, '550e8400-e29b-41d4-a716-446655440001');

    expect(result).toEqual({
      status: "success",
      tokenId: "0",
      tokenUri: "ipfs://mockIpfsCid",
      tx: "mockHash",
    });
  });

  it("should fail to evolve an NFT", async () => {
    const params: EvolveNFTParams = {
      laosContractAddress: "mockMinterLaosCollection",
      tokenId: "0",
      assetMetadata: {
        name: "Test NFT",
        description: "A test NFT",
        image: "ipfs://testImage",
        attributes: [],
      },
    };

    mockWallet.getNonce = jest.fn().mockResolvedValue(1);
    mockIPFSService.uploadAssetMetadataToIPFS = jest.fn().mockResolvedValue("mockIpfsCid");
    mockContract.evolveWithExternalURI.mockRejectedValue(new Error("Evolve failed"));
    mockProvider.waitForTransaction = jest.fn();

    const result = await laosService.evolve(params, '550e8400-e29b-41d4-a716-446655440001');

    expect(result).toEqual({
      status: "failed",
      tx: undefined,
      error: "Evolve failed",
    });
  });

});