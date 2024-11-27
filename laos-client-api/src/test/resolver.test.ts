// src/tests/GraphQLAPI.test.ts
import 'reflect-metadata';
import request from 'supertest';
import { startTestServer } from './test-utils';
import { MintingService } from '../services/MintingService';

jest.mock('../services/MintingService');

describe('GraphQL API', () => {
  let url: string;
  let server: any;
  let mockMintingService: MintingService;

  beforeAll(async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockMintingService = new MintingService();
    const testServer = await startTestServer(mockMintingService);
    url = testServer.url;
    server = testServer.server;
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should return hello world', async () => {
    const response = await request(url)
      .post('/graphql')
      .send({
        query: '{ status }',
      });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('Up');
  });

  it('should mint a token successfully', async () => {
    const response = await request(url)
      .post('/graphql')
      .set('Authorization', 'API-KEY your-token-here')  // Adding the Authorization header
      .set('x-api-key', 'your-token-here')  // Adding the Authorization header
      .send({
        query: `mutation {
          mint(input: {
           chainId: "137",
           contractAddress: "0xaaf54526c508d573d402bf05a9a5e54f09302adf",
           tokens: [{
            mintTo: ["0x1B0b4a597C764400Ea157aB84358c8788A89cd28"],
            name: "Example Token",
            description: "This is an example token",
            attributes: [{trait_type:"health",value:"11"}],
            image: "https://ipfs.io/ipfs/Qm326uhnQp5PsnznQvHhkzqKLfB7ieWz3onmFXsRvERig",
           }],           
         }) {
           tokenIds
           success
         }
        }`
      });
    expect(response.status).toBe(200);
    expect(response.body.data.mint.tokenIds[0]).toBe('12345');
    expect(response.body.data.mint.success).toBe(true);
  });
});
