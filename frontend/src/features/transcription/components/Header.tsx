import ConfirmActionDialog from "@/components/ConfirmActionDialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { logOut } from "@/features/auth/api/authApi"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { deleteUser } from "@/features/user/userApi"
import { useTheme } from "@/shared/context/ThemeContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LogOut, Menu } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"


export default function Header() {
  const { theme, toggleTheme } = useTheme()

  const { data } = useAuth()
  const [isOpenForDelete, setIsOpenForDelete] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  if (!data) return

  const logout = useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      queryClient.clear()
      navigate('/landing-page')
    }
  })
  const handleLogOut = async () => {
    logout.mutate()
  }


  const deleteAccount = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      navigate('/landing-page')
    }
  })
  const handleDelete = () => {
    deleteAccount.mutate()
  }



  return (
    <header className={theme === 'dark'
      ? 'w-full min-w-full text-center py-4 px-4 md:px-0 border-b border-slate-800 flex justify-between md:justify-evenly items-center bg-slate-950 text-white grow-0'
      : 'w-full min-w-full text-center py-4 px-4 md:px-0  flex justify-between md:justify-evenly items-center bg-white border-b border-slate-200 text-slate-900 grow-0'}>
      <div className="flex items-center justify-center gap-2">
        <h1 className="font-bold text-lg md:text-2xl lg:text-4xl  text-white">Aud<span className="text-blue-600/80">Wave</span></h1>
      </div>


      <div className="flex justify-center items-center gap-4 transition-transform duration-100 ease-in focus:outline-none focus-visible:outline-none">
        <button
          onClick={toggleTheme}
          className={`relative w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer
        ${theme === 'dark' ? "bg-gray-800" : "bg-gray-300"}`}
        >
          {/* círculo */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md transform transition-all duration-300
          ${theme === 'dark'
                ? "translate-x-8 bg-gray-900 text-yellow-300"
                : "translate-x-0 bg-white text-yellow-500"}`}
          >
            {theme === 'dark' ? "🌙" : "☀️"}
          </div>

          {/* glow opcional */}
          <div
            className={`absolute inset-0 rounded-full blur-md opacity-30 transition
          ${theme === 'dark' ? "bg-purple-500" : "bg-yellow-400"}`}
          />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:scale-110">
            <Menu className="w-5 h-5 text-slate-400 cursor-pointer " />
          </DropdownMenuTrigger>
          <DropdownMenuContent className={`${theme === 'dark' ? 'bg-slate-900 border border-slate-700/50' : 'bg-slate-200 text-slate-950'}`}>
            <DropdownMenuLabel className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
              Cuenta
            </DropdownMenuLabel>
            <DropdownMenuItem className="text-slate-400 text-sm">
              {data.user.name}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
              Acciones
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={handleLogOut} className="text-red-400 hover:bg-slate-800 cursor-pointer transition-colors ease duration-100">
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setIsOpenForDelete(true)
              }}
              className="text-red-400 hover:bg-red-600/40 hover:text-white cursor-pointer transition-colors ease duration-100"
            >
              Eliminar cuenta
            </DropdownMenuItem>

            <ConfirmActionDialog
              isOpen={isOpenForDelete}
              setIsOpen={setIsOpenForDelete}
              title='¿Estás seguro/a de que deseas eliminar tu cuenta?'
              onConfirm={handleDelete}
              confirmText="Si, eliminar"
            />


          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
