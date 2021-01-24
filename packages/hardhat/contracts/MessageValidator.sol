// ctrll pagedn pageup
pragma solidity >=0.5.16 <=0.7.3;
pragma experimental ABIEncoderV2;
import "./SigCheckVerifier.sol";

contract MessageValidator {
    //////////////
    ///  TYPES ///
    //////////////
    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }

    //////////////
    ///  VARS  ///
    //////////////
    mapping(bytes32 => bool) public hashIsVerified; // public auto assigns a getter
    uint256 pfsVerified;

    //////////////
    ///  LIBS  ///
    //////////////
    // using SigCheckVerifier for Proof;

    //////////////
    /// EVENTS ///
    //////////////

    event ProofVerified(uint256 pfsAccepted); // Question: use an event or an internal mapping?

    ////////////////
    /// Functions //
    ////////////////
    function checkSigCheckProof(
        uint256[2] memory _a,
        uint256[2][2] memory _b,
        uint256[2] memory _c,
        uint256[1] memory _input
    ) public returns (bool success) {
        SigCheckVerifier verifier = new SigCheckVerifier();
        require(verifier.verifyProof(_a, _b, _c, _input),
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
        require(checkSigCheckProof(p1, p2, p3, [input]), "Proof invalid!");
        hashIsVerified[keccak256(abi.encode(message))] = true;
        return true;
    }
}
