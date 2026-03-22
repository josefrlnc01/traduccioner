import { logOut } from "@/features/auth/api/authApi"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { formatMinutes } from "@/shared/utils/minutes"
import { useQueryClient } from "@tanstack/react-query"
import { LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

export default function Header() {
  const [name, setName] = useState<string | null>(null)
  const {data} = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  if (!data) return
  

  const handleLogOut = async () => {
    await logOut()
    queryClient.invalidateQueries({ queryKey: ['user'] })
    navigate('/auth/login')
  }


  return (
    <header className='w-screen text-center py-4 border-b border-slate-800 flex justify-evenly'>
      <div className="flex items-center gap-2">

        <h1 className="font-bold text-2xl text-white">AudWave</h1>
      </div>

     
      {/* derecha - usuario y logout */}
      <div className="flex items-center gap-8">
        <span className="text-slate-400 text-sm">{data.user.name}</span>
        <button
          onClick={handleLogOut}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm  cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Salir
        </button>
      </div>
    </header>
  )
}
