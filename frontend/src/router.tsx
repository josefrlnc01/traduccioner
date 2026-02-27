import { BrowserRouter, Route, Routes } from "react-router"
import AppLayout from "./layouts/AppLayout"
import MainView from "./views/MainView"
import AuthLayout from "./layouts/AuthLayout"
import ConfirmAccountView from "./views/ConfirmAccountView"

export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<AppLayout/>}>
                <Route path="/" element={<MainView/>} index/>
            </Route>
            <Route element={<AuthLayout/>}>
              <Route path="/auth/confirm-account" element={<ConfirmAccountView/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}
