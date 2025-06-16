import { ThemeProvider, createTheme } from "@mui/material/styles";
import Routers from "./Router/Router";

// Define your theme with linearGradient functionality
const theme = createTheme({
  palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      gradients: {
          primary: {
              main: '#1976d2',
              state: '#0d47a1', // Darker shade for gradient state
          },
          dark: {
              main: '#000',
              state: '#333',
          },
      },
  },
  typography: {
      // Define your typography settings
  },
  functions: {
      linearGradient: (color1, color2) => `linear-gradient(${color1}, ${color2})`,
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
        <Routers />
    </ThemeProvider>
  );
}

export default App
