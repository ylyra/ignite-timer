import styled from "styled-components";

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  color: ${({ theme }) => theme.colors.gray[100]};
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const BaseInput = styled.input`
  height: 2.5rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[500]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: 1.125rem;
  padding: 0 0.5rem;
  color: ${({ theme }) => theme.colors.gray[100]};

  &:focus,
  &:hover {
    box-shadow: none;
    border-color: ${({ theme }) => theme.colors.green[500]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;
export const TaskInput = styled(BaseInput)`
  flex: 1;

  &::-webkit-calendar-picker-indicator {
    display: none !important;
  }
`;
export const MinutesAmountInput = styled(BaseInput)`
  max-width: 4rem;
`;
