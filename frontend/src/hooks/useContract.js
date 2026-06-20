import { useMemo } from 'react';
import { Contract } from 'ethers';
import { useWallet } from './useWallet';

export function useContract(address, abi, readOnly = false) {
  const { signer, provider } = useWallet();

  return useMemo(() => {
    if (!address || !abi) return null;

    const signerOrProvider = readOnly ? provider : signer;
    
    if (!signerOrProvider) return null;

    return new Contract(address, abi, signerOrProvider);
  }, [address, abi, readOnly, signer, provider]);
}
