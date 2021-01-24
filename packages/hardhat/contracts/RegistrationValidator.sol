// ctrll pagedn pageup
pragma solidity >=0.5.16 <=0.7.3;
pragma experimental ABIEncoderV2;
import "./HashVerifier.sol";

contract RegistrationValidator {
    //////////////
    ///  TYPES ///
    //////////////
    struct Proof {
        uint[2] p1;
        uint[2][2] p2;
        uint[2] p3;
    }

    //////////////
    ///  VARS  ///
    //////////////

    // maps polls to a list of valid hashes
    mapping(string => uint[]) public registeredHashes;
    bool public DISABLE_ZK_CHECK;
    uint256 pfsVerified;

    //////////////
    /// EVENTS ///
    //////////////

    event ProofVerified(uint256 pfsAccepted); // Question: use an event or an internal mapping?

    ////////////////
    /// Functions //
    ////////////////
    function checkHashProof(
        uint256[2] memory _a,
        uint256[2][2] memory _b,
        uint256[2] memory _c,
        uint256[2] memory _input
    ) public returns (bool success) {
        HashVerifier verifier = new HashVerifier();
        require(verifier.verifyProof(_a, _b, _c, _input),
            "Failed init proof check"
        );
        pfsVerified += 1;
        emit ProofVerified(pfsVerified);
        return true;
    }

    function verifyAndStore(Proof memory keyHashProof, Proof memory passwordHashProof, uint hashedKey, uint hashedPass, string memory pollName) public returns (bool success) {
        require(checkHashProof(passwordHashProof.p1, passwordHashProof.p2, passwordHashProof.p3, [hashedPass, hashedPass]), "Password proof invalid!");
        require(checkHashProof(keyHashProof.p1, keyHashProof.p2, keyHashProof.p3, [hashedKey, hashedKey]), "Key proof invalid!");
        registeredHashes[pollName].push(hashedKey);
        return true;
    }
}
