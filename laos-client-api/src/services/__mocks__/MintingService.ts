import { MintInput } from "../../types/graphql/inputs/MintInput";
import { MintResponse } from "../../types/graphql/outputs/MintOutput";

export const MintingService = jest.fn().mockImplementation(() => {
  return {
    mint: (input: MintInput, apiKey: string): Promise<MintResponse> => {
      return Promise.resolve({ tokenIds: ["12345"], numberOfTokens: 1, success: true });
    }
  };
});
