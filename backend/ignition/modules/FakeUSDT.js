const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FakeUSDT", (m) => {
  const FakeUsdtContract = m.contract("FakeUSDT", [1000000]);
  return { FakeUsdtContract };
});