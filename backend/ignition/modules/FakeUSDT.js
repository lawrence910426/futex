const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FakeUSDT", (m) => {
  const FakeUSDT = m.contract("FakeUSDT", [1000000]);

  return { FakeUSDT };
});