import { BrowserRouter, Route, Routes } from "react-router"
import AppLayout from "./layouts/AppLayout"
import MainView from "./views/MainView"
import AuthLayout from "./layouts/AuthLayout"
import ConfirmAccountView from "./views/ConfirmAccountView"
import LoginView from "./views/LoginView"
import RegisterView from "./views/RegisterView"
import ResendTokenView from "./views/ResendTokenView"

export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<AppLayout/>}>
                <Route path="/" element={<MainView/>} index/>
            </Route>
            <Route element={<AuthLayout/>}>
              <Route path="/auth/confirm-account" element={<ConfirmAccountView/>}/>
              <Route path="/auth/login" element={<LoginView/>}/>
              <Route path="/auth/register" element={<RegisterView/>}/>
              <Route path="/auth/request-code" element={<ResendTokenView/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}
