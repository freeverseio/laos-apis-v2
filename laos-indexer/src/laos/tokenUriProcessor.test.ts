import { formatError } from './tokenUriProcessor';

describe('formatError', () => {
  it('should format error', async () => {
    const error = new Error('test error');
    error.stack = 'test stack';
    const formattedError = formatError(error);
    console.log(formattedError);
    expect(formattedError).toContain('Error: test error');
    expect(formattedError).toContain('Stack: test stack');
  });

  it('should format error with no stack', async () => {
    const error = new Error('test error');
    const formattedError = formatError(error);
    expect(formattedError).toContain('Error: test error');
  });

  it('should format undefined error', async () => {
    const formattedError = formatError(undefined as any);
    expect(formattedError).toContain('Error: undefined');
  });

  it('should format error with an custom object', async () => { 
    const error = { };
    const formattedError = formatError(error as any);
    expect(formattedError).toContain('Error: undefined');
  });
    
});