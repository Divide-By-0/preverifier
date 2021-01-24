const solc = require("solc");
const linker = require("solc/linker");
const Contract = require("web3-eth-contract");
const fs = require("fs");
const certPath = path.join(__dirname, "../myfolder/my_private_key.key");

const messageValidatorFile = fs
  .readFileSync("./MessageValidator.sol")
  .toString();
const verifierFile = fs.readFileSync("./Verifier.sol").toString();

Contract.setProvider("ws://localhost:8546");

const input1 = {
  language: "Solidity",
  sources: {
    "Verifier.sol": {
      content: verifierFile,
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
  else return { error: "File not found" };
}

const output1 = JSON.parse(
  solc.compile(JSON.stringify(input1), { import: findImports })
);
console.log("Output1", output1);
console.log("Output2", output1.contracts);
const verifierBytecode =
  output1.contracts["Verifier.sol"]["Verifier"].evm.bytecode.object;
const verifierAbi = output1.contracts["Verifier.sol"]["Verifier"].abi;
const pairingBytecode =
  output1.contracts["Verifier.sol"]["Pairing"].evm.bytecode.object;
const pairingAbi = output1.contracts["Verifier.sol"]["Pairing"].abi;
const verifierContract = new Contract(
  verifierAbi,
  "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe"
);
verifierContract.deploy({ data: verifierBytecode });
const pairingContract = new Contract(
  pairingAbi,
  "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAf"
);
pairingContract.deploy({ data: pairingBytecode });
console.log(pairingContract.options.address);

const output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports })
);
var messageValidatorBytecode =
  output.contracts["MessageValidator.sol"]["MessageValidator"].evm.bytecode
    .object;

messageValidatorBytecode = linker.linkBytecode(messageValidatorBytecode, {
  Verifier: "",
  Pairing: "[LIBRARY_ADDRESS]",
});

//console.log(bytecode);
//const contract = new Contract(bytecode);
//contract.deploy({ data: bytecode });
/*
for (var contractName in output.contracts['Verifier.sol']) {
  console.log(
    contractName +
      ': ' +
      output.contracts['Verifier.sol'][contractName].evm.bytecode.object
  );
}
const contract1 = new Contract(bytecode);

for (var contractName in output.contracts['MessageValidator.sol']) {
  console.log(
    contractName +
      ': ' +
      output.contracts['MessageValidator.sol'][contractName].evm.bytecode.object
  );
}
*/
