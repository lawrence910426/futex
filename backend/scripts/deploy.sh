rm -r ../ignition/deployments

SESSION_NAME="hardhat-node"
tmux new-session -d -s $SESSION_NAME 'npx hardhat node'
if tmux has-session -t $SESSION_NAME 2>/dev/null; then
  echo "Tmux session '$SESSION_NAME' started successfully."
else
  echo "Failed to start tmux session '$SESSION_NAME'."
fi

sleep 10

export tokenAddress=$(echo "y" | npx hardhat ignition deploy ../ignition/modules/FakeUSDT.js --network localhost 2>&1 | grep "FakeUSDT#FakeUSDT" | awk -F' - ' '{print $2}' | tr -d '[:space:]')
echo "TOKEN_ADDRESS = $tokenAddress"
echo "{ \"Game\": { \"tokenAddress\": \"$tokenAddress\" } }" > parameter.json

export gameAddress=$(echo "y" | npx hardhat ignition deploy ../ignition/modules/Game.js --parameters parameter.json --network localhost 2>&1 | grep "Game#Game" | awk -F' - ' '{print $2}' | tr -d '[:space:]')
echo "CONTRACT_ADDRESS = $gameAddress"
