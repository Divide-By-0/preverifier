/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");

const main = async () => {
  console.log("\n\n 📡 Deploying...\n");

  // const yourContract = await deploy("YourContract"); // <-- add in constructor args like line 16 vvvv
  const verifier = await deploy("Verifier"); // <-- add in constructor args like line 16 vvvv
  const answer = await verifier.verifyProof(
    [0, 0],
    [
      [0, 0],
      [0, 0],
    ],
    [0, 0],
    [0]
  );
  console.log("Answer %d", answer);
  const answerProof = await verifier.verifyProof(
    [
      "4361411925896965367605188229838998950263853136855346992467135739885658267696",
      "13257099796368377884239053786098576403291418420491903938520425819032342163253",
    ],
    [
      [
        "355657094392399070471888802703298304910289742627615590482317587855574212887",
        "18902941826585626765735372290361041829879114965587413026743546969772770223876",
      ],
      [
        "13731278056551524092357955801477541602113079924446007945952289832061866034192",
        "13106205535807614907890129305427976444228090794559356293569824662995492606937",
      ],
    ],
    [
      "21774462880132019255699369884329895527898019522261256262898267301315861027775",
      "15614619098166954992718084438573501156888533386051577366658259130763179956607",
    ],
    [
      "7713112592372404476342535432037683616424591277138491596200192981572885523208",
    ]
  );
  console.log("Answer %d", answerProof);
  // const exampleToken = await deploy("ExampleToken")
  // const examplePriceOracle = await deploy("ExamplePriceOracle")
  // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])

  /*

  //If you want to send some ETH to a contract on deploy (make your constructor payable!)

  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*

  //If you want to send value to an address from the deployer

  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

const deploy = async (contractName, _args = [], overrides = {}) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName);
  const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
  const encoded = abiEncodeArgs(deployed, contractArgs);
  fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

  console.log(
    " 📄",
    chalk.cyan(contractName),
    "deployed to:",
    chalk.magenta(deployed.address)
  );

  if (!encoded || encoded.length <= 2) return deployed;
  fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

  return deployed;
};

// ------ utils -------

// abi encodes contract arguments
// useful when you want to manually verify the contracts
// for example, on Etherscan
const abiEncodeArgs = (deployed, contractArgs) => {
  // not writing abi encoded args if this does not pass
  if (
    !contractArgs ||
    !deployed ||
    !R.hasPath(["interface", "deploy"], deployed)
  ) {
    return "";
  }
  const encoded = utils.defaultAbiCoder.encode(
    deployed.interface.deploy.inputs,
    contractArgs
  );
  return encoded;
};

// checks if it is a Solidity file
const isSolidity = (fileName) =>
  fileName.indexOf(".sol") >= 0 &&
  fileName.indexOf(".swp") < 0 &&
  fileName.indexOf(".swap") < 0;

const readArgsFile = (contractName) => {
  let args = [];
  try {
    const argsFile = `./contracts/${contractName}.args`;
    if (!fs.existsSync(argsFile)) return args;
    args = JSON.parse(fs.readFileSync(argsFile));
  } catch (e) {
    console.log(e);
  }
  return args;
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
