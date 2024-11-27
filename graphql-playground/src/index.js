import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { explorerPlugin } from '@graphiql/plugin-explorer';
import 'graphiql/graphiql.css';
import '@graphiql/plugin-explorer/dist/style.css';
import './index.css';

// const graphqlEndpoint = process.env.REACT_APP_GQL_URL;
const graphqlEndpoint = window._env_.REACT_APP_GQL_URL || 'default_url';
const fetcher = createGraphiQLFetcher({ url: graphqlEndpoint });
const explorer = explorerPlugin();
const query = `
  
mutation MyMutation {
  mint(
    input: {
      chainId: "137"
      contractAddress: "0x5c075b1bf679ab50930a94ac008742e01d77a3bb"
      tokens: [
        {
          mintTo: ["0x883FE5b3766155f075a8E1f207a9689294fE528f"]
          name: "Celestial Phoenix"
          description: "A mythical bird reborn from its ashes, representing eternal life."
          attributes: [
            {
              trait_type: "mythical creature"
              value: "phoenix"
            }
          ]
          image: "ipfs://QmPbxeGcXhYQQNgsC6a36dDyYUcHgMLnGKnF8pVFmGsvqi"
        }
      ]
    }
  ) {
    tokenIds
    success
  }
}

query MyQuery {
  __typename ## Placeholder value
} 
       `

const querySimple = `query MyQuery {
        __typename ## Placeholder value
      }
        
      mutation MyMutation {
        __typename ## Placeholder value
      }`
const PlaygroundComponent = () => (
  <GraphiQL fetcher={fetcher} 
  plugins={[explorer]} 
  visiblePlugin={explorer} 
  defaultHeaders={'{"x-api-key": "my-secret-api-key"}'}
  query={query} 
  />
);

const root = createRoot(document.getElementById('root'));
root.render(<PlaygroundComponent />);