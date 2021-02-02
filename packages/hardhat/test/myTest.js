const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { callArgsFromProofAndSignals } = require("../contracts/utils");
const fs = require("fs");
const chalk = require("chalk");
const { config } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const { assert } = require("assert");

const { deploy } = require("../scripts/deploy.js");

use(solidity);

describe("My Dapp", async function () {
  before(async function () {
    let myContract;
    console.log("Running");
    this.pairing = await deploy("Pairing");
    this.sigCheckG1Points_0_to_209 = await deploy("SigCheckG1Points_0_to_209");
    this.sigCheckG1Points_210_to_419 = await deploy(
      "SigCheckG1Points_210_to_419"
    );
    this.sigCheckG1Points_420_to_629 = await deploy(
      "SigCheckG1Points_420_to_629"
    );
    this.sigCheckG1Points_630_to_826 = await deploy(
      "SigCheckG1Points_630_to_826"
    );

    this.sigCheckVerifier = await deploy(
      "SigCheckVerifier",
      [],
      {},
      {
        SigCheckG1Points_0_to_209: this.sigCheckG1Points_0_to_209.address,
        SigCheckG1Points_210_to_419: this.sigCheckG1Points_210_to_419.address,
        SigCheckG1Points_420_to_629: this.sigCheckG1Points_420_to_629.address,
        SigCheckG1Points_630_to_826: this.sigCheckG1Points_630_to_826.address,
      }
    );

    this.hashVerifier = await deploy(
      "HashVerifier",
      [],
      {},
      {
        // Pairing: pairing.address,
      }
    );

    this.coreValidator = await deploy(
      "CoreValidator",
      [],
      {},
      {
        SigCheckVerifier: this.sigCheckVerifier.address,
        HashVerifier: this.hashVerifier.address,
      }
    );
    // await this.coreValidator.createGroup("asdf", 1);
    // console.log(await this.coreValidator.getConfessions());
    // console.log(await this.coreValidator.getGroups());
    // console.error("65");
    // const sig_check_proof_json = JSON.parse(
    //   fs.readFileSync("json/sigCheckProof.json")
    // );
    // const sig_check_public_json = JSON.parse(
    //   fs.readFileSync("json/sigCheckPublic.json")
    // );
    // const hash_proof_json = JSON.parse(
    //   fs.readFileSync("json/sigCheckProof.json")
    // );
    // const hash_public_json = JSON.parse(
    //   fs.readFileSync("json/sigCheckPublic.json")
    // );
    // console.error("78");
    // const pollName = "myPoll";
    // const answerValid = await this.coreValidator.verifyAndStoreRegistration(
    //   ...callArgsFromProofAndSignals(hash_proof_json, hash_public_json),
    //   ...callArgsFromProofAndSignals(
    //     sig_check_proof_json,
    //     sig_check_public_json
    //   ),
    //   pollName
    // );
    // console.error("88");

    // const addedMessage = await this.coreValidator.verifyAndAddMessage(
    //   ...callArgsFromProofAndSignals(hash_proof_json, hash_public_json),
    //   "message"
    // );
    // const isRegistered = await this.coreValidator.checkIfHashRegisteredForPoll(
    //   pollName,
    //   hash_public_json[0]
    // );
    // assert(isRegistered == 1); // Pass
    // console.error("99");
    // console.log(answerValid);
    console.log("Done with init!");
  });

  describe("CoreValidator Tests", async function () {
    // describe("Getters and setters", async function () {
    //   it("Create Group", async function () {
    //     await this.coreValidator.createGroup("asdf", 1);
    //     console.log("Group created!");
    //   });
    //   it("Get Group", async function () {
    //     console.log("Starting getter");
    //     await this.coreValidator.createGroup("a54sdf", 14);
    //     console.log("Created group");
    //     let groupZero = await this.coreValidator.getGroupZero();
    //     console.log("Group zero is: ", groupZero);
    //     let groups = await this.coreValidator.getGroups();
    //     console.log("Group got: ", groups);
    //   });
    // });
    describe("Proofs", async function () {
      it("Sig Check Proof Works", async function () {
        console.log(
          "Starting sig check",
          __dirname + "/json/sigCheckProof.json"
        );
        const sig_check_proof_json = JSON.parse(
          fs.readFileSync(__dirname + "/json/sigCheckProof.json")
        );
        const sig_check_public_json = JSON.parse(
          fs.readFileSync(__dirname + "/json/sigCheckPublic.json")
        );
        const hash_proof_json = JSON.parse(
          fs.readFileSync(__dirname + "/json/hashProof.json")
        );
        const hash_public_json = JSON.parse(
          fs.readFileSync(__dirname + "/json/hashPublic.json")
        );
        const pollName = "myPoll";
        const answerValid = await this.coreValidator.verifyAndStoreRegistration(
          ...callArgsFromProofAndSignals(hash_proof_json, hash_public_json),
          ...callArgsFromProofAndSignals(
            sig_check_proof_json,
            sig_check_public_json
          ),
          pollName
        );
        const addedMessage = await this.coreValidator.verifyAndAddMessage(
          ...callArgsFromProofAndSignals(
            sig_check_proof_json,
            sig_check_public_json
          ),
          "message"
        );
        const isRegistered = await this.coreValidator.checkIfHashRegisteredForPoll(
          pollName,
          hash_public_json[0]
        );
        assert(isRegistered == 1); // Pass
        console.log("Test works");
      });
    });
  });
});
