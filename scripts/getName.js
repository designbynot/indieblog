const { ethers } = require("hardhat");

async function main() {
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  
  console.log("Contract address:", await myNFT.getAddress());
  
  // Get the contract ABI
  const abi = MyNFT.interface.format('json');
  console.log("Contract ABI:", abi);

  // Create a new contract instance using the ABI and address
  const provider = ethers.provider;
  const contract = new ethers.Contract(await myNFT.getAddress(), abi, provider);

  try {
    // Call getName() using a low-level call
    const getNameData = contract.interface.encodeFunctionData("getName");
    const result = await provider.call({
      to: await myNFT.getAddress(),
      data: getNameData,
    });
    const decodedResult = contract.interface.decodeFunctionResult("getName", result);
    console.log("NFT name from getName():", decodedResult[0]);
  } catch (error) {
    console.error("Error calling getName():", error.message);
  }

  try {
    // Access name variable using a low-level call
    const nameData = contract.interface.encodeFunctionData("name");
    const result = await provider.call({
      to: await myNFT.getAddress(),
      data: nameData,
    });
    const decodedResult = contract.interface.decodeFunctionResult("name", result);
    console.log("NFT name from public variable:", decodedResult[0]);
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
