const DocDex = artifacts.require("DocDex");

var accounts;
var owner;

contract("DocumentNotary", (accs) => {
  accounts = accs;
  owner = accounts[0];
});

it("Can create a document", async () => {
  let docName = "Bitcoin whitepaper!!";
  let docHash = "e75f432E58B0c62c02f1C7F2bCB03C55dcC76d65";
  const instance = await DocDex.deployed();
  await instance.addDocument(docName, docHash, { from: owner });
  const doc = await instance.getDocument(owner, 0);
  assert.equal(doc["0"], docName);
  assert.equal(doc["1"], docHash);
});

it("Can retrive owner document number", async () => {
  let docName = "Bitcoin whitepaper!!";
  let docHash = "e75f432E58B0c62c02f1C7F2bCB03C55dcC76d65";
  const instance = await DocDex.deployed();
  await instance.addDocument(docName, docHash, { from: owner });
  await instance.addDocument(docName, docHash, { from: owner });
  const number = await instance.getOwnerDocumentsCount({ from: owner });
  assert.equal(number, 3);
});
