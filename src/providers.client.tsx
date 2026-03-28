import { useEffect } from "react"
import {
  injectStyles,
  InterwovenKitProvider,
  TESTNET,
} from "@initia/interwovenkit-react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { mainnet } from "wagmi/chains"
import interwovenKitStyles from "@initia/interwovenkit-react/styles.js"

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
})

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inject styles into the shadow DOM used by Initia Wallet
    injectStyles(interwovenKitStyles)
  }, [])
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <InterwovenKitProvider {...TESTNET} defaultChainId="initiation-2">
          {children}
        </InterwovenKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
