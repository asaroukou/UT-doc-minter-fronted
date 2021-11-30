var UTIdeaPatent = artifacts.require("./UTIdeaPatent.sol");
var DocDex = artifacts.require("./DocDex.sol");

module.exports = function(deployer) {
  deployer.deploy(UTIdeaPatent);
  deployer.deploy(DocDex);
};
