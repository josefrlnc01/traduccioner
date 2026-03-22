import { logOut } from "@/features/auth/api/authApi"

import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/shared/components/ui/sidebar"
import { useQueryClient } from "@tanstack/react-query"
import { Home, Languages, LogOut } from "lucide-react"
import { useNavigate } from "react-router"

export function AppSidebar() {
  


  return (
    <Sidebar>
      <SidebarContent className="bg-slate-950 border-r border-slate-800/50">
        {/* Logo/Brand Header */}
        <div className="px-4 py-6 border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <Languages className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">Transcriber</span>
          </div>
        </div>

        <SidebarGroup className="px-2 py-4">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Navegación
          </p>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 text-sm font-medium transition-all duration-200 hover:bg-slate-800/70 hover:text-white data-[active=true]:bg-blue-600/15 data-[active=true]:text-blue-400"
              >
                <a href="/dashboard">
                  <Home className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span>Inicio</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Spacer pushes logout to bottom */}
        <div className="flex-1" />

        {/* Bottom section */}
        <div className="px-2 pb-4 border-t border-slate-800/50 pt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 text-sm font-medium transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
              >
                
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}