import { ethers } from "hardhat";
import { promises as fs } from "fs";

// from here:  https://github.com/devanoneth/TokenChecks/blob/master/scripts/tokenOverride.ts

interface TokenParams {
  address: string;
}

async function callViewMethod(target: string, code: any) {
  const BaseViewer = await ethers.getContractFactory("BaseViewer");
    const functionData = BaseViewer.interface.encodeFunctionData("getNumber", []);

    const returnedData = await ethers.provider.send("eth_call", [
      {
        data: functionData,
        to: target,
      },
      "latest",
      {
        // state override set, the famous 3rd param of `eth_call` https://twitter.com/libevm/status/1476791869585588224
        // we set the bytecode to the deployed bytecode of our "tolerance check override" contract
        [target]: {
          code,
          // balance: utils.hexStripZeros(utils.parseEther("1").toHexString()),
        },
      },
    ]);

    console.log(`return data: ${returnedData}`)
}

async function callRevertMethod(target: string, code: any) {
  const BaseViewer = await ethers.getContractFactory("BaseViewer");
    const functionData = BaseViewer.interface.encodeFunctionData("setTestNumber", [
      ethers.parseUnits("1.005", 3)
    ]);

    const returnedData = await ethers.provider.send("eth_call", [
      {
        data: functionData,
        to: target,
      },
      "latest",
      {
        // state override set, the famous 3rd param of `eth_call` https://twitter.com/libevm/status/1476791869585588224
        // we set the bytecode to the deployed bytecode of our "tolerance check override" contract
        [target]: {
          code,
          // balance: utils.hexStripZeros(utils.parseEther("1").toHexString()),
        },
      },
    ]);

    console.log(`revert data: ${returnedData}`)
}
// Here, we use geth's state override set in eth_call to really simulate the blockchain
export default async function tokenOverride(params: TokenParams): Promise<void> {

  try {
    const ToleranceCheckOverrideDeployedBytecode = JSON.parse(
      await fs.readFile("./artifacts/contracts/BaseViewer.sol/BaseViewer.json", "utf-8"),
    ).deployedBytecode;
    
    await callViewMethod(params.address, ToleranceCheckOverrideDeployedBytecode);
    await callRevertMethod(params.address, ToleranceCheckOverrideDeployedBytecode);
    
  } catch (e) {
    console.error("FAILED ToleranceCheck: ", JSON.stringify(e, null, 2));
  }
}

// on polygon mumbai 
tokenOverride({address: "0xdE05a102AD38CC8a8388FB3294e4F22E2c6C864b"}).catch(e => console.log(e))