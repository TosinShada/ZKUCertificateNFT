// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZKUNFT is ERC721, Ownable {
    mapping(address => mapping(string => uint256)) public claimed;
    mapping(address => bool) private admins;
    mapping(string => Cohort) public cohorts;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;

    string contractBaseURI;
    bool allowsTransfers = false;

    // This will enable the contract group NFTs into different cohort with their own whil=telisted addresses
    struct Cohort {
        uint128 limit;
        uint128 tokenMinted;
        bytes32 merkleRoot;
        bytes32[] whitelistedAddresses;
    }

    event Claim(
        address indexed _receiver,
        string indexed _cohortId,
        uint128 _cohortIndex,
        uint256 _contractIndex,
        bool _isAdmin
    );

    constructor(string memory _contractBaseURI)
        ERC721("zku", "ZKU")
    {
        admins[msg.sender] = true;
        contractBaseURI = _contractBaseURI;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender] == true);
        _;
    }

    modifier limitCheck(string memory _cohortId, address to) {
        require(
            cohorts[_cohortId].tokenMinted < cohorts[_cohortId].limit,
            "ZKU: max tokens issued for cohort"
        );
        require(
            claimed[to][_cohortId] == 0,
            "ZKU: address has already claimed token."
        );
        _;
    }

    modifier merkleCheck(
        string memory _cohortId,
        bytes32[] memory _proof,
        address to
    ) {
        bytes32 leaf = keccak256(abi.encodePacked(to));
        require(
            MerkleProof.verify(_proof, cohorts[_cohortId].merkleRoot, leaf),
            "ZKU: address not eligible for claim"
        );
        _;
    }

    function issueToken(
        string memory _cohortId,
        address to,
        bool _isAdmin
    ) internal limitCheck(_cohortId, to) returns (uint256) {
        uint128 nextCohortTokenIndex = cohorts[_cohortId].tokenMinted;
        string memory _uri = string(
            abi.encodePacked(
                contractBaseURI,
                _cohortId,
                "/metadata.json"
            )
        );

        uint256 newTokenId = _tokenIdTracker.current();
        claimed[to][_cohortId] = newTokenId;

        _safeMint(to, newTokenId);
        emit Claim(to, _cohortId, nextCohortTokenIndex, newTokenId, _isAdmin);

        _setTokenURI(newTokenId, _uri);

        cohorts[_cohortId].tokenMinted = nextCohortTokenIndex + 1;
        _tokenIdTracker.increment();

        return newTokenId;
    }

    function uint2str(uint128 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";

        uint128 j = _i;
        uint128 length;
        while (j != 0) {
            length++;
            j /= 10;
        }

        bytes memory bstr = new bytes(length);
        uint128 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + (j % 10)));
            j /= 10;
        }
        str = string(bstr);
        return str;
    }

    // This function will allow the admin to airdrop the token to a participant's address if the participant is in the whitelisted address list
    function adminClaimToken(
        string memory _cohortId,
        bytes32[] memory _proof,
        address to
    ) external onlyAdmin merkleCheck(_cohortId, _proof, to) returns (uint256) {
        return issueToken(_cohortId, to, true);
    }

    // Same as the above but this will allow non-admin to claim the token. The signer's address needs to be whitelisted
    function claimToken(string memory _cohortId, bytes32[] memory _proof)
        external
        merkleCheck(_cohortId, _proof, msg.sender)
        returns (uint256)
    {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(
            MerkleProof.verify(_proof, cohorts[_cohortId].merkleRoot, leaf),
            "ZKU: address not eligible for claim"
        );

        return issueToken(_cohortId, msg.sender, false);
    }

    // Right now the NFTs are non-transferrable as we expect that only those that did the course and completed all the milestones should be able to hold the token. However, in the event that we want to make it transferrable, this function will allow us do that.
    function setAllowsTransfers(bool _allowsTransfers) external onlyAdmin {
        allowsTransfers = _allowsTransfers;
    }

    // This is where the cohorts are created and addresses whitelisted
    function createCohort(
        string memory _cohortId,
        uint128 _limit,
        bytes32 _merkleRoot,
        bytes32[] memory _whitelistedAddresses
    ) external onlyAdmin {
        require(
            cohorts[_cohortId].limit == 0,
            "ZKU: Cohort already exists"
        );
        require(_limit > 0, "ZKU: Limit must be greater than 0");
        Cohort memory cohort = Cohort(_limit, 0, _merkleRoot, _whitelistedAddresses);
        cohorts[_cohortId] = cohort;
    }

    // In the event that a mistake was made, the merkle root for the cohort can be changed
    function setMerkleRoot(string memory _cohortId, bytes32 _merkleRoot)
        external
        onlyAdmin
    {
        require(
            cohorts[_cohortId].limit > 0,
            "ZKU: No cohort limit set"
        );
        cohorts[_cohortId].merkleRoot = _merkleRoot;
    }

    // In the event that a mistake was made, the whitelisted addresses for the cohort can be changed by the admin
    function setWhitelist(string memory _cohortId, bytes32[] memory _whitelistedAddresses, uint128 _limit)
        external
        onlyAdmin
    {
        require(
            cohorts[_cohortId].limit > 0,
            "ZKU: No cohort limit set"
        );
        cohorts[_cohortId].whitelistedAddresses = _whitelistedAddresses;
        cohorts[_cohortId].limit = _limit;
    }

    function _getCohortDetails(string memory _cohortId) external view returns (bytes32[] memory, bytes32) {
        return (cohorts[_cohortId].whitelistedAddresses, cohorts[_cohortId].merkleRoot);
    }

    // This function allows an existing admin to add new admins
    function updateAdmin(address _admin, bool isAdmin) external onlyOwner {
        admins[_admin] = isAdmin;
    }

    // An override function to prevent token transfer
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        require(
            from == address(0) || to == address(0) || allowsTransfers,
            "Not allowed to transfer"
        );
        return super._beforeTokenTransfer(from, to, tokenId);
    }
}