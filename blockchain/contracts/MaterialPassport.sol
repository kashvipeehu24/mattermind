// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MaterialPassport is Ownable {

    struct Material {
        string materialId;
        string materialName;
        string category;
        string manufacturer;
        address currentOwner;
        uint256 manufactureDate;
        string metadataURI;
        bool exists;
    }

    struct LifecycleEvent {
    uint256 timestamp;
    string eventType;
    string description;
    address performedBy;
    }

    mapping(string => Material) private materials;
    mapping(string => LifecycleEvent[]) private materialHistory;

    event MaterialRegistered(
        string indexed materialId,
        address indexed owner
    );

    event LifecycleEventAdded(
    string indexed materialId,
    string eventType,
    address indexed performedBy
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    function registerMaterial(
        string memory _materialId,
        string memory _materialName,
        string memory _category,
        string memory _manufacturer,
        uint256 _manufactureDate,
        string memory _metadataURI,
        address _owner
    ) public onlyOwner {

        require(
            !materials[_materialId].exists,
            "Material already exists"
        );

        materials[_materialId] = Material({
            materialId: _materialId,
            materialName: _materialName,
            category: _category,
            manufacturer: _manufacturer,
            currentOwner: _owner,
            manufactureDate: _manufactureDate,
            metadataURI: _metadataURI,
            exists: true
        });

        emit MaterialRegistered(_materialId, _owner);
    }

    function addLifecycleEvent(
    string memory _materialId,
    string memory _eventType,
    string memory _description
    ) public onlyOwner {

    require(
        materials[_materialId].exists,
        "Material not found"
    );

    materialHistory[_materialId].push(
        LifecycleEvent({
            timestamp: block.timestamp,
            eventType: _eventType,
            description: _description,
            performedBy: msg.sender
        })
    );

    emit LifecycleEventAdded(
        _materialId,
        _eventType,
        msg.sender
    );
    }

    function getMaterial(
        string memory _materialId
    )
        public
        view
        returns (Material memory)
    {
        require(
            materials[_materialId].exists,
            "Material not found"
        );

        return materials[_materialId];
    }

    function verifyMaterial(
        string memory _materialId
    )
        public
        view
        returns (bool)
    {
        return materials[_materialId].exists;
    }

    function getMaterialHistory(
    string memory _materialId
    )
    public
    view
    returns (LifecycleEvent[] memory)
    {
    require(
        materials[_materialId].exists,
        "Material not found"
    );

    return materialHistory[_materialId];
    }

}