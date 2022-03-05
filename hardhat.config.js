require("@nomiclabs/hardhat-waffle")
// eslint-disable-next-line prefer-template
require("dotenv").config({ path: __dirname + "/.env" })

const accounts = [`0x${process.env.BACKEND_PRIVATE_KEY}`]

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.7.6",
    paths: {
        artifacts: "./src/artifacts"
    },
    networks: {
        testnet: {
            url: "https://api.s0.b.hmny.io",
            // eslint-disable-next-line object-shorthand
            accounts: accounts
        },
        mainnet: {
            url: "https://api.harmony.one",
            // eslint-disable-next-line object-shorthand
            accounts: accounts
        }
    }
}
