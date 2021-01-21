const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

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

  describe("Verifier", function () {
    let verifier;
    describe("Verifier_Test", function () {
      it("Works", async function () {
        const Verifier = await ethers.getContractFactory("Verifier");
        verifier = await Verifier.deploy();

        const answer = await verifier.verifyProof(
          [0, 0],
          [
            [0, 0],
            [0, 0],
          ],
          [0, 0],
          [0]
        );
        assert(answer == 0); // Fail
        const answerValid = await verifier.verifyProof(
          [
            "4361411925896965367605188229838998950263853136855346992467135739885658267696",
            "13257099796368377884239053786098576403291418420491903938520425819032342163253",
          ],
          [
            [
              "18902941826585626765735372290361041829879114965587413026743546969772770223876",
              "355657094392399070471888802703298304910289742627615590482317587855574212887",
            ],
            [
              "13106205535807614907890129305427976444228090794559356293569824662995492606937",
              "13731278056551524092357955801477541602113079924446007945952289832061866034192",
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
        assert(answerValid == 1); // Pass
      });
    });
  });
  describe("MessageValidator", function () {
    let verifier;
    describe("Verifier_Test", function () {
      it("Works", async function () {
        const Verifier = await ethers.getContractFactory("Verifier");
        verifier = await Verifier.deploy();

        const answer = await verifier.verifyProof(
          [0, 0],
          [
            [0, 0],
            [0, 0],
          ],
          [0, 0],
          [0]
        );
        assert(answer == 0); // Fail
        const answerValid = await verifier.verifyProof(
          [
            "4361411925896965367605188229838998950263853136855346992467135739885658267696",
            "13257099796368377884239053786098576403291418420491903938520425819032342163253",
          ],
          [
            [
              "18902941826585626765735372290361041829879114965587413026743546969772770223876",
              "355657094392399070471888802703298304910289742627615590482317587855574212887",
            ],
            [
              "13106205535807614907890129305427976444228090794559356293569824662995492606937",
              "13731278056551524092357955801477541602113079924446007945952289832061866034192",
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
        assert(answerValid == 1); // Pass
      });
    });
  });
});
