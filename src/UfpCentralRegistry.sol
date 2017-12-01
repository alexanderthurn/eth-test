pragma solidity ^0.4.0;
contract UfpCentralRegistry {
    
    mapping(string => address) companyIdToAddress;
	mapping(address => string) companyAddressToId;

    function addCompany(string companyId, address companyAddress) public {
        companyIdToAddress[companyId] = companyAddress;
        companyAddressToId[companyAddress] = companyId;
    }
    
    function getCompanyAddressById(string companyId) public constant returns (address companyAddress) {
        return companyIdToAddress[companyId];
    }

    function getCompanyIdByAddress(address companyAddress) public constant returns (string companyId) {
        return companyAddressToId[companyAddress];
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

contract UfpSupplyChainDevice {

   struct OwnerAndHash {
        string hash;
        address owner;
    }

    OwnerAndHash[] oldOwnerAndHashes;
    OwnerAndHash currentOwnerAndHash;

    function UfpSupplyChainDevice(string newHash) public {
        currentOwnerAndHash = OwnerAndHash({owner: msg.sender, hash: newHash});
        oldOwnerAndHashes.push(currentOwnerAndHash);
    }

    function setNewOwner(address newOwner, string newHash) public {
        if (msg.sender == currentOwnerAndHash.owner) {
            currentOwnerAndHash = OwnerAndHash({owner: newOwner, hash: newHash});
            oldOwnerAndHashes.push(currentOwnerAndHash);
        }
    }

    function getHistory() public constant returns (OwnerAndHash[] ownerAndHashHistory){
        return oldOwnerAndHashes;
    }
}

contract UfpSupplyChainCompany {
    string name;
    address owner;

    function UfpSupplyChainCompany(string _name) public {
        owner = msg.sender;
        name = _name;
    }

}