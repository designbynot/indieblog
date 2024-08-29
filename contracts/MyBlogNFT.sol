// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyBlogNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    struct BlogPost {
        string title;
        uint256 publishDate;
        string contentHash; // IPFS hash of the blog post content
        uint256 price; // Price in wei
        bool minted;
    }

    mapping(uint256 => BlogPost) private _blogPosts;

    event BlogPostCreated(uint256 indexed tokenId, string title, uint256 price);
    event BlogPostMinted(uint256 indexed tokenId, address indexed minter);

    constructor(address initialOwner) ERC721("MyBlogNFT", "BLOG") Ownable(initialOwner) {
        _tokenIdCounter = 0;
    }

    function createBlogPost(string memory title, string memory contentHash, uint256 price) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _blogPosts[tokenId] = BlogPost({
            title: title,
            publishDate: block.timestamp,
            contentHash: contentHash,
            price: price,
            minted: false
        });
        emit BlogPostCreated(tokenId, title, price);
        _tokenIdCounter++;
    }

    function mintBlogPost(uint256 tokenId) public payable {
        require(_blogPosts[tokenId].publishDate != 0, "Blog post does not exist");
        require(!_blogPosts[tokenId].minted, "Blog post already minted");
        require(msg.value >= _blogPosts[tokenId].price, "Insufficient payment");
        
        _safeMint(msg.sender, tokenId);
        _blogPosts[tokenId].minted = true;
        emit BlogPostMinted(tokenId, msg.sender);
    }

    function getBlogPost(uint256 tokenId) public view returns (BlogPost memory) {
        require(_blogPosts[tokenId].publishDate != 0, "Blog post does not exist");
        return _blogPosts[tokenId];
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        return string(abi.encodePacked("https://ipfs.io/ipfs/", _blogPosts[tokenId].contentHash));
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
}
