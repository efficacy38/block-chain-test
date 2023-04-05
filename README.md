# block-chain-learn

This is the exercise of NCNU block-chain Course.

## Check it no github page
[My Faucet](http://efficacy38.me/block-chain-test)

## Project Setup
- deploy smart contract
    ```sh
    cd ./truffle
    # this is for testing env
    truffle migrate --network development
    # this is for sepolia test net
    truffle migrate --network sepolia
    ```
- install dependency
    ```sh
    npm install
    npm install --dev
    ```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Deploy it to github pages
```sh
npm run deploy
```
