import { MeshPlugin, YamlConfig } from '@graphql-mesh/types';
import validateApiKey from './validateApiKey';

const authPlugin: MeshPlugin<YamlConfig.Plugin['config']> = {
  async onExecute({ args }) {
    const { contextValue, document } = args;
    const apiKey = contextValue.headers['x-api-key'];
    const operation = document.definitions.find(
      (def: any) => def.kind === 'OperationDefinition'
    );
    
    if (operation.operation === 'mutation') {
      if (!apiKey || apiKey === 'my-secret-api-key') {
        throw new Error('Invalid API key');
      }
    }
  },
 
};

export default authPlugin;