const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Game", (m) => {
  const tokenAddress = m.getParameter("tokenAddress");
  const Game = m.contract("Game", [
    tokenAddress,
    0,
    2147483647,
    100
  ]);
  return { Game };
});