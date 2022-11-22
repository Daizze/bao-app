import { useWeb3React } from '@web3-react/core'
import Config from '@/bao/lib/config'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import useContract from '@/hooks/base/useContract'
import type { Baov2 } from '@/typechain/index'
import useEpochTime from './useEpochTime'

const useMintable = () => {
	const [mintable, setMintable] = useState(BigNumber.from(0))
	const { chainId } = useWeb3React()
	const epochTime = useEpochTime()
	const token = useContract<Baov2>('Baov2', Config.contracts.Baov2[chainId].address)

	const fetchMintable = useCallback(async () => {
		const mintable = await token.mintable_in_timeframe(epochTime.start, epochTime.future)
		setMintable(mintable)
	}, [epochTime, token])

	useEffect(() => {
		if (epochTime && token) {
			fetchMintable()
		}
	}, [fetchMintable, token, epochTime])

	return mintable
}

export default useMintable