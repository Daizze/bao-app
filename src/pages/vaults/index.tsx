import Button from '@/components/Button'
import { Icon } from '@/components/Icon'
import Typography from '@/components/Typography'
import VaultList from '@/pages/vaults/components/VaultList'
import { NextSeo } from 'next-seo'
import React from 'react'

const Vaults: React.FC = () => {
	return (
		<>
			<NextSeo title={'Vaults'} description={'Provide different collateral types to mint synthetics.'} />
			<div className=' space-y-12'>
				<div className='lg:col-span-2 flex flex-wrap'>
					<Typography variant='hero' className='stroke'>
						Vaults
					</Typography>
					<div className='mt-4 flex gap-2'>
						<Icon icon='lightbulb' className='m-0 h-6 w-6 flex-none' />
						<Typography className='m-0 pr-1 text-base font-light tracking-tight lg:mb-4'>
							Mint price-stable synthetic assets instantly and on your terms, utilizing our yield-bearing Bao Baskets or ETH as collateral.
						</Typography>
					</div>

					<div className='flex lg:block mr-auto'>
						<a
							className='mr-auto'
							href='https://info.bao.finance/docs/franchises/bao-markets-hard-synths'
							target='_blank'
							rel='noopener noreferrer'
						>
							<Button className='!rounded-full border border-baoRed hover:bg-baoRed'>Learn More</Button>
						</a>
					</div>
				</div>
				<div className='lg:col-span-3'>
					<VaultList />
				</div>
			</div>
		</>
	)
}

export default Vaults
