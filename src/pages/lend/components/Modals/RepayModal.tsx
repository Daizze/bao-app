/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ActiveSupportedVault } from '@/bao/lib/types'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { PendingTransaction } from '@/components/Loader/Loader'
import Modal from '@/components/Modal'
import Typography from '@/components/Typography'
import useContract from '@/hooks/base/useContract'
import useTransactionHandler from '@/hooks/base/useTransactionHandler'
import { useAccountLiquidity } from '@/hooks/vaults/useAccountLiquidity'
import { useApprovals } from '@/hooks/vaults/useApprovals'
import { useAccountBalances, useBorrowBalances, useSupplyBalances } from '@/hooks/vaults/useBalances'
import { useExchangeRates } from '@/hooks/vaults/useExchangeRates'
import { Erc20 } from '@/typechain/Erc20'
import { decimate, exponentiate, getDisplayBalance, sqrt } from '@/utils/numberFormat'
import { faExternalLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BigNumber, ethers } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import Image from 'next/future/image'
import React, { useCallback, useMemo, useState } from 'react'
import MarketButton from '../MarketButton'

export type RepayModalProps = {
	asset: ActiveSupportedVault
	show: boolean
	onHide: () => void
	vaultName: string
}

const RepayModal = ({ asset, show, onHide, vaultName }: RepayModalProps) => {
	const [val, setVal] = useState<string>('')
	const balances = useAccountBalances(vaultName)
	const borrowBalances = useBorrowBalances(vaultName)
	const supplyBalances = useSupplyBalances(vaultName)
	const accountLiquidity = useAccountLiquidity(vaultName)
	const { exchangeRates } = useExchangeRates(vaultName)
	const { approvals } = useApprovals(vaultName)
	const erc20 = useContract<Erc20>('Erc20', asset.underlyingAddress)

	const { pendingTx, txHash, handleTx } = useTransactionHandler()
	const { vaultContract } = asset

	const operation = 'Repay'

	const supply = useMemo(
		() =>
			supplyBalances &&
			supplyBalances.find(balance => balance.address.toLowerCase() === asset.vaultAddress.toLowerCase()) &&
			exchangeRates &&
			exchangeRates[asset.vaultAddress]
				? decimate(
						supplyBalances
							.find(balance => balance.address.toLowerCase() === asset.vaultAddress.toLowerCase())
							.balance.mul(exchangeRates[asset.vaultAddress]),
					)
				: BigNumber.from(0),
		[supplyBalances, exchangeRates, asset.vaultAddress],
	)

	let _imfFactor = asset.imfFactor
	if (accountLiquidity) {
		const _sqrt = sqrt(supply)
		const num = exponentiate(parseUnits('1.1'))
		const denom = decimate(asset.imfFactor.mul(_sqrt).add(parseUnits('1')))
		_imfFactor = num.div(denom)
	}

	let withdrawable = BigNumber.from(0)
	if (_imfFactor.gt(asset.collateralFactor) && asset.price.gt(0)) {
		if (asset.collateralFactor.mul(asset.price).gt(0)) {
			withdrawable = accountLiquidity && exponentiate(accountLiquidity.usdBorrowable).div(decimate(asset.collateralFactor.mul(asset.price)))
		} else {
			withdrawable = accountLiquidity && exponentiate(accountLiquidity.usdBorrowable).div(decimate(_imfFactor).mul(asset.price))
		}
	}

	const max = () => {
		if (borrowBalances && balances) {
			const borrowBalance = borrowBalances.find(_balance => _balance.address.toLowerCase() === asset.vaultAddress.toLowerCase()).balance
			const walletBalance = balances.find(_balance => _balance.address.toLowerCase() === asset.underlyingAddress.toLowerCase()).balance
			return walletBalance.lt(borrowBalance) ? walletBalance : borrowBalance
		} else {
			return BigNumber.from(0)
		}
	}

	const handleChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			if (e.currentTarget.value.length < 20) setVal(e.currentTarget.value)
		},
		[setVal],
	)

	const hideModal = useCallback(() => {
		onHide()
		setVal('')
	}, [onHide])

	return (
		<>
			<Modal isOpen={show} onDismiss={hideModal}>
				<Modal.Header onClose={hideModal}>
					<div className='mx-0 my-auto flex h-full items-center text-baoWhite'>
						<Typography variant='xl' className='mr-1 inline-block'>
							Repay
						</Typography>
						<Image src={`/images/tokens/${asset.icon}`} width={32} height={32} alt={asset.underlyingSymbol} />
					</div>
				</Modal.Header>
				<>
					<Modal.Body>
						<div className='mb-4 flex h-full flex-col items-center justify-center'>
							<div className='flex w-full flex-row'>
								<div className='float-left mb-1 flex w-full items-center justify-end gap-1'>
									<Typography variant='sm' className='font-bakbak text-baoRed'>
										Availalble:
									</Typography>
									<Typography variant='sm' className='font-bakbak'>{`${getDisplayBalance(max(), asset.underlyingDecimals)} ${
										asset.underlyingSymbol
									}`}</Typography>
								</div>
							</div>
							<Input
								value={val}
								onChange={handleChange}
								onSelectMax={() => setVal(formatUnits(max(), asset.underlyingDecimals))}
								label={
									<div className='flex flex-row items-center pl-2 pr-4'>
										<div className='flex w-6 justify-center'>
											<Image
												src={`/images/tokens/${asset.icon}`}
												width={32}
												height={32}
												alt={asset.symbol}
												className='block h-6 w-6 align-middle'
											/>
										</div>
									</div>
								}
							/>
						</div>
					</Modal.Body>
					<Modal.Actions>
						<MarketButton
							operation={operation}
							asset={asset}
							val={val ? parseUnits(val, asset.underlyingDecimals) : BigNumber.from(0)}
							isDisabled={!val}
							onHide={onHide}
							vaultName={vaultName}
						/>
					</Modal.Actions>
				</>
			</Modal>
		</>
	)
}

export default RepayModal
