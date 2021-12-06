import React, { useState } from 'react'
import styled from 'styled-components'
import { MarketOperations } from './Modals'
import BigNumber from 'bignumber.js'
import useTransactionProvider from '../../../hooks/useTransactionProvider'
import useBao from '../../../hooks/useBao'
import { useWallet } from 'use-wallet'
import { useApprovals } from '../../../hooks/hard-synths/useApprovals'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Config from '../../../bao/lib/config'
import { approvev2 } from '../../../bao/utils'
import { decimate } from '../../../utils/numberFormat'
import { TransactionReceipt } from 'web3-core'
import { SupportedMarket } from 'bao/lib/types'

type MarketButtonProps = {
	operation: MarketOperations
	asset: SupportedMarket
	val: BigNumber
	isDisabled: boolean
}

export const MarketButton = ({
	operation,
	asset,
	val,
	isDisabled,
}: MarketButtonProps) => {
	const [pendingTx, setPendingTx] = useState<string | boolean>(false)

	const { onAddTransaction, onTxReceipt } = useTransactionProvider()
	const bao = useBao()
	const { account } = useWallet()
	const { approvals } = useApprovals(pendingTx)

	const clearPendingTx = () => {
		setPendingTx(false)
	}

	const handlePendingTx = (hash: string, description: string) => {
		onAddTransaction({
			hash,
			description,
		})
		setPendingTx(hash)
	}

	const handleReceipt = (receipt: TransactionReceipt) => {
		onTxReceipt(receipt)
		setPendingTx(false)
	}

	const marketContract = bao.getNewContract(
		asset.underlying === 'ETH' ? 'cether.json' : 'ctoken.json',
		asset.token,
	)

	if (pendingTx) {
		return (
			<ButtonStack>
				<SubmitButton disabled={true}>
					{typeof pendingTx === 'string' ? (
						<ExternalLink
							href={`${Config.defaultRpc.blockExplorerUrls}/tx/${pendingTx}`}
							target="_blank"
						>
							Pending Transaction <FontAwesomeIcon icon="external-link-alt" />
						</ExternalLink>
					) : (
						'Pending Transaction'
					)}
				</SubmitButton>
			</ButtonStack>
		)
	} else {
		switch (operation) {
			case MarketOperations.supply:
				return (
					<ButtonStack>
						{approvals &&
						(asset.underlying === 'ETH' ||
							approvals[asset.underlying].gt(0)) ? (
							<SubmitButton
								disabled={isDisabled}
								onClick={() => {
									let mintTx
									if (asset.underlying === 'ETH')
										mintTx = marketContract.methods
											.mint()
											.send({ from: account, value: val.toString() })
									else
										mintTx = marketContract.methods
											.mint(val.toString())
											.send({ from: account })
									mintTx
										.on('transactionHash', (txHash: string) =>
											handlePendingTx(
												txHash,
												`Supply ${decimate(val, asset.decimals).toFixed(4)} ${
													asset.underlyingSymbol
												}`,
											),
										)
										.on('receipt', (receipt: TransactionReceipt) =>
											handleReceipt(receipt),
										)
										.on('error', clearPendingTx)
									setPendingTx(true)
								}}
							>
								Supply
							</SubmitButton>
						) : (
							<SubmitButton
								disabled={!approvals}
								onClick={() => {
									const underlyingContract = bao.getNewContract(
										'erc20.json',
										asset.underlying,
									)
									approvev2(underlyingContract, marketContract, account)
										.on('transactionHash', (txHash: string) =>
											handlePendingTx(
												txHash,
												`Approve ${asset.underlyingSymbol}`,
											),
										)
										.on('receipt', (receipt: TransactionReceipt) =>
											handleReceipt(receipt),
										)
										.on('error', clearPendingTx)
									setPendingTx(true)
								}}
							>
								Approve {asset.underlyingSymbol}
							</SubmitButton>
						)}
					</ButtonStack>
				)

			case MarketOperations.withdraw:
				return (
					<ButtonStack>
						<SubmitButton
							disabled={isDisabled}
							onClick={() => {
								marketContract.methods
									.redeemUnderlying(val.toString())
									.send({ from: account })
									.on('transactionHash', (txHash: string) =>
										handlePendingTx(
											txHash,
											`Withdraw ${decimate(val, asset.decimals).toFixed(4)} ${
												asset.underlyingSymbol
											}`,
										),
									)
									.on('receipt', (receipt: TransactionReceipt) =>
										handleReceipt(receipt),
									)
									.on('error', clearPendingTx)
								setPendingTx(true)
							}}
						>
							Withdraw
						</SubmitButton>
					</ButtonStack>
				)

			case MarketOperations.borrow:
				return (
					<SubmitButton
						disabled={isDisabled}
						onClick={() => {
							marketContract.methods
								.borrow(val.toString())
								.send({ from: account })
								.on('transactionHash', (txHash: string) =>
									handlePendingTx(
										txHash,
										`Borrow ${decimate(val, asset.decimals).toFixed(4)} ${
											asset.symbol
										}`,
									),
								)
								.on('receipt', (receipt: TransactionReceipt) =>
									handleReceipt(receipt),
								)
								.on('error', clearPendingTx)
							setPendingTx(true)
						}}
					>
						Borrow
					</SubmitButton>
				)

			case MarketOperations.repay:
				return (
					<ButtonStack>
						{approvals &&
						(asset.underlying === 'ETH' ||
							approvals[asset.underlying].gt(0)) ? (
							<SubmitButton
								disabled={isDisabled}
								onClick={() => {
									let repayTx
									if (asset.underlying === 'ETH')
										repayTx = marketContract.methods
											.repayBorrow()
											.send({ from: account, value: val.toString() })
									else
										repayTx = marketContract.methods
											.repayBorrow(val.toString())
											.send({ from: account })
									repayTx
										.on('transactionHash', (txHash: string) =>
											handlePendingTx(
												txHash,
												`Repay ${decimate(val, asset.decimals).toFixed(4)} ${
													asset.underlyingSymbol
												}`,
											),
										)
										.on('receipt', (receipt: TransactionReceipt) =>
											handleReceipt(receipt),
										)
										.on('error', clearPendingTx)
									setPendingTx(true)
								}}
							>
								Repay
							</SubmitButton>
						) : (
							<SubmitButton
								disabled={!approvals}
								onClick={() => {
									const underlyingContract = bao.getNewContract(
										'erc20.json',
										asset.underlying,
									)
									approvev2(underlyingContract, marketContract, account)
										.on('transactionHash', (txHash: string) =>
											handlePendingTx(
												txHash,
												`Approve ${asset.underlyingSymbol}`,
											),
										)
										.on('receipt', (receipt: TransactionReceipt) =>
											handleReceipt(receipt),
										)
										.on('error', clearPendingTx)
									setPendingTx(true)
								}}
							>
								Approve {asset.underlyingSymbol}
							</SubmitButton>
						)}
					</ButtonStack>
				)
		}
	}
}

const ButtonStack = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`

const ExternalLink = styled.a`
	color: ${(props) => props.theme.color.text[100]};
`

export const SubmitButton = styled.button`
	display: inline-flex;
	appearance: none;
	align-items: center;
	justify-content: center;
	user-select: none;
	position: relative;
	white-space: nowrap;
	vertical-align: middle;
	outline-offset: 2px;
	width: 100%;
	line-height: 1.2;
	font-weight: ${(props) => props.theme.fontWeight.strong};
	transition-property: all;
	height: 50px;
	min-width: 2.5rem;
	font-size: ${(props) => props.theme.fontSize.default};
	padding-inline-start: 1rem;
	padding-inline-end: 1rem;
	border: none;
	background-color: ${(props) => props.theme.color.primary[300]};
	outline: transparent solid 2px;
	border-radius: 8px;
	color: ${(props) => props.theme.color.text[100]};
	opacity: ${(props) => (props.disabled ? 0.5 : 1)};
	position: relative;
	transition: 0.5s;
	overflow: hidden;

	&:focus {
		outline: 0;
	}

	&:hover {
		background: ${(props) => props.theme.color.primary[200]};
		cursor: pointer;
	}

	&:hover,
	&:focus,
	&:active {
		color: ${(props) => (!props.disabled ? props.color : `${props.color}`)};
		cursor: ${(props) =>
			props.disabled ? 'not-allowed' : 'pointer'} !important;
	}
`
