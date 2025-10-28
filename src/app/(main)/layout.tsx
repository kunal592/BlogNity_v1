import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MotionDiv } from '@/components/shared/MotionDiv';
import { ThemeProvider } from '@/components/theme-provider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <SidebarProvider>
        <div className="flex h-screen w-full">
            <Sidebar>
            <AppSidebar />
            </Sidebar>
            <SidebarInset className="flex flex-1 flex-col overflow-hidden">
            <AppHeader />
            <MotionDiv
                tag="main"
                className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </MotionDiv>
            </SidebarInset>
        </div>
        </SidebarProvider>
    </ThemeProvider>
  );
}
