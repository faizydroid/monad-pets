import { useState } from 'react';
import { useAccount } from 'wagmi';
import { config } from '../utils/config';

/**
 * Debug panel to help troubleshoot issues
 */
export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAccount();

  const clearMockData = () => {
    if (address) {
      localStorage.removeItem(`mock_mint_${address.toLowerCase()}`);
      console.log('Cleared mock data for', address);
      window.location.reload();
    }
  };

  const triggerMockMint = () => {
    if (address) {
      localStorage.setItem(`mock_mint_${address.toLowerCase()}`, 'true');
      console.log('Triggered mock mint for', address);
      window.location.reload();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#646cff',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '300px',
      zIndex: 1000,
      fontSize: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>Debug Panel</h3>
        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>✕</button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Wallet:</strong> {isConnected ? 'Connected' : 'Not Connected'}<br/>
        <strong>Address:</strong> {address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'None'}<br/>
        <strong>Envio Endpoint:</strong> {config.envioEndpoint.includes('placeholder') ? '🔴 Mock Mode' : '🟢 Real Data'}<br/>
        <strong>Contract:</strong> {config.contractAddress.slice(0,6)}...{config.contractAddress.slice(-4)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button onClick={triggerMockMint} style={{ padding: '5px', fontSize: '11px' }}>
          🎮 Trigger Mock Mint
        </button>
        <button onClick={clearMockData} style={{ padding: '5px', fontSize: '11px' }}>
          🗑️ Clear Mock Data
        </button>
        <button onClick={() => window.location.reload()} style={{ padding: '5px', fontSize: '11px' }}>
          🔄 Reload Page
        </button>
      </div>

      <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
        Check browser console (F12) for detailed logs
      </div>
    </div>
  );
}