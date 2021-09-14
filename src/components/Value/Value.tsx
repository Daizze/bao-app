import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'

interface ValueProps {
	value: string | number
	decimals?: number
}

const Value: React.FC<ValueProps> = ({ value, decimals }) => {
	const [start, updateStart] = useState(0)
	const [end, updateEnd] = useState(0)

	useEffect(() => {
		if (typeof value === 'number') {
			updateStart(end)
			updateEnd(value)
		}
	}, [value])

	return (
		<StyledValue>
			{typeof value == 'string' ? (
				value
			) : (
				<CountUp
					start={start}
					end={end}
					decimals={
						decimals !== undefined ? decimals : end < 0 ? 4 : end > 1e5 ? 0 : 3
					}
					duration={1}
					separator=","
				/>
			)}
		</StyledValue>
	)
}

const StyledValue = styled.div`
	font-family: 'Rubik', sans-serif;
	color: ${(props) => props.theme.color.text[100]};
	font-size: 2rem;
	font-weight: ${(props) => props.theme.fontWeight.strong};
`

export default Value
