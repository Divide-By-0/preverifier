// ctrll pagedn pageup
pragma solidity 0.7.6; // >=0.5.16 <=
pragma experimental ABIEncoderV2;
import "./SigCheckVerifier.sol";
import "./HashVerifier.sol";
import "./ContractStorage.sol";

// Validates messages and registrations
contract CoreValidator {

    //////////////
    ///  LIBS  ///
    //////////////
    // using SigCheckVerifier for Proof;

    //////////////
    /// EVENTS ///
    //////////////

    event ProofVerified(uint256 pfsAccepted); // Question: use an event or an internal mapping?

    ////////////////
    /// Messages  //
    ////////////////
    function checkSigCheckProof(
        uint256[2] memory _a,
        uint256[2][2] memory _b,
        uint256[2] memory _c,
        uint256[2] memory _input
    ) public returns (bool success) {
        // SigCheckVerifier verifier = new SigCheckVerifier();
        require(SigCheckVerifier.verifyProof(_a, _b, _c, _input),
            "Failed init proof check"
        );
        pfsVerified += 1;
        emit ProofVerified(pfsVerified);
        return true;
    }

    function verifyAndAddMessage(Proof memory proof, uint[2] memory input, string memory message) public returns (bool success) {
        uint[2] memory p1 = [proof.A.X, proof.A.Y];
        uint[2][2] memory p2 = [proof.B.X, proof.B.Y];
        uint[2] memory p3 = [proof.C.X, proof.C.Y];
        require(checkSigCheckProof(p1, p2, p3, input), "Proof invalid!");
        hashIsVerified[keccak256(abi.encode(message))] = true;
        return true;
    }

    ///////////////////
    /// Registration //
    ///////////////////
    function checkHashProof(
        uint256[2] memory _a,
        uint256[2][2] memory _b,
        uint256[2] memory _c,
        uint256[2] memory _input
    ) public returns (bool success) {
        // HashVerifier verifier = new HashVerifier();
        require(HashVerifier.verifyProof(_a, _b, _c, _input),
            "Failed init proof check"
        );
        pfsVerified += 1;
        emit ProofVerified(pfsVerified);
        return true;
    }

    function verifyAndStoreRegistration(Proof memory keyHashProof, Proof memory passwordHashProof, uint hashedKey, uint hashedPass, string memory pollName) public returns (bool success) {
        require(checkHashProof(passwordHashProof.p1, passwordHashProof.p2, passwordHashProof.p3, [hashedPass, hashedPass]), "Password proof invalid!");
        require(checkHashProof(keyHashProof.p1, keyHashProof.p2, keyHashProof.p3, [hashedKey, hashedKey]), "Key proof invalid!");
        registeredHashes[pollName].push(hashedKey);
        return true;
    }
}
