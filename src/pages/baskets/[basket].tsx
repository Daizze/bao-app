import Badge from '@/components/Badge'
import PageHeader from '@/components/PageHeader'
import Tooltipped from '@/components/Tooltipped'
import useBasketInfo from '@/hooks/baskets/useBasketInfo'
import useBasketRates from '@/hooks/baskets/useBasketRate'
import useBaskets from '@/hooks/baskets/useBaskets'
import useComposition from '@/hooks/baskets/useComposition'
import usePairPrice from '@/hooks/baskets/usePairPrice'
import { getDisplayBalance } from '@/utils/numberFormat'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { faAngleDoubleRight, faFileContract } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useMemo } from 'react'
import Loader from '../../components/Loader'
import BasketButtons from './components/BasketButtons'
import BasketStats from './components/BasketStats'
import Composition from './components/Composition'
import Description from './components/Description'
//import { formatUnits, parseUnits } from 'ethers/lib/utils'

export async function getStaticPaths() {
	return {
		paths: [{ params: { basket: 'bSTBL' } }, { params: { basket: 'bETH' } }],
		fallback: false, // can also be true or 'blocking'
	}
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps({ params }: { params: any }) {
	const { basket } = params

	return {
		props: {
			basketId: basket,
		},
	}
}

const Basket: NextPage<{
	basketId: string
}> = ({ basketId }) => {
	const baskets = useBaskets()

	const basket = useMemo(() => {
		if (!baskets) return
		return baskets.find(basket => basket.symbol === basketId)
	}, [basketId, baskets])

	const composition = useComposition(basket)
	const rates = useBasketRates(basket)
	const info = useBasketInfo(basket)
	const pairPrice = usePairPrice(basket)

	return basket ? (
		<>
			<NextSeo title={`${basketId} Basket`} description={`Mint or Redeem ${basketId}`} />
			<div className='top-4 right-4 float-right mt-4 text-2xl hover:cursor-pointer'>
				<Tooltipped content='View Contract on Etherscan' placement='bottom'>
					<a
						className='float-right mt-2 mr-3 align-middle text-xl hover:cursor-pointer'
						href={`https://etherscan.io/address/${basket.basketAddresses[1]}`}
						target='_blank'
						rel='noreferrer'
					>
						<FontAwesomeIcon icon={faFileContract} className='hover:text-text-400' />
					</a>
				</Tooltipped>
			</div>
			<div className='mx-auto mt-6 mb-0 ml-7 box-border flex flex-col items-center'>
				<PageHeader icon={`/images/tokens/${basket.icon}`} title={basket.symbol} />
				<Badge>
					1 {basket.symbol} ={' '}
					{rates ? (
						<>
							<FontAwesomeIcon icon={faEthereum} /> {getDisplayBalance(rates.eth)} <FontAwesomeIcon icon={faAngleDoubleRight} />{' '}
							{getDisplayBalance(rates.dai)}
							{' DAI '}
							<FontAwesomeIcon icon={faAngleDoubleRight} /> {`$${getDisplayBalance(rates.usd)}`}
						</>
					) : (
						<Loader />
					)}
				</Badge>
			</div>
			<BasketStats basket={basket} composition={composition} rates={rates} info={info} pairPrice={pairPrice} />
			<BasketButtons basket={basket} swapLink={basket.swap} />
			<Composition composition={composition} rates={rates} info={info} basketId={basketId} />
			<Description basketAddress={basket.basketAddresses[1]} />
		</>
	) : (
		<Loader />
	)
}

export default Basket
