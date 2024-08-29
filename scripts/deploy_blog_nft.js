const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MyBlogNFT = await hre.ethers.getContractFactory("MyBlogNFT");
  const myBlogNFT = await MyBlogNFT.deploy(deployer.address);

  await myBlogNFT.waitForDeployment();

  console.log("MyBlogNFT deployed to:", await myBlogNFT.getAddress());

  // Save the contract address and ABI to a file
  const data = {
    address: await myBlogNFT.getAddress(),
    abi: JSON.parse(JSON.stringify(myBlogNFT.interface.fragments)) // This line is changed
  };
  fs.writeFileSync('contract-data.json', JSON.stringify(data, null, 2));
  console.log("Contract address and ABI saved to contract-data.json");

  // Verify contract functions
  console.log("Verifying contract functions...");
  const currentTokenId = await myBlogNFT.getCurrentTokenId();
  console.log("Current Token ID:", currentTokenId.toString());

  // Create a test blog post
  const tx = await myBlogNFT.createBlogPost("Test Blog Post", "QmTestHash", hre.ethers.parseEther("0.1"));
  await tx.wait();
  console.log("Test blog post created, transaction hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
