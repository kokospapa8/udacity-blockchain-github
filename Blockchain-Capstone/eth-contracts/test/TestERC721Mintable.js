var ERC721MintableComplete = artifacts.require("KOKOToken");

contract("TestKOKOToken", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const account_three = accounts[2];
  const account_four = accounts[3];

  const acc_one_count = 1;
  const acc_two_count = 3;
  const acc_three_count = 10;
  const acc_four_count = 20;

  describe("match erc721 spec", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });

      // TODO: mint multiple tokens
      for (let i = 0; i < acc_two_count; ++i) {
        await this.contract.mint(account_two, i + acc_two_count);
      }
      for (let i = 0; i < acc_three_count; ++i) {
        await this.contract.mint(account_three, i + acc_three_count);
      }
      for (let i = 0; i < acc_four_count; ++i) {
        await this.contract.mint(account_four, i + acc_four_count);
      }
    });

    it("should return total supply", async function () {
      let total_supply = await this.contract.totalSupply.call({
        from: account_one,
      });
      assert.equal(
        total_supply,
        acc_two_count + acc_three_count + acc_four_count,
        "Does not match actual supply"
      );
    });

    it("should get token balance", async function () {
      let balance_2 = await this.contract.balanceOf.call(account_two);
      let balance_3 = await this.contract.balanceOf.call(account_three);
      let balance_4 = await this.contract.balanceOf.call(account_four);
      assert.equal(
        balance_2,
        acc_two_count,
        "Does not match balance account_two"
      );
      assert.equal(
        balance_3,
        acc_three_count,
        "Does not match balance of account_three"
      );
      assert.equal(
        balance_4,
        acc_four_count,
        "Does not match balance of account_four"
      );
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      let tokenId = 3;
      let base_token_uri = await this.contract.getBaseTokenURI.call({
        from: account_one,
      });
      let token_uri = await this.contract.tokenURI.call(tokenId, {
        from: account_one,
      });
      assert.equal(
        token_uri,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/" +
          tokenId,
        "Does not match expected tokenURI"
      );
    });

    it("should transfer token from one owner to another", async function () {
      let tokenId = 3;
      await this.contract.safeTransferFrom(
        account_two,
        account_three,
        tokenId,
        { from: account_two }
      );
      let owner = await this.contract.ownerOf(tokenId);
      assert.equal(owner, account_three, "Token not transferred");
    });
  });

  describe("have ownership properties", function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
    });

    it("should fail when minting when address is not contract owner", async function () {
      let error = false;
      try {
        await this.contract.mint(account_three, 6, { from: account_two });
      } catch {
        error = true;
      }
      assert.equal(error, true, "Only contract owner can mint");
    });

    it("should return contract owner", async function () {
      let owner = await this.contract.getOwner.call();
      assert.equal(owner, account_one, "Not contract owner");
    });
  });
});
