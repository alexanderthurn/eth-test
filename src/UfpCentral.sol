pragma solidity ^0.4.0;
contract UfpCentralRegistry {

    string name;

     function UfpCentralRegistry(string newName) public {
        name = newName;
     }


    mapping(string => address) companyNameToAddress;
	mapping(address => string) companyAddressToName;

    function addCompany(string companyName, address companyAddress) public {
        companyNameToAddress[companyName] = companyAddress;
        companyAddressToName[companyAddress] = companyName;
    }

    function getRegistryName(int check) public constant returns (string registryName) {
        if (check == 5) {
            return name;
        } else {
            return 'no';
        }
    }

    function getCompanyAddressByName(string companyName) public constant returns (address companyAddress) {
        return companyNameToAddress[companyName];
    }

    function getCompanyNameByAddress(address companyAddress) public constant returns (string companyName) {
        return companyAddressToName[companyAddress];
    }

    mapping(string => address) digitalTwinSerialIdToAddress;
	mapping(address => string) digitalTwinAddressToSerialId;

    function addDigitalTwin(string digitalTwinSerialId, address digitalTwinAddress) public {
        digitalTwinSerialIdToAddress[digitalTwinSerialId] = digitalTwinAddress;
        digitalTwinAddressToSerialId[digitalTwinAddress] = digitalTwinSerialId;
    }

    function getDigitalTwinAddressBySerialId(string digitalTwinSerialId) public constant returns (address hash) {
        return digitalTwinSerialIdToAddress[digitalTwinSerialId];
    }

    function getDigitalTwinSerialIdByAddress(address digitalTwinAddress) public constant returns (string digitalTwinSerialId) {
        return digitalTwinAddressToSerialId[digitalTwinAddress];
    }


}

contract UfpSupplyChainDigitalTwin {

    string serialId;
    string name;

   struct OwnerAndHash {
        string hash;
        address owner;
    }

    OwnerAndHash[] oldOwnerAndHashes;
    OwnerAndHash currentOwnerAndHash;

    function UfpSupplyChainDigitalTwin(string newSerialId, string newName, string newHash, address newOwner) public {
        currentOwnerAndHash = OwnerAndHash({owner: newOwner, hash: newHash});
        serialId = newSerialId;
        name = newName;
        oldOwnerAndHashes.push(currentOwnerAndHash);
    }

    function setNewOwner(address newOwner, string newHash) public {
        //if (msg.sender == currentOwnerAndHash.owner) {
            currentOwnerAndHash = OwnerAndHash({owner: newOwner, hash: newHash});
            oldOwnerAndHashes.push(currentOwnerAndHash);
        //}
    }

    function getName() public constant returns (string twinName) {
        return name;
    }

     function getSerialId() public constant returns (string twinSerialId) {
        return name;
    }

    function getCurrentOwnerAndHash() public constant returns (OwnerAndHash ownerAndHash) {
        return currentOwnerAndHash;
    }


    function getHistoryOwner(uint256 i) public constant returns (address owner){
        return oldOwnerAndHashes[i].owner;
    }

     function getHistoryHash(uint256 i) public constant returns (string hash){
            return oldOwnerAndHashes[i].hash;
        }

    function getHistoryLength() public constant returns (uint256 count){
        return oldOwnerAndHashes.length;
    }


}

contract UfpSupplyChainCompany {
    string name;
    address owner;

    function UfpSupplyChainCompany(string _name) public {
        owner = msg.sender;
        name = _name;
    }

     function getName() public constant returns (string twinName) {
        return name;
    }

    function getOwner() public constant returns (address companyWwner) {
        return owner;
    }

}