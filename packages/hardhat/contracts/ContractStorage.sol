// ctrll pagedn pageup
pragma solidity 0.7.6; // >=0.5.16 <=
pragma experimental ABIEncoderV2;

contract ContractStorage {
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
}
