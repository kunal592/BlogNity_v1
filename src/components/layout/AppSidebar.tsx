'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/shared/Logo';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/types';
import {
  Home,
  Rss,
  PenSquare,
  Users,
  Mail,
  Bell,
  User,
  LayoutDashboard,
  Settings,
  Shield,
  Gem,
} from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';

const navItems: NavItem[] = [
  { href: '/home', title: 'Home', icon: Home },
  { href: '/feed', title: 'Feed', icon: Rss },
  { href: '/exclusive', title: 'Exclusive', icon: Gem },
  { href: '/postblog', title: 'Post Blog', icon: PenSquare },
  { href: '/about', title: 'About', icon: Users },
  { href: '/contactus', title: 'Contact Us', icon: Mail },
];

const userNavItems: NavItem[] = [
  { href: '/notification', title: 'Notifications', icon: Bell },
  { href: '/profile', title: 'Profile', icon: User },
  { href: '/dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { href: '/settings', title: 'Settings', icon: Settings },
];

const adminNavItem: NavItem = { href: '/admin', title: 'Admin', icon: Shield };

export default function AppSidebar() {
  const { data: session } = useSession();
  const user = session?.user as any; // Using any to access role
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={{ children: item.title }}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {user && (
            <>
                <SidebarSeparator />
                <SidebarMenu>
                {userNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                        isActive={isActive(item.href)}
                        tooltip={{ children: item.title }}
                        >
                        <item.icon />
                        <span>{item.title}</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
                {user.role === 'admin' && (
                    <SidebarMenuItem>
                        <Link href={adminNavItem.href}>
                        <SidebarMenuButton
                            isActive={isActive(adminNavItem.href)}
                            tooltip={{ children: adminNavItem.title }}
                        >
                            <adminNavItem.icon />
                            <span>{adminNavItem.title}</span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                )}
                </SidebarMenu>
            </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </>
  );
}
