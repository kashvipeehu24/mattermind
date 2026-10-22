import hre from "hardhat";

async function main() {
    const [deployer] = await hre.network.connect().then(async (connection) => {
        const ethers = await connection.ethers;
        const signers = await ethers.getSigners();
        return signers;
    });

    console.log("Deploying contract with account:", deployer.address);

    const connection = await hre.network.connect();
    const ethers = await connection.ethers;

    const MaterialPassport =
        await ethers.getContractFactory("MaterialPassport");

    const materialPassport =
        await MaterialPassport.deploy(deployer.address);

    await materialPassport.waitForDeployment();

    const contractAddress = await materialPassport.getAddress();
    console.log(
        "MaterialPassport deployed to:",
        contractAddress
    );

    const fs = await import("fs");
    const path = await import("path");
    const deploymentInfo = {
        address: contractAddress,
        deployer: deployer.address,
        network: "localhost",
        deployedAt: new Date().toISOString()
    };
    const outPath = path.resolve(process.cwd(), "deployed_contract.json");
    fs.writeFileSync(outPath, JSON.stringify(deploymentInfo, null, 2));
    console.log("Saved deployment info to:", outPath);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});