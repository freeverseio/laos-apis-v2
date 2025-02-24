# migrations



## Quickstart with Laos Mainnet

1. **Specify the DB** where the migrations will be applied in the `.env` file.
   - Use `example.env` as a reference.

2. **Execute the following commands**:

```bash

# 2. Install dependencies
npm ci

# 3. Clean previous processes
node run typeorm:migrate

```

