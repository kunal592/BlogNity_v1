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
import { usePathname, useRouter } from 'next/navigation';
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
  Search
} from 'lucide-react';
import { ThemeToggle } from '../shared/ThemeToggle';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
  const user = session?.user as any;
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (href: string) => pathname === href;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/users?query=${searchQuery}`);
    }
  };

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <form onSubmit={handleSearch} className="p-2 flex items-center">
            <div className="relative flex-grow">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button type="submit" size="sm" className="ml-2">
                Search
            </Button>
        </form>
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
