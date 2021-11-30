const UTIdeaPatent = artifacts.require("UTIdeaPatent");

var accounts;
var owner;

contract("IdeaNotary", (accs) => {
  accounts = accs;
  owner = accounts[0];
  idToken = 0;
});

it("Can create an Idea", async () => {
  let ideaName = "Awesome idea";
  let ideaDescription = "Stunning description";
  const instance = await UTIdeaPatent.deployed();
  await instance.createIdea(ideaName, ideaDescription, { from: owner });
  const idea = await instance.tokenIdToIdeaInfo.call(++idToken);
  assert.equal(idea["0"], ideaName);
  assert.equal(idea["1"], ideaDescription);
});

it("Can transfer idea ownership", async () => {
  const instance = await UTIdeaPatent.deployed();
  const someone = accounts[1];
  let ideaOwner = await instance.ownerOf(idToken);
  assert.equal(owner, ideaOwner);
  await instance.transferFrom(owner, someone, idToken, { from: owner });
  ideaOwner = await instance.ownerOf(idToken);
  assert.equal(someone, ideaOwner);
});
