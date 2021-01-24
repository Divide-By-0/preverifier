const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { callArgsFromProofAndSignals } = require("../contracts/utils");

use(solidity);

describe("My Dapp", function () {
  let myContract;

  // describe("YourContract", function () {
  //   it("Should deploy YourContract", async function () {
  //     const YourContract = await ethers.getContractFactory("YourContract");

  //     myContract = await YourContract.deploy();
  //   });

  //   describe("setPurpose()", function () {
  //     it("Should be able to set a new purpose", async function () {
  //       const newPurpose = "Test Purpose";

  //       await myContract.setPurpose(newPurpose);
  //       expect(await myContract.purpose()).to.equal(newPurpose);
  //     });
  //   });
  // });
  var assert = require("assert");

  describe("HashVerifier", function () {
    describe("hashVerifier_test", function () {
      it("Works", async function () {
        const HashVerifier = await ethers.getContractFactory("HashVerifier");
        hashVerifier = await HashVerifier.deploy();
        const answer = await hashVerifier.verifyProof(
          [0, 0],
          [
            [0, 0],
            [0, 0],
          ],
          [0, 0],
          [0, 0]
        );
        assert(answer == 0); // Fail
        const proof_json = {
          pi_a: [
            "21091628328137394537965142714333822821641863866791650011410886903362623418272",
            "18280472138186688003438137928308764112911603159817387546691539760473090693371",
            "1",
          ],
          pi_b: [
            [
              "11344660550483809995614541084154443457839674028527793646469375993663144765913",
              "6751146207460315018988444488917904430365893797914758108858978152773018559896",
            ],
            [
              "11502708319599673041878972208002073221212642951523093782562163270105164570208",
              "10803158310791171446091222685495521047991831513751964385330056060965794796398",
            ],
            ["1", "0"],
          ],
          pi_c: [
            "12710825911471620323517180100634237455490362251270146065794046237550255125785",
            "21499934118537860747238035839151915120428039513230392956555822029273820767165",
            "1",
          ],
          protocol: "groth16",
        };
        const public_json = [
          "15893827533473716138720882070731822975159228540693753428689375377280130954696",
          "15893827533473716138720882070731822975159228540693753428689375377280130954696",
        ];
        const answerValid = await hashVerifier.verifyProof(
          ...callArgsFromProofAndSignals(proof_json, public_json)
        );
        assert(answerValid == 1); // Pass
      });
    });
  });
  describe("MessageValidator", function () {
    describe("MessageValidator_Test", function () {
      it("Works", async function () {
        const MessageValidator = await ethers.getContractFactory(
          "MessageValidator"
        );
        messageValidator = await MessageValidator.deploy();

        // const answer = await messageValidator.checkSigCheckProof(
        //   [0, 0],
        //   [
        //     [0, 0],
        //     [0, 0],
        //   ],
        //   [0, 0],
        //   [0]
        // );
        // assert(answer == 0); // Fail
        const proof_json = {
          pi_a: [
            "21091628328137394537965142714333822821641863866791650011410886903362623418272",
            "18280472138186688003438137928308764112911603159817387546691539760473090693371",
            "1",
          ],
          pi_b: [
            [
              "11344660550483809995614541084154443457839674028527793646469375993663144765913",
              "6751146207460315018988444488917904430365893797914758108858978152773018559896",
            ],
            [
              "11502708319599673041878972208002073221212642951523093782562163270105164570208",
              "10803158310791171446091222685495521047991831513751964385330056060965794796398",
            ],
            ["1", "0"],
          ],
          pi_c: [
            "12710825911471620323517180100634237455490362251270146065794046237550255125785",
            "21499934118537860747238035839151915120428039513230392956555822029273820767165",
            "1",
          ],
          protocol: "groth16",
        };
        const public_json = [
          "4344076085980212844486258834275858070676987184362509147941825063966169495678",
          "16380945766763076134801469499354527462139468721700909541699086403443082771915",
        ];
        const answerValid = await messageValidator.checkSigCheckProof(
          ...callArgsFromProofAndSignals(proof_json, public_json)
        );
        assert(answerValid == 1); // Pass
      });
    });
  });
});
