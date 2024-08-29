const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  // Read the contract data from the JSON file
  const data = JSON.parse(fs.readFileSync('contract-data.json', 'utf-8'));
  const contractAddress = data.address;
  const contractABI = data.abi;

  const [deployer, user] = await ethers.getSigners();
  const myBlogNFT = new ethers.Contract(contractAddress, contractABI, deployer);

  console.log("Interacting with MyBlogNFT at:", contractAddress);

  // Get the current token ID
  try {
    console.log("Getting current token ID...");
    const currentTokenId = await myBlogNFT.getCurrentTokenId();
    console.log("Current Token ID:", currentTokenId.toString());
  } catch (error) {
    console.error("Error getting current token ID:", error.message);
  }

  // Create a blog post
  try {
    console.log("Creating blog post...");
    const title = "My Next Blog Post";
    const contentHash = "QmNewHash";
    const price = ethers.parseEther("0.3");
    const tx = await myBlogNFT.createBlogPost(title, contentHash, price);
    const receipt = await tx.wait();
    console.log("Blog post created, transaction hash:", receipt.hash);

    const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'BlogPostCreated');
    if (event) {
      const [tokenId, eventTitle, eventPrice] = event.args;
      console.log(`Blog post created with ID: ${tokenId}, Title: ${eventTitle}, Price: ${ethers.formatEther(eventPrice)} ETH`);
    }
  } catch (error) {
    console.error("Error creating blog post:", error.message);
  }

  // List all blog posts
  try {
    console.log("\nListing all blog posts:");
    const currentTokenId = await myBlogNFT.getCurrentTokenId();
    for (let i = 0; i < currentTokenId; i++) {
      try {
        const blogPost = await myBlogNFT.getBlogPost(i);
        console.log(`Blog Post ID ${i}:`, {
          title: blogPost.title,
          publishDate: new Date(Number(blogPost.publishDate) * 1000).toLocaleString(),
          contentHash: blogPost.contentHash,
          price: ethers.formatEther(blogPost.price) + " ETH",
          minted: blogPost.minted
        });
      } catch (error) {
        console.log(`Blog Post ID ${i}: Does not exist or error occurred`);
      }
    }
  } catch (error) {
    console.error("Error listing blog posts:", error.message);
  }

  // Mint the latest blog post
  try {
    console.log("\nMinting the latest blog post as user...");
    const latestPostId = Number(await myBlogNFT.getCurrentTokenId()) - 1; // Convert to Number before subtraction
    const blogPost = await myBlogNFT.getBlogPost(latestPostId);
    
    if (blogPost.minted) {
      console.log(`Blog post ${latestPostId} has already been minted.`);
    } else {
      const mintTx = await myBlogNFT.connect(user).mintBlogPost(latestPostId, { value: blogPost.price });
      const mintReceipt = await mintTx.wait();

      const event = mintReceipt.logs.find(log => log.fragment && log.fragment.name === 'BlogPostMinted');
      if (event) {
        const [mintedTokenId, minter] = event.args;
        console.log(`Blog post minted: TokenID: ${mintedTokenId}, Minter: ${minter}`);
      }

      const owner = await myBlogNFT.ownerOf(latestPostId);
      console.log("Owner of token", latestPostId, ":", owner);
    }
  } catch (error) {
    console.error("Error minting blog post:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
