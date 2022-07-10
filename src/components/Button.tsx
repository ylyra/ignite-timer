import { ButtonHTMLAttributes } from 'react'

import { ButtonVariant, Container } from './Button.styles'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({
  variant = 'primary',
  children,
  ...props
}: IButtonProps) {
  return (
    <Container variant={variant} {...props}>
      {children}
    </Container>
  )
}
