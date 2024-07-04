const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Game", (m) => {
  const GameContract = m.contract("Game", [
    m.getParameter("tokenAddress"),
    0,
    2147483647,
    1000 * (1_000_000)
  ]);
  return { GameContract };
});