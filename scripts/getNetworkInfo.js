const { ethers } = require("hardhat");

async function main() {
  const provider = ethers.provider;
  
  console.log("Current block number:", await provider.getBlockNumber());
  
  const balance = await provider.getBalance("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  console.log("Contract balance:", ethers.formatEther(balance), "ETH");
  
  const code = await provider.getCode("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  console.log("Contract code exists:", code !== "0x");

  // Add more network state checks
  console.log("Latest block:", await provider.getBlock("latest"));
  
  // Try to get transaction count
  const txCount = await provider.getTransactionCount("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  console.log("Transaction count for contract address:", txCount);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
