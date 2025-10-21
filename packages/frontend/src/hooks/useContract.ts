import { useContractWrite, useWaitForTransaction, usePrepareContractWrite } from 'wagmi';
import { config } from '../utils/config';
import { MONADGOTCHI_ABI } from '../utils/contractABI';

export type TransactionStatus = 'idle' | 'preparing' | 'pending' | 'success' | 'error';

/**
 * Hook for minting a pet with proper transaction handling
 */
export function useMint() {
  const { config: prepareConfig } = usePrepareContractWrite({
    address: config.contractAddress,
    abi: MONADGOTCHI_ABI,
    functionName: 'mint',
  });

  const { data, write, isLoading: isWriteLoading, error: writeError } = useContractWrite(prepareConfig);

  const { isLoading: isTxLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    mint: write,
    isLoading: isWriteLoading || isTxLoading,
    isSuccess,
    error: writeError,
    txHash: data?.hash,
  };
}

/**
 * Hook for feeding a pet with proper transaction handling
 */
export function useFeed(petId: bigint | undefined) {
  const { config: prepareConfig } = usePrepareContractWrite({
    address: config.contractAddress,
    abi: MONADGOTCHI_ABI,
    functionName: 'feed',
    args: petId !== undefined ? [petId] : undefined,
    enabled: petId !== undefined,
  });

  const { data, write, isLoading: isWriteLoading, error: writeError } = useContractWrite(prepareConfig);

  const { isLoading: isTxLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    feed: write,
    isLoading: isWriteLoading || isTxLoading,
    isSuccess,
    error: writeError,
    txHash: data?.hash,
  };
}
