const AdvancedStorage = artifacts.require("AdvancedStorage");

contract('AdvancedStorage', () => {

  let advancedStorage = null;


  before( async() => {
    advancedStorage = await AdvancedStorage.deployed();
  })

  it('Should deploy smart contract properly', async () => {
    //const advancedStorage = await AdvancedStorage.deployed();
    console.log(advancedStorage.address);
  });

  it('Should add element in the array', async () => {
    //const advancedStorage = await AdvancedStorage.deployed();
    await advancedStorage.add(10);
    const result = advancedStorage.get(0);
    //BIG NUMBER
    assert(result.toNumber() ===10)
  });

  it('Should get an element in the array', async () => {
    //const advancedStorage = await AdvancedStorage.deployed();
    await advancedStorage.add(20);
    const result = advancedStorage.get(1);
    //BIG NUMBER
    assert(result.toNumber() ===20)
  });

  it('Should get the Ids array', async () => {
    //const advancedStorage = await AdvancedStorage.deployed();
    const rawIds = advancedStorage.getAll();
    
    const ids = rawIds.map(id => id.toNumber());
    assert.deepEqual(ids === [10, 20]);
  });

  it('Should get the length array', async () => {
    //const advancedStorage = await AdvancedStorage.deployed();
    const lengthArray = advancedStorage.getLength();
        
    assert(lengthArray.toNumber() === 3)
  });

});
