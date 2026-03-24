import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { logOut } from "@/features/auth/api/authApi"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LogOut, Menu } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"

export default function Header() {
  const [name, setName] = useState<string | null>(null)
  const { data } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  if (!data) return
  const [open, setIsOpen] = useState(false)

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


  return (
    <header className='w-full min-w-full text-center py-4 px-4 md:px-0 border-b border-slate-800 flex justify-between md:justify-evenly items-center'>
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-4xl text-white">Aud<span className="text-blue-600/80">Wave</span></h1>
      </div>

      {/* derecha - usuario y logout */}
      <div className="hidden md:flex items-center gap-8">
        <span className="text-slate-400 text-sm">{data.user.name}</span>
        <button
          onClick={handleLogOut}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm  cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Salir
        </button>
      </div>
      <div className="flex justify-center items-center md:hidden">
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Menu className="w-5 h-5 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="text-slate-400 text-sm">
                    {data.user.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogOut} className="text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400">

                    Eliminar cuenta
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
    </header>
  )
}
