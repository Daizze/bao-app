import useBao from '@/hooks/base/useBao'
import { useWeb3React } from '@web3-react/core'
import { useQuery } from '@tanstack/react-query'
import { providerKey } from '@/utils/index'
import { Contract } from '@ethersproject/contracts'
import { Ctoken__factory } from '@/typechain/factories'
import MultiCall from '@/utils/multicall'
import Config from '@/bao/lib/config'
import { BigNumber } from 'ethers'

export const useTotalDebt = (marketName: string): BigNumber => {
	const bao = useBao()
	const { account, library, chainId } = useWeb3React()

	const enabled = !!bao && !!account && !!chainId
	const { data: totalDebt } = useQuery(
		['@/hooks/lend/useTotalDebts', providerKey(library, account, chainId), { enabled }],
		async () => {
			const address = Config.lendMarkets[marketName].marketAddresses[chainId]
			const contracts: Contract[] = [Ctoken__factory.connect(address, library)]

			const res = MultiCall.parseCallResults(
				await bao.multicall.call(
					MultiCall.createCallContext(
						contracts.map(contract => ({
							ref: contract.address,
							contract,
							calls: [
								{ method: 'symbol' },
								{
									method: 'totalBorrows',
								},
							],
						})),
					),
				),
			)
			return res[address][1].values[0]
		},
		{
			enabled,
		},
	)

	return totalDebt
}
