// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MaterialPassport is AccessControl {

    bytes32 public constant MANUFACTURER_ROLE =
    keccak256("MANUFACTURER_ROLE");

    bytes32 public constant INSPECTOR_ROLE =
    keccak256("INSPECTOR_ROLE");

    bytes32 public constant WAREHOUSE_ROLE =
    keccak256("WAREHOUSE_ROLE");

    bytes32 public constant RECYCLER_ROLE =
    keccak256("RECYCLER_ROLE");

    enum MaterialStatus {
    Manufactured,
    InTransit,
    Installed,
    UnderMaintenance,
    Recycled,
    Disposed
    }

    struct Material {
        string materialId;
        string materialName;
        string category;
        string manufacturer;
        address currentOwner;
        uint256 manufactureDate;
        string metadataURI;
        MaterialStatus status;
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

    event OwnershipTransferred(
    string indexed materialId,
    address indexed previousOwner,
    address indexed newOwner
    );

    event MaterialStatusUpdated(
    string indexed materialId,
    MaterialStatus newStatus
    );

    constructor(address admin) {
        require(admin != address(0), "Invalid admin address");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANUFACTURER_ROLE, admin);
        _grantRole(INSPECTOR_ROLE, admin);
        _grantRole(WAREHOUSE_ROLE, admin);
        _grantRole(RECYCLER_ROLE, admin);
    }

    function registerMaterial(
        string memory _materialId,
        string memory _materialName,
        string memory _category,
        string memory _manufacturer,
        uint256 _manufactureDate,
        string memory _metadataURI,
        address _owner
    ) public onlyRole(MANUFACTURER_ROLE) {
        require(bytes(_materialId).length > 0, "Material ID cannot be empty");
        require(bytes(_materialName).length > 0, "Material name cannot be empty");
        require(bytes(_category).length > 0, "Category cannot be empty");
        require(bytes(_manufacturer).length > 0, "Manufacturer cannot be empty");
        require(_manufactureDate > 0, "Invalid manufacture date");
        require(_owner != address(0), "Invalid owner address");
        require(!materials[_materialId].exists, "Material already exists");

        materials[_materialId] = Material({
            materialId: _materialId,
            materialName: _materialName,
            category: _category,
            manufacturer: _manufacturer,
            currentOwner: _owner,
            manufactureDate: _manufactureDate,
            metadataURI: _metadataURI,
            status: MaterialStatus.Manufactured,
            exists: true
        });

        materialHistory[_materialId].push(
            LifecycleEvent({
                timestamp: block.timestamp,
                eventType: "Material Registered",
                description: "Material batch registered in passport registry",
                performedBy: msg.sender
            })
        );

        emit MaterialRegistered(_materialId, _owner);
        emit LifecycleEventAdded(_materialId, "Material Registered", msg.sender);
    }

    function addLifecycleEvent(
        string memory _materialId,
        string memory _eventType,
        string memory _description
    ) public onlyRole(INSPECTOR_ROLE) {
        require(bytes(_materialId).length > 0, "Material ID cannot be empty");
        require(materials[_materialId].exists, "Material not found");
        require(bytes(_eventType).length > 0, "Event type cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");

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

    function transferMaterialOwnership(
        string memory _materialId,
        address _newOwner
    ) public onlyRole(WAREHOUSE_ROLE) {
        require(bytes(_materialId).length > 0, "Material ID cannot be empty");
        require(materials[_materialId].exists, "Material not found");
        require(_newOwner != address(0), "Invalid owner address");
        require(_newOwner != materials[_materialId].currentOwner, "Already current owner");

        address previousOwner = materials[_materialId].currentOwner;
        materials[_materialId].currentOwner = _newOwner;

        materialHistory[_materialId].push(
            LifecycleEvent({
                timestamp: block.timestamp,
                eventType: "Ownership Transfer",
                description: "Material ownership transferred",
                performedBy: msg.sender
            })
        );

        emit OwnershipTransferred(
            _materialId,
            previousOwner,
            _newOwner
        );
    }

    function updateMaterialStatus(
        string memory _materialId,
        MaterialStatus _newStatus
    ) public {
        require(bytes(_materialId).length > 0, "Material ID cannot be empty");
        require(materials[_materialId].exists, "Material not found");
        require(materials[_materialId].status != _newStatus, "Status already set");

        if (_newStatus == MaterialStatus.Recycled || _newStatus == MaterialStatus.Disposed) {
            require(
                hasRole(INSPECTOR_ROLE, msg.sender) || hasRole(RECYCLER_ROLE, msg.sender),
                "Caller lacks INSPECTOR_ROLE or RECYCLER_ROLE"
            );
        } else {
            require(
                hasRole(INSPECTOR_ROLE, msg.sender),
                "Caller lacks INSPECTOR_ROLE"
            );
        }

        materials[_materialId].status = _newStatus;

        materialHistory[_materialId].push(
            LifecycleEvent({
                timestamp: block.timestamp,
                eventType: "Status Update",
                description: "Material status updated",
                performedBy: msg.sender
            })
        );

        emit MaterialStatusUpdated(
            _materialId,
            _newStatus
        );
    }

    function getMaterial(
        string memory _materialId
    ) public view returns (Material memory) {
        require(bytes(_materialId).length > 0, "Material ID cannot be empty");
        require(materials[_materialId].exists, "Material not found");
        return materials[_materialId];
    }

    function verifyMaterial(
        string memory _materialId
    ) public view returns (bool) {
        if (bytes(_materialId).length == 0) {
            return false;
        }
        return materials[_materialId].exists;
    }

    function getMaterialHistory(
        string memory _materialId
    ) public view returns (LifecycleEvent[] memory) {
        require(bytes(_materialId).length > 0, "Material ID cannot be empty");
        require(materials[_materialId].exists, "Material not found");
        return materialHistory[_materialId];
    }
}