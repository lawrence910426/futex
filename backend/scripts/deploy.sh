rm -r ../ignition/deployments

export tokenAddress=$(echo "y" | npx hardhat ignition deploy ../ignition/modules/FakeUSDT.js --network localhost 2>&1 | grep "FakeUSDT#FakeUSDT" | awk -F' - ' '{print $2}' | tr -d '[:space:]')
echo "token address = $tokenAddress"
echo "{ \"Game\": { \"tokenAddress\": \"$tokenAddress\" } }" > parameter.json

export gameAddress=$(echo "y" | npx hardhat ignition deploy ../ignition/modules/Game.js --parameters parameter.json --network localhost 2>&1 | grep "Game#Game" | awk -F' - ' '{print $2}' | tr -d '[:space:]')
echo "game address = $gameAddress"
