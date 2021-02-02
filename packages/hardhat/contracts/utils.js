const origCallArgsFromProofAndSignals = (snarkProof, publicSignals) => {
  // the object returned by genZKSnarkProof needs to be massaged into a set of parameters the verifying contract
  // will accept
  return [
    snarkProof.pi_a.slice(0, 2), // pi_a
    // genZKSnarkProof reverses values in the inner arrays of pi_b
    [
      snarkProof.pi_b[0].slice(0).reverse(),
      snarkProof.pi_b[1].slice(0).reverse(),
    ], // pi_b
    snarkProof.pi_c.slice(0, 2), // pi_c
    publicSignals.map((signal) => signal.toString(10)), // input
  ];
};

const callArgsFromProofAndSignals = (snarkProof, publicSignals) => {
  // the object returned by genZKSnarkProof needs to be massaged into a set of parameters the verifying contract
  // will accept
  return [
    [
      snarkProof.pi_a.slice(0, 2), // pi_a
      // genZKSnarkProof reverses values in the inner arrays of pi_b
      [
        snarkProof.pi_b[0].slice(0).reverse(),
        snarkProof.pi_b[1].slice(0).reverse(),
      ], // pi_b
      snarkProof.pi_c.slice(0, 2),
    ], // pi_c
    publicSignals.map((signal) => signal.toString(10)), // input
  ];
};

module.exports = {
  callArgsFromProofAndSignals,
};
