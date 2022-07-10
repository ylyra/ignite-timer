import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    a {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0;

      color: ${({ theme }) => theme.colors.gray[100]};

      transition: all 0.25s;

      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;

      &:hover,
      &:focus {
        border-bottom-color: ${({ theme }) => theme.colors.green[500]};
      }

      &.active {
        color: ${({ theme }) => theme.colors.green[500]};
      }
    }
  }
`;
