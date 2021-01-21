// ctrll pagedn pageup
pragma solidity ^0.6.7;
pragma experimental ABIEncoderV2;
import "./Verifier.sol";

contract MessageValidator {

    //////////////
    ///  VARS  ///
    //////////////
    mapping(bytes32 => bool) public hashIsVerified; // public auto assigns a getter
    bool public DISABLE_ZK_CHECK;
    uint256 pfsVerified;

    //////////////
    ///  TYPES ///
    //////////////
    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }

    //////////////
    /// EVENTS ///
    //////////////

    event ProofVerified(uint256 pfsAccepted); // Question: use an event or an internal mapping?

    ////////////////
    /// Functions //
    ////////////////
    function checkProof(
        uint256[2] memory _a,
        uint256[2][2] memory _b,
        uint256[2] memory _c,
        uint256[1] memory _input
    ) internal returns (bool success) {
        // Verifier verifier = new Verifier();
        require(Verifier.verifyProof(_a, _b, _c, _input),
            "Failed init proof check"
        );
        pfsVerified += 1;
        emit ProofVerified(pfsVerified);
        return true;
    }

    function verifyAndAdd(Proof memory proof, uint input, string memory message) public returns (bool success) {
        uint[2] memory p1 = [proof.A.X, proof.A.Y];
        uint[2][2] memory p2 = [proof.B.X, proof.B.Y];
        uint[2] memory p3 = [proof.C.X, proof.C.Y];
        require(checkProof(p1, p2, p3, [input]), "Proof invalid!");
        hashIsVerified[keccak256(abi.encode(message))] = true;
        return true;
    }
}
