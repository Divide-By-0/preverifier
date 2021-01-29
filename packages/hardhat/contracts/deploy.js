const solc = require("solc");
const linker = require("solc/linker");
const Contract = require("web3-eth-contract");
const web3 = require("web3");
const fs = require("fs");
const path = require("path");

const messageValidatorPath = path.join(__dirname, "./MessageValidator.sol");
const verifierPath = path.join(__dirname, "./Verifier.sol");
const hashVerifierPath = path.join(__dirname, "./HashVerifier.sol");
const sigCheckVerifierPath = path.join(__dirname, "./SigCheckVerifier.sol");

const messageValidatorFile = fs.readFileSync(messageValidatorPath).toString();
const verifierFile = fs.readFileSync(verifierPath).toString();
const hashVerifierFile = fs.readFileSync(hashVerifierPath).toString();
const sigCheckVerifierFile = fs.readFileSync(sigCheckVerifierPath).toString();

Contract.setProvider("ws://localhost:8546");

const input1 = {
  language: "Solidity",
  sources: {
    "Verifier.sol": {
      content: verifierFile,
    },
    "HashVerifier.sol": {
      content: hashVerifierFile,
    },
    "SigCheckVerifier.sol": {
      content: sigCheckVerifierFile,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const input = {
  language: "Solidity",
  sources: {
    "MessageValidator.sol": {
      content: messageValidatorFile,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

function findImports(path) {
  if (path === "Verifier.sol")
    return {
      contents: verifierFile,
    };
  if (path === "HashVerifier.sol")
    return {
      contents: hashVerifierFile,
    };
  if (path === "SigCheckVerifier.sol")
    return {
      contents: sigCheckVerifierFile,
    };
  else return { error: "File not found" };
}

const output1 = JSON.parse(
  solc.compile(JSON.stringify(input1), { import: findImports })
);
const verifierBytecode =
  output1.contracts["Verifier.sol"]["Verifier"].evm.bytecode.object;
const verifierAbi = output1.contracts["Verifier.sol"]["Verifier"].abi;
const pairingBytecode =
  output1.contracts["Verifier.sol"]["Pairing"].evm.bytecode.object;
const pairingAbi = output1.contracts["Verifier.sol"]["Pairing"].abi;
const verifierContract = new Contract(
  verifierAbi,
  "0x587B3c7D9E252eFFB9C857eF4c936e2072b741a4"
);
verifierContract.deploy({ data: verifierBytecode });
const pairingContract = new Contract(
  pairingAbi,
  "0xC7367381394E7964156d9e8C236c1E1feB06AF1d"
);
pairingContract.deploy({ data: pairingBytecode });

const output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports })
);

const messageValidatorAbi =
  output.contracts["MessageValidator.sol"]["MessageValidator"].abi;
var messageValidatorBytecode =
  output.contracts["MessageValidator.sol"]["MessageValidator"].evm.bytecode
    .object;

messageValidatorBytecode = linker.linkBytecode(messageValidatorBytecode, {
  Verifier: verifierContract.options.address,
  Pairing: pairingContract.options.address,
});

// if you need to add parameters to the constructor
//messageValidatorBytecode = messageValidatorBytecode + web3.eth.abi.encodeParameters([address...], ['0x...']);
const contract = new Contract(messageValidatorAbi);
contract.deploy({ data: messageValidatorBytecode });