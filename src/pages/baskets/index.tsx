import Button from '@/components/Button'
import Typography from '@/components/Typography'
import useBaskets from '@/hooks/baskets/useBaskets'
import { NextSeo } from 'next-seo'
import React from 'react'
import BasketList from './components/BasketList'
import { Icon } from '@/components/Icon'

const Baskets: React.FC = () => {
	const baskets = useBaskets()

	return (
		<>
			<NextSeo title={`Baskets`} description={`Get diversified exposure to crypto assets with Bao Baskets!`} />
			<div className='space-y-12'>
				<div className='lg:col-span-2 flex flex-wrap'>
					<Typography variant='hero' className='stroke'>
						Baskets
					</Typography>
					<div className='mt-4 flex gap-2'>
						<Icon icon='lightbulb' className='m-0 h-6 w-6 flex-none' />
						<Typography className='m-0 pr-1 text-base font-light tracking-tight lg:mb-4'>
							Curated collections of tokens, powered by automated strategies, provide optimal yield opportunities and exposure to various
							sectors.
						</Typography>
					</div>
					<div className='flex lg:block mr-auto'>
						<a
							className='mr-auto'
							href='https://info.bao.finance/docs/franchises/bao-baskets-soft-synths'
							target='_blank'
							rel='noopener noreferrer'
						>
							<Button className='!rounded-full border border-baoRed hover:bg-baoRed'>Learn More</Button>
						</a>
					</div>
				</div>
				<div className='lg:col-span-3'>
					<BasketList baskets={baskets} />
				</div>
			</div>
		</>
	)
}

export default Baskets
