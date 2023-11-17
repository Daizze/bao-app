/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Contract, Signer, utils } from 'ethers'
import type { Provider } from '@ethersproject/providers'
import type { Unioracle, UnioracleInterface } from '../Unioracle'

const _abi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: 'factory',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'tokenA',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'tokenB',
				type: 'address',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'update',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'blockTimestampLast',
		outputs: [
			{
				internalType: 'uint32',
				name: '',
				type: 'uint32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amountIn',
				type: 'uint256',
			},
		],
		name: 'consult',
		outputs: [
			{
				internalType: 'uint256',
				name: 'amountOut',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'PERIOD',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'price0Average',
		outputs: [
			{
				internalType: 'uint224',
				name: '_x',
				type: 'uint224',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'price0CumulativeLast',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'price1Average',
		outputs: [
			{
				internalType: 'uint224',
				name: '_x',
				type: 'uint224',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'price1CumulativeLast',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'token0',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'token1',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
]

export class Unioracle__factory {
	static readonly abi = _abi
	static createInterface(): UnioracleInterface {
		return new utils.Interface(_abi) as UnioracleInterface
	}
	static connect(address: string, signerOrProvider: Signer | Provider): Unioracle {
		return new Contract(address, _abi, signerOrProvider) as Unioracle
	}
}
