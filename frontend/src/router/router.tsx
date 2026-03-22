import { BrowserRouter, Route, Routes } from "react-router"
import AppLayout from "../features/transcription/layout/AppLayout"
import MainView from "../features/transcription/pages/MainView"
import AuthLayout from "../features/auth/layout/AuthLayout"
import ConfirmAccountView from "../features/auth/pages/ConfirmAccountView"
import LoginView from "../features/auth/pages/LoginView"
import RegisterView from "../features/auth/pages/RegisterView"
import ResendTokenView from "../features/auth/pages/ResendTokenView"
import LandingLayout from "@/landing/layout/LandingLayout"
import LandingPage from "@/landing/pages/LandingPage"
import SavedsView from "@/features/transcription/pages/SavedsView"


export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<AppLayout/>}>
                <Route path="/" element={<MainView/>} index/>
                <Route path="/saveds/:id" element={<SavedsView/>}/>
            </Route>
            <Route element={<LandingLayout/>}>
              <Route path="/landing-page" element={<LandingPage/>} index/>
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
