/* eslint-disable */
import React, { useId } from 'react'
import clsx from 'clsx'

import WarningIcon from '@/components/Icons/WarningIcon'
import LightbulbIcon from '../Icons/LightbulbIcon'
import ArchivedIcon from '@/components/Icons/ArchivedIcon'

const icons = {
	warning: WarningIcon,
	lightbulb: LightbulbIcon,
	archived: ArchivedIcon,
}

const iconStyles = {
	blue: '[--icon-foreground:theme(colors.slate.900)] [--icon-background:theme(colors.white)]',
	amber: '[--icon-foreground:theme(colors.amber.900)] [--icon-background:theme(colors.amber.100)]',
}

export const Icon = ({ color = 'blue', icon, className }) => {
	const id = useId()
	const IconComponent = icons[icon]

	return (
		<svg aria-hidden='true' viewBox='0 0 32 32' fill='none' className={clsx(className, iconStyles[color])}>
			<IconComponent id={id} color={color} />
		</svg>
	)
}

const gradients = {
	blue: [{ stopColor: '#e21a53' }, { stopColor: '#e53164', offset: '.527' }, { stopColor: '#eb5f87', offset: 1 }],
	amber: [
		{ stopColor: '#FDE68A', offset: '.08' },
		{ stopColor: '#F59E0B', offset: '.837' },
	],
}

export function Gradient({ color = 'blue', ...props }) {
	return (
		<radialGradient cx={0} cy={0} r={1} gradientUnits='userSpaceOnUse' {...props}>
			{gradients[color].map((stop, stopIndex) => (
				<stop key={stopIndex} {...stop} />
			))}
		</radialGradient>
	)
}
