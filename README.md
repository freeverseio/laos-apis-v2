# LAOS APIs

**A monorepo for the APIs powering the LAOS blockchain ecosystem.**

## Table of Contents
1. [Overview](#overview)  
2. [Modules](#modules)  
   - [laos-indexer](#1-laos-indexer)  
   - [laos-client-api](#2-laos-client-api)  
   - [laos-api-gateway](#3-laos-api-gateway)  
   - [graphql-playground](#4-graphql-playground)  
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

---

### 2. laos-client-api

A client API for interacting with the LAOS blockchain.  
**Purpose:**  
- Enable minting and evolving assets.  
- Serve as the primary interface for users to interact with LAOS blockchain functionalities.

---

### 3. laos-api-gateway

A GraphQL gateway that consolidates and orchestrates data:  
**Purpose:**  
- Combines queries from the laos-indexer.  
- Executes mutations via the laos-client-api.  
- Provides a unified GraphQL interface for developers.

---

### 4. graphql-playground

An interactive GraphQL playground for the **laos-api-gateway**.  
**Purpose:**  
- Test queries and mutations in a developer-friendly interface.  
- Debug and optimize GraphQL operations.

---