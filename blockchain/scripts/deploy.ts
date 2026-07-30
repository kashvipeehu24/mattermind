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

    console.log(
        "MaterialPassport deployed to:",
        await materialPassport.getAddress()
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});