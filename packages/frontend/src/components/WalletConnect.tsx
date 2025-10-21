import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { config } from '../utils/config';

/**
 * WalletConnect component for connecting MetaMask wallet
 */
export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();

  const isCorrectNetwork = chain?.id === config.chainId;

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleSwitchNetwork = () => {
    if (switchNetwork) {
      switchNetwork(config.chainId);
    }
  };

  if (!isConnected) {
    return (
      <div className="wallet-connect">
        <button onClick={handleConnect} className="connect-button">
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="wallet-connect">
        <div className="network-warning">
          <p>Wrong Network</p>
          <p>Please switch to Monad Testnet</p>
          <button onClick={handleSwitchNetwork} className="switch-network-button">
            Switch Network
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <div className="wallet-info">
        <span className="wallet-address">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button onClick={handleDisconnect} className="disconnect-button">
          Disconnect
        </button>
      </div>
    </div>
  );
}
