import { expect } from "chai";
import hre from "hardhat";

describe("MaterialPassport Contract", function () {
  let materialPassport: any;
  let admin: any;
  let manufacturer: any;
  let inspector: any;
  let warehouse: any;
  let recycler: any;
  let unauthorized: any;
  let recipient: any;

  beforeEach(async function () {
    const connection = await hre.network.connect();
    const ethers = await connection.ethers;
    const signers = await ethers.getSigners();

    admin = signers[0];
    manufacturer = signers[1];
    inspector = signers[2];
    warehouse = signers[3];
    recycler = signers[4];
    unauthorized = signers[5];
    recipient = signers[6];

    const Factory = await ethers.getContractFactory("MaterialPassport");
    materialPassport = await Factory.deploy(admin.address);
    await materialPassport.waitForDeployment();

    // Grant roles
    const MANUFACTURER_ROLE = await materialPassport.MANUFACTURER_ROLE();
    const INSPECTOR_ROLE = await materialPassport.INSPECTOR_ROLE();
    const WAREHOUSE_ROLE = await materialPassport.WAREHOUSE_ROLE();
    const RECYCLER_ROLE = await materialPassport.RECYCLER_ROLE();

    await materialPassport.connect(admin).grantRole(MANUFACTURER_ROLE, manufacturer.address);
    await materialPassport.connect(admin).grantRole(INSPECTOR_ROLE, inspector.address);
    await materialPassport.connect(admin).grantRole(WAREHOUSE_ROLE, warehouse.address);
    await materialPassport.connect(admin).grantRole(RECYCLER_ROLE, recycler.address);
  });

  describe("Deployment & Role Initialization", function () {
    it("Should correctly assign admin and roles in constructor", async function () {
      const DEFAULT_ADMIN_ROLE = await materialPassport.DEFAULT_ADMIN_ROLE();
      const MANUFACTURER_ROLE = await materialPassport.MANUFACTURER_ROLE();
      const INSPECTOR_ROLE = await materialPassport.INSPECTOR_ROLE();
      const WAREHOUSE_ROLE = await materialPassport.WAREHOUSE_ROLE();
      const RECYCLER_ROLE = await materialPassport.RECYCLER_ROLE();

      expect(await materialPassport.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await materialPassport.hasRole(MANUFACTURER_ROLE, admin.address)).to.be.true;
      expect(await materialPassport.hasRole(INSPECTOR_ROLE, admin.address)).to.be.true;
      expect(await materialPassport.hasRole(WAREHOUSE_ROLE, admin.address)).to.be.true;
      expect(await materialPassport.hasRole(RECYCLER_ROLE, admin.address)).to.be.true;

      expect(await materialPassport.hasRole(MANUFACTURER_ROLE, manufacturer.address)).to.be.true;
      expect(await materialPassport.hasRole(INSPECTOR_ROLE, inspector.address)).to.be.true;
      expect(await materialPassport.hasRole(WAREHOUSE_ROLE, warehouse.address)).to.be.true;
      expect(await materialPassport.hasRole(RECYCLER_ROLE, recycler.address)).to.be.true;
      expect(await materialPassport.hasRole(MANUFACTURER_ROLE, unauthorized.address)).to.be.false;
    });

    it("Should revert deployment if admin address is zero", async function () {
      const connection = await hre.network.connect();
      const ethers = await connection.ethers;
      const Factory = await ethers.getContractFactory("MaterialPassport");
      await expect(
        Factory.deploy("0x0000000000000000000000000000000000000000")
      ).to.be.revertedWith("Invalid admin address");
    });
  });

  describe("Material Registration", function () {
    const validId = "MAT-TI64-001";
    const validName = "Titanium Ti-6Al-4V Grade 23";
    const validCat = "Aerospace Alloy";
    const validMfg = "Siemens Energy Foundry";
    const validDate = 1719360000;
    const validURI = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";

    it("Should successfully register a material with valid inputs by MANUFACTURER_ROLE", async function () {
      const tx = await materialPassport
        .connect(manufacturer)
        .registerMaterial(validId, validName, validCat, validMfg, validDate, validURI, recipient.address);
      await tx.wait();

      expect(await materialPassport.verifyMaterial(validId)).to.be.true;

      const mat = await materialPassport.getMaterial(validId);
      expect(mat.materialId).to.equal(validId);
      expect(mat.materialName).to.equal(validName);
      expect(mat.category).to.equal(validCat);
      expect(mat.manufacturer).to.equal(validMfg);
      expect(mat.currentOwner).to.equal(recipient.address);
      expect(mat.manufactureDate).to.equal(BigInt(validDate));
      expect(mat.metadataURI).to.equal(validURI);
      expect(mat.status).to.equal(0); // MaterialStatus.Manufactured
      expect(mat.exists).to.be.true;

      // Check lifecycle history was initialized
      const history = await materialPassport.getMaterialHistory(validId);
      expect(history.length).to.equal(1);
      expect(history[0].eventType).to.equal("Material Registered");
      expect(history[0].performedBy).to.equal(manufacturer.address);
    });

    it("Should reject duplicate registration of the same materialId", async function () {
      await materialPassport
        .connect(manufacturer)
        .registerMaterial(validId, validName, validCat, validMfg, validDate, validURI, recipient.address);

      await expect(
        materialPassport
          .connect(manufacturer)
          .registerMaterial(validId, validName, validCat, validMfg, validDate, validURI, recipient.address)
      ).to.be.revertedWith("Material already exists");
    });

    it("Should reject registration by an unauthorized caller", async function () {
      await expect(
        materialPassport
          .connect(unauthorized)
          .registerMaterial(validId, validName, validCat, validMfg, validDate, validURI, recipient.address)
      ).to.be.revertedWithCustomError(materialPassport, "AccessControlUnauthorizedAccount");
    });

    it("Should validate required inputs and revert on empty fields or invalid owner", async function () {
      await expect(
        materialPassport.connect(manufacturer).registerMaterial("", validName, validCat, validMfg, validDate, validURI, recipient.address)
      ).to.be.revertedWith("Material ID cannot be empty");

      await expect(
        materialPassport.connect(manufacturer).registerMaterial(validId, "", validCat, validMfg, validDate, validURI, recipient.address)
      ).to.be.revertedWith("Material name cannot be empty");

      await expect(
        materialPassport.connect(manufacturer).registerMaterial(validId, validName, "", validMfg, validDate, validURI, recipient.address)
      ).to.be.revertedWith("Category cannot be empty");

      await expect(
        materialPassport.connect(manufacturer).registerMaterial(validId, validName, validCat, "", validDate, validURI, recipient.address)
      ).to.be.revertedWith("Manufacturer cannot be empty");

      await expect(
        materialPassport.connect(manufacturer).registerMaterial(validId, validName, validCat, validMfg, 0, validURI, recipient.address)
      ).to.be.revertedWith("Invalid manufacture date");

      await expect(
        materialPassport.connect(manufacturer).registerMaterial(validId, validName, validCat, validMfg, validDate, validURI, "0x0000000000000000000000000000000000000000")
      ).to.be.revertedWith("Invalid owner address");
    });
  });

  describe("Lifecycle Events", function () {
    const validId = "MAT-INC718-002";

    beforeEach(async function () {
      await materialPassport
        .connect(manufacturer)
        .registerMaterial(validId, "Inconel 718", "Superalloy", "Airbus Materials Lab", 1719360000, "ipfs://meta", recipient.address);
    });

    it("Should allow INSPECTOR_ROLE to add lifecycle inspection events", async function () {
      const tx = await materialPassport
        .connect(inspector)
        .addLifecycleEvent(validId, "SYNCHROTRON_SCAN", "Lattice grain boundary dislocation verified within ISO 12111 safe thresholds");
      await tx.wait();

      const history = await materialPassport.getMaterialHistory(validId);
      expect(history.length).to.equal(2);
      expect(history[1].eventType).to.equal("SYNCHROTRON_SCAN");
      expect(history[1].description).to.include("ISO 12111");
      expect(history[1].performedBy).to.equal(inspector.address);
    });

    it("Should reject adding lifecycle events by unauthorized account", async function () {
      await expect(
        materialPassport.connect(unauthorized).addLifecycleEvent(validId, "QUALITY_CHECK", "Passed test")
      ).to.be.revertedWithCustomError(materialPassport, "AccessControlUnauthorizedAccount");
    });

    it("Should revert if material does not exist or inputs are empty", async function () {
      await expect(
        materialPassport.connect(inspector).addLifecycleEvent("NON_EXISTENT_ID", "CHECK", "Desc")
      ).to.be.revertedWith("Material not found");

      await expect(
        materialPassport.connect(inspector).addLifecycleEvent(validId, "", "Desc")
      ).to.be.revertedWith("Event type cannot be empty");

      await expect(
        materialPassport.connect(inspector).addLifecycleEvent(validId, "CHECK", "")
      ).to.be.revertedWith("Description cannot be empty");
    });
  });

  describe("Ownership Transfer", function () {
    const validId = "MAT-COMPOSITE-003";

    beforeEach(async function () {
      await materialPassport
        .connect(manufacturer)
        .registerMaterial(validId, "Toray T1100G Carbon Fiber", "Composite", "Toray Carbon", 1719360000, "ipfs://meta", recipient.address);
    });

    it("Should allow WAREHOUSE_ROLE to transfer ownership and record lifecycle event", async function () {
      const newOwner = unauthorized.address;
      const tx = await materialPassport
        .connect(warehouse)
        .transferMaterialOwnership(validId, newOwner);
      await tx.wait();

      const mat = await materialPassport.getMaterial(validId);
      expect(mat.currentOwner).to.equal(newOwner);

      const history = await materialPassport.getMaterialHistory(validId);
      const latestEvent = history[history.length - 1];
      expect(latestEvent.eventType).to.equal("Ownership Transfer");
      expect(latestEvent.performedBy).to.equal(warehouse.address);
    });

    it("Should reject transfer if caller lacks WAREHOUSE_ROLE", async function () {
      await expect(
        materialPassport.connect(unauthorized).transferMaterialOwnership(validId, unauthorized.address)
      ).to.be.revertedWithCustomError(materialPassport, "AccessControlUnauthorizedAccount");
    });
 
    it("Should reject transfer to zero address or to the existing current owner", async function () {
      await expect(
        materialPassport.connect(warehouse).transferMaterialOwnership(validId, "0x0000000000000000000000000000000000000000")
      ).to.be.revertedWith("Invalid owner address");

      await expect(
        materialPassport.connect(warehouse).transferMaterialOwnership(validId, recipient.address)
      ).to.be.revertedWith("Already current owner");
    });
  });

  describe("Material Status Updates", function () {
    const validId = "MAT-BIOPEEK-004";

    beforeEach(async function () {
      await materialPassport
        .connect(manufacturer)
        .registerMaterial(validId, "Bio-PEEK Polymer", "Bio-Polymer", "Evonik Industries", 1719360000, "ipfs://meta", recipient.address);
    });

    it("Should allow INSPECTOR_ROLE to update status to InTransit and Installed", async function () {
      // 1: InTransit
      await materialPassport.connect(inspector).updateMaterialStatus(validId, 1);
      let mat = await materialPassport.getMaterial(validId);
      expect(mat.status).to.equal(1);

      // 2: Installed
      await materialPassport.connect(inspector).updateMaterialStatus(validId, 2);
      mat = await materialPassport.getMaterial(validId);
      expect(mat.status).to.equal(2);
    });

    it("Should allow RECYCLER_ROLE to update status to Recycled and Disposed", async function () {
      // 4: Recycled
      await materialPassport.connect(recycler).updateMaterialStatus(validId, 4);
      const mat = await materialPassport.getMaterial(validId);
      expect(mat.status).to.equal(4);
    });

    it("Should reject status update if unauthorized caller attempts change", async function () {
      await expect(
        materialPassport.connect(unauthorized).updateMaterialStatus(validId, 1)
      ).to.be.revertedWith("Caller lacks INSPECTOR_ROLE");
    });

    it("Should revert if attempting to set the identical status again", async function () {
      // Initial status is 0 (Manufactured)
      await expect(
        materialPassport.connect(inspector).updateMaterialStatus(validId, 0)
      ).to.be.revertedWith("Status already set");
    });
  });

  describe("Material Retrieval and Verification", function () {
    const validId = "MAT-HEA-005";

    beforeEach(async function () {
      await materialPassport
        .connect(manufacturer)
        .registerMaterial(validId, "Cantor High-Entropy Alloy", "HEA", "Max Planck Institute", 1719360000, "ipfs://meta", recipient.address);
    });

    it("verifyMaterial returns true for existing and false for nonexistent or empty id", async function () {
      expect(await materialPassport.verifyMaterial(validId)).to.be.true;
      expect(await materialPassport.verifyMaterial("UNKNOWN_ID_999")).to.be.false;
      expect(await materialPassport.verifyMaterial("")).to.be.false;
    });

    it("getMaterial reverts when material does not exist", async function () {
      await expect(
        materialPassport.getMaterial("NON_EXISTENT")
      ).to.be.revertedWith("Material not found");
    });

    it("getMaterialHistory reverts when material does not exist", async function () {
      await expect(
        materialPassport.getMaterialHistory("NON_EXISTENT")
      ).to.be.revertedWith("Material not found");
    });
  });
});
