async function main() {
  const MyNFT = await ethers.getContractFactory("MyNFT");
  console.log("Deploying MyNFT...");
  const myNFT = await MyNFT.deploy();
  await myNFT.waitForDeployment();
  const address = await myNFT.getAddress();
  console.log("MyNFT deployed to:", address);
  
  console.log("Contract ABI:", JSON.stringify(MyNFT.interface.format('json'), null, 2));

  try {
    const name = await myNFT.getName();
    console.log("NFT name from getName():", name);
  } catch (error) {
    console.error("Error calling getName():", error.message);
  }
  
  try {
    const name = await myNFT.name();
    console.log("NFT name from public variable:", name);
  } catch (error) {
    console.error("Error accessing name variable:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
