import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { ThemeProvider } from "styled-components";
import { AwaitForAuth } from "./layouts/AwaitForAuth";
import { RootLayout } from "./layouts/RootLayout";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { theme } from "./styles/theme";

import Home from "./pages/Home";

/**
 * Router całej aplikacji - czyli wszystkie strony
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/tylko-dla-zalogowanych",
    element: <ProtectedRoute element={<h1>Jeśli to widzisz, oznacza to że jesteś zalogowany</h1>} />,
  },
]);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AwaitForAuth>
          <RootLayout>
            <RouterProvider router={router} />
          </RootLayout>
        </AwaitForAuth>
      </AuthProvider>
    </ThemeProvider>
  );
}
