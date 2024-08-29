async function main() {
  // Deploy the contract
  const MyNFT = await ethers.getContractFactory("MyNFT");
  console.log("Deploying MyNFT...");
  const myNFT = await MyNFT.deploy();
  await myNFT.waitForDeployment();
  const address = await myNFT.getAddress();
  console.log("MyNFT deployed to:", address);

  // Mint a new NFT
  const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Example address
  const tokenURI = "https://example.com/nft/1";
  const mintTx = await myNFT.mintNFT(recipient, tokenURI);
  await mintTx.wait();
  console.log("Minted NFT with tokenURI:", tokenURI);

  // Get current token ID
  const currentTokenId = await myNFT.getCurrentTokenId();
  console.log("Current Token ID:", currentTokenId);

  // Try to get the token URI
  try {
    const retrievedTokenURI = await myNFT.tokenURI(currentTokenId - 1n);
    console.log("Retrieved Token URI:", retrievedTokenURI);
  } catch (error) {
    console.error("Error retrieving token URI:", error.message);
  }

  // Get network info
  const provider = ethers.provider;
  console.log("Current block number:", await provider.getBlockNumber());
  const balance = await provider.getBalance(address);
  console.log("Contract balance:", ethers.formatEther(balance), "ETH");
  const code = await provider.getCode(address);
  console.log("Contract code exists:", code !== "0x");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
