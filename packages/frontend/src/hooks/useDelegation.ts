import { useState, useEffect } from 'react';
import { useContractRead, useContractWrite, useWaitForTransaction, useAccount } from 'wagmi';
import { config } from '../utils/config';
import { MONADGOTCHI_ABI } from '../utils/contractABI';

/**
 * Hook for managing delegation to the Pet Sitter Agent
 */
export function useDelegation(petId: bigint | undefined) {
  const { address } = useAccount();
  const [isDelegated, setIsDelegated] = useState(false);

  // Check if delegation exists
  const { data: delegationStatus, refetch } = useContractRead({
    address: config.contractAddress,
    abi: MONADGOTCHI_ABI,
    functionName: 'delegations',
    args:
      address && petId !== undefined
        ? [address, config.agentAddress, petId]
        : undefined,
    enabled: !!address && petId !== undefined && !!config.agentAddress,
    watch: true,
  });

  useEffect(() => {
    setIsDelegated(!!delegationStatus);
  }, [delegationStatus]);

  // Grant delegation
  const {
    data: grantData,
    write: grantWrite,
    isLoading: isGrantLoading,
    error: grantError,
  } = useContractWrite({
    address: config.contractAddress,
    abi: MONADGOTCHI_ABI,
    functionName: 'grantDelegation',
    args: petId !== undefined ? [config.agentAddress, petId] : undefined,
  });

  const { isLoading: isGrantTxLoading, isSuccess: isGrantSuccess } = useWaitForTransaction({
    hash: grantData?.hash,
  });

  // Revoke delegation
  const {
    data: revokeData,
    write: revokeWrite,
    isLoading: isRevokeLoading,
    error: revokeError,
  } = useContractWrite({
    address: config.contractAddress,
    abi: MONADGOTCHI_ABI,
    functionName: 'revokeDelegation',
    args: petId !== undefined ? [config.agentAddress, petId] : undefined,
  });

  const { isLoading: isRevokeTxLoading, isSuccess: isRevokeSuccess } = useWaitForTransaction({
    hash: revokeData?.hash,
  });

  // Refetch delegation status after successful transactions
  useEffect(() => {
    if (isGrantSuccess || isRevokeSuccess) {
      refetch();
    }
  }, [isGrantSuccess, isRevokeSuccess, refetch]);

  return {
    isDelegated,
    grantDelegation: grantWrite,
    revokeDelegation: revokeWrite,
    isGranting: isGrantLoading || isGrantTxLoading,
    isRevoking: isRevokeLoading || isRevokeTxLoading,
    grantError,
    revokeError,
    grantTxHash: grantData?.hash,
    revokeTxHash: revokeData?.hash,
  };
}
