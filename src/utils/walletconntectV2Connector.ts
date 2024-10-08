import type WalletConnectProvider from '@walletconnect/ethereum-provider'
import { EthereumProviderOptions } from '@walletconnect/ethereum-provider/dist/types/EthereumProvider'
import { AbstractConnector } from '@web3-react/abstract-connector'

interface ConnectorUpdate {
	provider?: unknown
	chainId?: number
	account?: null | string
}

const RPC_URLS: { [chainId: number]: string } = {
	1: process.env.NEXT_PUBLIC_ALCHEMY_API_URL,
}

export class WalletConnectV2Connector extends AbstractConnector {
	provider?: typeof WalletConnectProvider.prototype

	private readonly options: EthereumProviderOptions

	constructor(options: EthereumProviderOptions) {
		super({ supportedChainIds: Object.keys(options.rpcMap || {}).map(k => Number(k)) })

		this.options = options
	}

	static clearStorage = (storage: Storage) => {
		storage.removeRegExp(new RegExp('^wc@2:'))
	}

	activate = async (): Promise<ConnectorUpdate> => {
		const provider = await import('@walletconnect/ethereum-provider').then(module => {
			return module.default.init({
				projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECTID,
				rpcMap: RPC_URLS,
				chains: [1],
				showQrModal: true,
				// Decentraland's RPCs don't support the `test` method used for the ping.
				disableProviderPing: true,
				qrModalOptions: {
					themeVariables: {
						// Display the WC modal over other Decentraland UI's modals.
						// Won't be visible without this.
						'--wcm-z-index': '3000',
					},
				},
				metadata: {
					name: 'Bao Finance',
					description: 'Deliciously wrapped finance!',
					url: 'https://bao.finance',
					icons: ['%PUBLIC_URL%/twitterCard.png'],
				},
				// Methods and events based on what is used on the decentraland dapps and the ethereum-provider lib found at:
				// https://github.com/WalletConnect/walletconnect-monorepo/blob/v2.0/providers/ethereum-provider/src/constants/rpc.ts
				// If the wallet doesn't support non optional methods, it will not allow the connection.
				methods: ['eth_sendTransaction', 'personal_sign'],
				optionalMethods: [
					'eth_accounts',
					'eth_requestAccounts',
					'eth_sign',
					'eth_signTypedData_v4',
					'wallet_switchEthereumChain',
					'wallet_addEthereumChain',
				],
				events: ['chainChanged', 'accountsChanged'],
				optionalEvents: ['disconnect'],
			})
		})

		const accounts = await provider.enable()

		provider.on('accountsChanged', this.handleAccountsChanged)
		provider.on('chainChanged', this.handleChainChanged)
		provider.on('disconnect', this.handleDisconnect)

		this.provider = provider

		return {
			chainId: provider.chainId,
			account: accounts[0],
			provider,
		}
	}

	getProvider = async (): Promise<WalletConnectProvider | undefined> => {
		if (!this.provider) {
			throw new Error('Provider is undefined')
		}
		return this.provider
	}

	getChainId = async (): Promise<string | number> => {
		if (!this.provider) {
			throw new Error('Provider is undefined')
		}
		return this.provider.chainId
	}

	getAccount = async (): Promise<string | null> => {
		if (!this.provider) {
			throw new Error('Provider is undefined')
		}
		return this.provider.accounts[0]
	}

	getWalletName = (): string | undefined => {
		return this.provider?.session?.peer.metadata.name
	}

	deactivate = (): void => {
		if (!this.provider) {
			return
		}
		this.emitDeactivate()

		this.provider
			.removeListener('accountsChanged', this.handleAccountsChanged)
			.removeListener('chainChanged', this.handleChainChanged)
			.removeListener('disconnect', this.handleDisconnect)
			.disconnect()
	}

	handleAccountsChanged = (accounts: string[]): void => {
		this.emitUpdate({ account: accounts[0] })
	}

	handleChainChanged = (chainId: string | number): void => {
		this.emitUpdate({ chainId })
	}

	handleDisconnect = (): void => {
		if (!this.provider) {
			throw new Error('Provider is undefined')
		}
		this.deactivate()
	}
}
