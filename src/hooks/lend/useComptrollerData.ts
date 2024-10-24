import useBao from '@/hooks/base/useBao'
import { useWeb3React } from '@web3-react/core'
import { useQuery } from '@tanstack/react-query'
import { providerKey } from '@/utils/index'
import { Comptroller__factory } from '@/typechain/factories'
import Config from '@/bao/lib/config'
import { BigNumber } from 'ethers'
import { ContractCallContext, ContractCallResults, Multicall } from 'ethereum-multicall'
import { forEach } from 'lodash'

export const useComptrollerData = (marketName: string): ComptrollerData[] => {
	const bao = useBao()
	const { account, library, chainId } = useWeb3React()
	const signerOrProvider = account ? library.getSigner() : library
	const enabled = !!bao && !!account && !!chainId
	const { data: comptrollerData } = useQuery(
		['@/hooks/lend/useComptrollerData', providerKey(library, account, chainId), { enabled }],
		async () => {
			/*
			const multicall = new Multicall({ ethersProvider: library, tryAggregate: true })
			const multicallContext: ContractCallContext[] = []
			const comptroller = Comptroller__factory.connect(Config.lendMarkets[marketName].comptroller, signerOrProvider)

			forEach(Config.lendMarkets[marketName].assets, asset => {
				multicallContext.push({
					reference: asset.marketAddress[chainId],
					contractAddress: comptroller.address,
					abi: Comptroller__factory.abi,
					calls: [
						{
							reference: 'markets',
							methodName: 'markets',
							methodParameters: [asset.marketAddress[chainId]],
						},
						{
							reference: 'compBorrowState',
							methodName: 'compBorrowState',
							methodParameters: [asset.marketAddress[chainId]],
						},
						{
							reference: 'borrowRestricted',
							methodName: 'borrowRestricted',
							methodParameters: [asset.marketAddress[chainId]],
						},
					],
				})
			})

			const multicallResults: ContractCallResults = await multicall.call(multicallContext)

			return Object.values(multicallResults.results).map(data => {
				return {
					address: data.originalContractCallContext.reference,
					collateralFactor: data.callsReturnContext.find(call => call.reference === 'markets')?.returnValues[1],
					imfFactor: data.callsReturnContext.find(call => call.reference === 'markets')?.returnValues[2],
				}
			})

			 */

			if (!enabled) return null

			const multicall = new Multicall({ ethersProvider: library, tryAggregate: true })
			const comptroller = Comptroller__factory.connect(Config.lendMarkets[marketName].comptroller, signerOrProvider)

			const multicallContext = Config.lendMarkets[marketName].assets.map(asset => ({
				reference: asset.marketAddress[chainId],
				contractAddress: comptroller.address,
				abi: Comptroller__factory.abi,
				calls: [
					{ reference: 'markets', methodName: 'markets', methodParameters: [asset.marketAddress[chainId]] },
					{ reference: 'compBorrowState', methodName: 'compBorrowState', methodParameters: [asset.marketAddress[chainId]] },
					{ reference: 'borrowRestricted', methodName: 'borrowRestricted', methodParameters: [asset.marketAddress[chainId]] },
				],
			}))

			const multicallResults = await multicall.call(multicallContext)

			return Object.entries(multicallResults.results).map(([address, data]) => ({
				address,
				collateralFactor: data.callsReturnContext.find(call => call.reference === 'markets')?.returnValues[1],
				imfFactor: data.callsReturnContext.find(call => call.reference === 'markets')?.returnValues[2],
			}))
		},

		{
			enabled,
		},
	)

	return comptrollerData
}

type ComptrollerData = {
	address: string
	collateralFactor: BigNumber
	imfFactor: BigNumber
}