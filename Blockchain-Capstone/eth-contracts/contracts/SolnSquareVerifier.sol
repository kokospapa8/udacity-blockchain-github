pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./ERC721Mintable.sol";
import "./verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is Verifier, KOKOToken {
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        bytes32 index;
        address addr;
        uint256 tokenId;
        bool exist;
    }
    // TODO define an array of the above struct
    mapping(uint256 => Solution) solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) private uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(bytes32 key, address addr, uint256 tokenId);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
        address addr,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));
        require(!uniqueSolutions[key], "solution already used before");
        bool isValidProof = verifyTx(a, b, c, input);
        require(isValidProof, "proof is not valid!");

        Solution memory solution = Solution(key, addr, tokenId, true);
        solutions[tokenId] = solution;
        uniqueSolutions[key] = true;
        emit SolutionAdded(key, addr, tokenId);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(address to, uint256 tokenId) public returns (bool) {
        require(solutions[tokenId].exist, "solution already used before");
        return super.mint(to, tokenId);
    }
}
