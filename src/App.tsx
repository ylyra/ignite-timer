import { ThemeProvider } from "styled-components";
import { Button } from "./components/Button";
import { GlobalStyle } from "./styles/global";
import { defaultTheme } from "./styles/themes/default";

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <h1>hello world</h1>
      <Button>Hello world</Button>

      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
