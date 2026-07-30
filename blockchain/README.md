# MatterMind Blockchain Module

## Overview

The Blockchain module of MatterMind provides a secure and immutable Material Passport system using Ethereum smart contracts. Every material receives a unique digital identity, enabling transparent ownership tracking, lifecycle management, and verification throughout its lifecycle.

---

## Tech Stack

- Solidity ^0.8.28
- Hardhat
- OpenZeppelin Contracts
- Ethers.js
- TypeScript

---

## Features

- Material Registration
- Material Verification
- Material Information Retrieval
- Lifecycle Event Tracking
- Material Ownership Transfer
- Material Status Management
- Role-Based Access Control (RBAC)

---

## Project Structure

```
blockchain/
├── contracts/
│   └── MaterialPassport.sol
├── scripts/
│   └── deploy.ts
├── artifacts/
├── cache/
├── hardhat.config.ts
├── package.json
└── tsconfig.json
```

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Compile Smart Contracts

```bash
npx hardhat compile
```

---

## Deploy Contract

Deploy to the local Hardhat network:

```bash
npx hardhat run scripts/deploy.ts
```

---

## Smart Contract

### MaterialPassport.sol

The contract supports:

- Material registration
- Material verification
- Material ownership transfer
- Lifecycle event recording
- Material status updates
- Role-based access control using OpenZeppelin AccessControl

---

## Roles

The contract defines the following roles:

- DEFAULT_ADMIN_ROLE
- MANUFACTURER_ROLE
- INSPECTOR_ROLE
- WAREHOUSE_ROLE
- RECYCLER_ROLE

---

## License

MIT