# LAOS APIs

**A monorepo for the APIs powering the LAOS blockchain ecosystem.**

## Table of Contents
1. [Overview](#overview)  
2. [Modules](#modules)  
   - [laos-indexer](#1-laos-indexer)  
   - [laos-ownership-indexer](#2-laos-ownership-indexer)
   - [laos-client-api](#3-laos-client-api)  
   - [laos-api-gateway](#4-laos-api-gateway)  
   - [graphql-playground](#5-graphql-playground)
   - [laos-extentions](#6-laos-extentions)
3. [Getting Started](#getting-started)  
4. [License](#license)

---

## Overview

The **LAOS APIs** repository consolidates the tools and components for interacting with the LAOS blockchain. This includes indexing, client APIs, and a GraphQL gateway to manage queries and mutations efficiently.

---

## Modules

### 1. laos-indexer

An indexing service for the LAOS blockchain, built on the [Subsquid](https://subsquid.io/) framework.  
**Purpose:**  
- Index blockchain data for efficient querying.  
- Provide a foundation for data aggregation and analytics.
[See laos-indexer documentation](laos-indexer/README.md)

---

### 2. laos-ownership-indexer

An indexing service for the EVM ownership blockchain, built on the [Subsquid](https://subsquid.io/) framework.  
**Purpose:**  
- Index blockchain data for efficient querying.  
- Provide a foundation for data aggregation and analytics.
[See laos-ownership-indexer documentation](laos-ownership-indexer/README.md)
---

### 3. laos-client-api

A client API for interacting with the LAOS blockchain.  
**Purpose:**  
- Enable minting and evolving assets.  
- Serve as the primary interface for users to interact with LAOS blockchain functionalities.
[See laos-client-api documentation](laos-client-api/README.md)
---

### 4. laos-api-gateway

A GraphQL gateway that consolidates and orchestrates data:  
**Purpose:**  
- Combines queries from the laos-indexer.  
- Executes mutations via the laos-client-api.  
- Provides a unified GraphQL interface for developers.

---

### 5. graphql-playground

An interactive GraphQL playground for the **laos-api-gateway**.  
**Purpose:**  
- Test queries and mutations in a developer-friendly interface.  
- Debug and optimize GraphQL operations.

---

### 6. laos-extentions

A collection of extensions for the LAOS blockchain.  
**Purpose:**  
- Provide additional functionality to the blockchain.  
- Serve as a foundation for data aggregation and analytics.
[See laos-extentions documentation](laos-extentions/README.md)

---

## Getting Started

To get started with the LAOS APIs, follow the instructions in the [Getting Started](./docs/getting-started.md) guide.
