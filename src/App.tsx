import {BrowserRouter, Route, Routes} from "react-router-dom";
import AdminLayout from "./layout/AdminLayout.tsx";
import Material from "./pages/Material.tsx";
import Login from "./pages/Login.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";

const queryClient = new QueryClient();
const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout/>}>
            <Route path="/" element={<Material/>}/>
          </Route>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<div>404</div>}/>
        </Routes>
      </BrowserRouter>
      <Toaster/>
    </QueryClientProvider>
  );
};

export default App;
