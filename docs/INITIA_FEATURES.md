# Calipa Platform - Initia Native Features

## Overview

Calipa Platform implements Initia-native features to enable cross-chain payments and improved user experience.

## Implemented Features

### 1. Interwoven Bridge 🏗️

**What it does:**
- Allows users from ANY blockchain to pay with stablecoins
- Users don't need to first buy Initia tokens to use the app

**Supported source chains:**
- Ethereum (USDC, USDT, DAI)
- Cosmos chains (Osmosis, etc.)
- Solana
- BNB Chain

**How users use it:**
1. User clicks "Bridge" in the app
2. Selects: "Pay with USDC from Ethereum"
3. Bridge transfers USDC → your appchain
4. User gets your service/product

**Code usage:**

```javascript
import { useInterwovenKit } from "@initia/interwovenkit-react"

function PaymentButton() {
  const { openBridge } = useInterwovenKit()

  return (
    <button onClick={() => openBridge({
      srcChainId: "ethereum",
      srcDenom: "usdc"
    })}>
      Pay with USDC
    </button>
  )
}
```

---

### 2. Auto-signing / Session UX 🔐 (Future)

**What it does:**
- Users approve a session key that signs transactions automatically
- No wallet confirmation popup for every action

**Best for:**
- Gaming apps (high-frequency transactions)
- Smooth user experience

---

### 3. Initia Usernames 👤 (Future)

**What it does:**
- Human-readable addresses like `@alice.init`
- Instead of `init1abc...def123`

**Code usage:**

```javascript
import { useInterwovenKit } from "@initia/interwovenkit-react"

function UserDisplay() {
  const { username, initiaAddress } = useInterwovenKit()

  // Show username or fallback to shortened address
  const displayName = username ? username : shortenAddress(initiaAddress)

  return <span>{displayName}</span>
}
```

---

## Why These Features Matter

### For Users
- **No onboarding friction** - users pay with stablecoins they already have
- **Faster transactions** - auto-sign reduces wallet popups
- **Friendly addresses** - easy to remember and share

### For The Project
- **Accessible to everyone** - any crypto user can pay
- **Stablecoin revenue** - receive payments in stable value
- **Hackathon requirement** - meets "at least one Initia-native feature" criteria

---

## Current Implementation Status

| Feature | Status |
|---------|--------|
| Interwoven Bridge | Ready to implement |
| Auto-signing | Not started |
| Usernames | Not started |

---

## References

- [Initia Documentation](https://docs.initia.xyz)
- [InterwovenKit Documentation](https://docs.initia.xyz/interwovenkit)
