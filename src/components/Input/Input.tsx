import React, { ReactNode } from 'react'

import Button from '@/components/Button'
import classNames from 'classnames'

export interface InputProps {
	endAdornment?: ReactNode
	onChange: (e: React.FormEvent<HTMLInputElement>) => void
	placeholder?: string
	startAdornment?: ReactNode
	value: string | undefined
	label?: ReactNode
	disabled?: boolean
	max?: number | string
	symbol?: string
	onSelectMax?: () => void
	onSelectHalf?: () => void
	className?: string
}

const Input: React.FC<InputProps> = ({
	label,
	disabled,
	onSelectMax,
	onSelectHalf,
	endAdornment,
	onChange,
	placeholder,
	startAdornment,
	value,
	className,
}) => {
	return (
		<div className={classNames('align-center flex h-12 w-full rounded border-0 bg-primary-400', className)}>
			<div className='align-center relative flex w-full justify-center align-middle'>
				{!!startAdornment && startAdornment}
				<input
					disabled={disabled}
					type='number'
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className='text-default font-strong relative h-12 w-full min-w-0 
				appearance-none rounded border-solid border-inherit bg-primary-400 pl-4 pr-4 text-start 
				align-middle outline-none outline outline-2 outline-offset-2 transition-all
				 duration-200 disabled:text-baoRed md:text-sm'
				/>
				{!disabled && (
					<>
						{onSelectMax && (
							<div className='flex h-full items-center justify-center'>
								{onSelectHalf && (
									<Button size='xs' onClick={onSelectHalf} className='mr-1'>
										½
									</Button>
								)}
								<Button size='xs' onClick={onSelectMax} className='mr-1'>
									MAX
								</Button>
							</div>
						)}
					</>
				)}
				{!!endAdornment && endAdornment}
			</div>
			{typeof label === 'string' ? <p>{label}</p> : label}
		</div>
	)
}

export default Input
