import { ethers } from "ethers"
import { keccak256 } from "ethers/lib/utils"
import { MerkleTree } from "merkletreejs"
import ZKUNFT from "../artifacts/contracts/ZKUNFT.sol/ZKUNFT.json"

const contractAddress = "0x16e7A9cCA4856A7c1E3a9fef0E74C45269B2Df13"
const buf2hex = (x) => `0x${x.toString("hex")}`

// get the smart contract
// eslint-disable-next-line no-unused-vars
let contract
let signer

export async function connectContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // get the end user
    signer = provider.getSigner()

    contract = new ethers.Contract(contractAddress, ZKUNFT.abi, signer)
}

export async function createCohort(request) {
    try {
        const { cohortId, limit, whitelistedAddresses, ipfsHash } = request
        connectContract()

        const wlAddressesArray = whitelistedAddresses.split(",")
        const limitNumber = parseInt(limit)

        const leaves = wlAddressesArray.map((v) => keccak256(v))
        const tree = new MerkleTree(leaves, keccak256, { sort: true })
        const root = tree.getHexRoot()

        await contract
            .createCohort(cohortId, limitNumber, root, leaves, ipfsHash)
            .catch((err) => {
                throw err
            })
        const response = { merkleRoot: root }
        return response
    } catch (err) {
        return { error: err }
    }
}

export async function createAdmin(request) {
    try {
        const { walletAddress } = request
        connectContract()

        await contract
            .updateAdmin(walletAddress, true)
            .catch((err) => {
                throw err
            })
        return true
    } catch (err) {
        return false
    }
}

export async function adminClaimToken(request) {
    const { cohortId, address } = request
    connectContract()

    const data = await contract._getCohortDetails(cohortId)

    const leaves = data[0]
    const root = data[1]
    const ipfsHash = data[2]

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

    const response = await contract
        .adminClaimToken(cohortId, proof, address, ipfsHash)
        .catch((err) => {
            console.log(err)
            return null
        })
    return response
}

export async function studentClaimToken(request) {
    const { cohortId } = request
    connectContract()

    const data = await contract._getCohortDetails(cohortId)

    const leaves = data[0]
    const root = data[1]
    const ipfsHash = data[2]

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

    const address = await signer.getAddress()
    console.log('Address', address)

    const proof = tree.getProof(keccak256(address)).map((x) => buf2hex(x.data))

    const response = await contract
        .claimToken(cohortId, proof, ipfsHash)
        .catch((err) => {
            console.log(err)
            return null
        })
    return response
}

export async function UpdateWhitelistField(request) {
    try {
        const { cohortId, limit, whitelistedAddresses } = request
        connectContract()

        const wlAddressesArray = whitelistedAddresses.split(",")
        const limitNumber = parseInt(limit)

        const leaves = wlAddressesArray.map((v) => keccak256(v))
        const tree = new MerkleTree(leaves, keccak256, { sort: true })
        const root = tree.getHexRoot()

        await contract
            .setWhitelist(cohortId, leaves, limitNumber)
            .catch((err) => {
                throw err
            })
            
        await contract
            .setMerkleRoot(cohortId, root)
            .catch((err) => {
                throw err
            })

        const response = { merkleRoot: root }
        return response
    } catch (err) {
        return { error: err }
    }
}