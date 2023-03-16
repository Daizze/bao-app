import Config from '@/bao/lib/config'
import { ActiveSupportedBasket } from '@/bao/lib/types'
import { Experipie__factory, Oven__factory, SimpleUniRecipe__factory } from '@/typechain/factories'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'

const useBaskets = (): ActiveSupportedBasket[] => {
	const { chainId, library, account } = useWeb3React()

	const baskets = useMemo(() => {
		if (!library) return null
		const signerOrProvider = account ? library.getSigner() : library

		const bs = Config.baskets.map(basket => {
			const address = basket.basketAddresses[chainId]
			const basketContract = Experipie__factory.connect(address, signerOrProvider)
			const recipeContract = SimpleUniRecipe__factory.connect(basket.recipeAddress, signerOrProvider)
			const ovenContract = Oven__factory.connect(basket.ovenAddress, signerOrProvider)
			return Object.assign(basket, { address, basketContract, recipeContract, ovenContract })
		})

		return bs
	}, [library, account, chainId])

	return baskets
}

export default useBaskets
