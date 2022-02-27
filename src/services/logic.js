import { ethers } from "ethers"
import { keccak256 } from "ethers/lib/utils"
import { MerkleTree } from "merkletreejs"
import ZKUNFT from "../artifacts/contracts/ZKUNFT.sol/ZKUNFT.json"

const contractAddress = "0x4ef1e5d509E9c2e3f39f1c8399e644063408d612"
const buf2hex = (x) => `0x${x.toString("hex")}`

// get the smart contract
// eslint-disable-next-line no-unused-vars
let contract

export async function connectContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // get the end user
    const signer = provider.getSigner()

    contract = new ethers.Contract(contractAddress, ZKUNFT.abi, signer)
}

export async function createCohort(request) {
    try {
        const { cohortId, limit, whitelistedAddresses } = request
        connectContract()

        const wlAddressesArray = whitelistedAddresses.split(",")
        const limitNumber = parseInt(limit)

        const leaves = wlAddressesArray.map((v) => keccak256(v))
        const tree = new MerkleTree(leaves, keccak256, { sort: true })
        const root = tree.getHexRoot()

        const tx = await contract
            .createCohort(cohortId, limitNumber, root, leaves)
            .catch((err) => {
                throw err
            })
        await tx.wait()
        const response = { merkleRoot: root }
        return response
    } catch (err) {
        return { error: err }
    }
}

export async function adminClaimToken(request) {
    const { cohortId, address } = request
    connectContract()

    const data = await contract._getCohortDetails(cohortId)

    const leaves = data[0]
    const root = data[1]

    if (
        leaves.length < 1 ||
        root ===
            "0x0000000000000000000000000000000000000000000000000000000000000000"
    ) {
        return null
    }

    const tree = new MerkleTree(leaves, keccak256, { sort: true })
    const internalRoot = tree.getHexRoot()

    if (internalRoot !== root) {
        return null
    }

    const proof = tree.getProof(keccak256(address)).map((x) => buf2hex(x.data))

    const tx = await contract
        .adminClaimToken(cohortId, proof, address)
        .catch((err) => {
            console.log(err)
            return null
        })
    const response = await tx.wait()
    return response
}
