import styled from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger'

interface IContainerProps {
  variant: ButtonVariant
}

const buttonVariants = {
  primary: 'purple',
  secondary: 'blue',
  success: 'green',
  danger: 'red',
}

export const Container = styled.button<IContainerProps>`
  background-color: ${(props) => buttonVariants[props.variant]};
`
