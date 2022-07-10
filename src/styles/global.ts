import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.green[500]};
  }

  body {
    background: #333;
  }

  body, input, textarea, button {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: ${({ theme }) => theme.fontWeights.regular};
    font-size: 1rem;
  }

  button {
    cursor: pointer;
    border: none;
  }
`;
