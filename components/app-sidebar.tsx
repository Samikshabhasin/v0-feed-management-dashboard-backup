"use client"

import { Home, Search, Wrench, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  onViewChange: (view: string) => void
  activeView: string
}

const items = [
  {
    title: "Dashboard",
    url: "#dashboard",
    icon: Home,
    view: "dashboard",
  },
  {
    title: "Diagnose",
    url: "#diagnose",
    icon: Search,
    view: "diagnose",
  },
  {
    title: "Optimize",
    url: "#optimize",
    icon: Wrench,
    view: "optimize",
  },
  {
    title: "Impact",
    url: "#impact",
    icon: BarChart3,
    view: "impact",
  },
]

export function AppSidebar({ onViewChange, activeView }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Feed Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeView === item.view}
                    onClick={() => onViewChange(item.view)}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
