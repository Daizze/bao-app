import Config from '@/bao/lib/config'
import useBao from '@/hooks/base/useBao'
import { useBlockUpdater } from '@/hooks/base/useBlock'
import useContract from '@/hooks/base/useContract'
import { useTxReceiptUpdater } from '@/hooks/base/useTransactionProvider'
import { Dai, Lusd, Stabilizer, Weth } from '@/typechain/index'
import { providerKey } from '@/utils/index'
import Multicall from '@/utils/multicall'
import { useQuery } from '@tanstack/react-query'
import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { getUnixTime } from 'date-fns'
import { MongoDBStorage } from '@/utils/storage/MongoDBStorage'

const useBallastInfo = (vaultName: string) => {
	const bao = useBao()
	const { library, account, chainId } = useWeb3React()
	const ballast = useContract<Stabilizer>('Stabilizer', Config.vaults[vaultName].stabilizer)
	const lusd = useContract<Lusd>('Lusd', Config.contracts.Lusd[chainId].address)
	const weth = useContract<Weth>('Weth', Config.contracts.Weth[chainId].address)

	const enabled = !!bao && !!library && !!ballast && !!lusd
	const { data: ballastInfo, refetch } = useQuery(
		['@/hooks/ballast/useBallastInfo', providerKey(library, account, chainId), { enabled }],
		async () => {
			const ballastQueries = Multicall.createCallContext([
				{
					ref: 'Ballast',
					contract: ballast,
					calls: [{ method: 'supplyCap' }, { method: 'buyFee' }, { method: 'sellFee' }, { method: 'FEE_DENOMINATOR' }],
				},
				{
					ref: 'LUSD',
					contract: lusd,
					calls: [{ method: 'balanceOf', params: [ballast.address] }],
				},
				{
					ref: 'WETH',
					contract: weth,
					calls: [{ method: 'balanceOf', params: [ballast.address] }],
				},
			])

			const storage = MongoDBStorage()
			const localData = await storage.readRecord('ballast', 'vault', vaultName).then(res => {
				return res
			})

			const timestamp = getUnixTime(new Date())

			if (typeof localData == 'object' && localData.hasOwnProperty('timestamp') && localData.timestamp > timestamp - 3600) {
				return localData
			}

			const { Ballast: ballastRes, LUSD: lusdRes, WETH: wethRes } = Multicall.parseCallResults(await bao.multicall.call(ballastQueries))
			const reserves = vaultName === 'baoUSD' ? lusdRes[0].values[0] : wethRes[0].values[0]

			const returnData = {
				timestamp: timestamp,
				reserves: reserves,
				supplyCap: ballastRes[0].values[0],
			}

			await storage.updateRecord('ballast', returnData, 'vault', vaultName)

			return returnData
		},
		{
			enabled,
		},
	)

	const _refetch = () => {
		if (enabled) refetch()
	}

	useEffect(() => {
		_refetch()
	}, [ballast])

	useTxReceiptUpdater(_refetch)
	useBlockUpdater(_refetch, 10)

	return ballastInfo
}

export default useBallastInfo
