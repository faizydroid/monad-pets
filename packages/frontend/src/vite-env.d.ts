/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_MONAD_RPC_URL: string;
  readonly VITE_CHAIN_ID: string;
  readonly VITE_ENVIO_ENDPOINT: string;
  readonly VITE_AGENT_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
