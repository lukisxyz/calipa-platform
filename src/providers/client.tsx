import { useEffect } from "react";
import {
  injectStyles,
  InterwovenKitProvider,
  TESTNET,
} from "@initia/interwovenkit-react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, sepolia } from "wagmi/chains";
import CalipaSchedulingAbi from "../abi/CalipaScheduling.json";

const queryClient = new QueryClient();

const CONTRACT_ADDRESS = import.meta.env.VITE_CALIPA_SCHEDULING_ADDRESS;

export const calipaSchedulingConfig = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: CalipaSchedulingAbi.abi,
} as const;

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: { [mainnet.id]: http(), [sepolia.id]: http() },
});

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    import("@initia/interwovenkit-react/styles.js").then((styles) => {
      injectStyles(styles.default);
    });
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <InterwovenKitProvider {...TESTNET} defaultChainId="initiation-2">
          {children}
        </InterwovenKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
