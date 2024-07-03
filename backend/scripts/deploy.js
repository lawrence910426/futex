const hre = require("hardhat");
const FakeUsdtModule = require("../ignition/modules/FakeUSDT");
const GameModule = require("../ignition/modules/Game");


async function main() {
  const { FakeUSDT } = await hre.ignition.deploy(FakeUsdtModule);
  const tokenAddress = await FakeUSDT.getAddress()
  console.log(`FakeUSDT deployed to: ${tokenAddress}`);

  const { Game } = await hre.ignition.deploy(GameModule, {
    parameters: { Game: { tokenAddress } },
  });
  console.log(`Game deployed to: ${await Game.getAddress()}`);
}

main().catch(console.error);