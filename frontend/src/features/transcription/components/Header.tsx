import ConfirmActionDialog from "@/components/ConfirmActionDialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { logOut } from "@/features/auth/api/authApi"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { deleteUser } from "@/features/user/userApi"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { LogOut, Menu } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"

export default function Header() {


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

  console.log

  return (
    <header className='w-full min-w-full text-center py-4 px-4 md:px-0 border-b border-slate-800 flex justify-between md:justify-evenly items-center'>
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-4xl text-white">Aud<span className="text-blue-600/80">Wave</span></h1>
      </div>

      
      <div className="flex justify-center  items-center hover:scale-110 transition-transform duration-100 ease-in focus:outline-none focus-visible:outline-none">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu className="w-5 h-5 text-slate-400 cursor-pointer " />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-900 border border-slate-700/50">
          <DropdownMenuLabel className="text-xs font-bold text-white">
            Cuenta
          </DropdownMenuLabel>
            <DropdownMenuItem className="text-slate-400 text-sm">
              {data.user.name}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-bold text-white">
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
