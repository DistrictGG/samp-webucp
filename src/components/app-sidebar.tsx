"use client"
import Link from "next/link"
import { DollarSign, User, History, Shield, LogOut, User2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar"

const menuItems = [
  {
    title: "Ucp",
    icon: User2,
    id: "ucp-profile",
    link: "/profile",
  },
  {
    title: "Karakter",
    icon: User,
    id: "karakter",
    link: "/profile/karakter",
  },
  {
    title: "Store",
    icon: DollarSign,
    id: "store",
    link: "/profile/store",
  },
  {
    title: "Transaksi",
    icon: History,
    id: "transaksi",
    link: "/profile/transaksi",
  },
  {
    title: "Security",
    icon: Shield,
    id: "security",
    link: "/profile/security",
  }
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function AppSidebar({
  activeSection,
  onSectionChange,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props }>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-2">
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sm px-3 font-medium">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <Link href={item.link}>
                    <SidebarMenuButton
                      isActive={activeSection === item.id}
                      onClick={() => onSectionChange(item.id)}
                      className="h-10 text-sm font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-destructive hover:text-destructive hover:bg-destructive/10 h-10 font-medium">
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
