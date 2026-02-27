import { BrowserRouter, Route, Routes } from "react-router"
import AppLayout from "./layouts/AppLayout"
import MainView from "./views/MainView"

export default function Router() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<AppLayout/>}>
                <Route path="/" element={<MainView/>}></Route>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}
