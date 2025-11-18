import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import miMatricula from '@/routes/mi-matricula';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, FileText, LayoutGrid, Users, BookOpenCheck, UserCog, Folder } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { user: { rol?: string } } };
    const userRole = auth?.user?.rol;

    // Menú para Super Admin y Administración
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Usuarios',
            href: '/usuarios',
            icon: Users,
        },
        {
            title: 'Módulos',
            href: '/modulos',
            icon: BookOpen,
        },
        {
            title: 'Asignaciones',
            href: '/asignaciones',
            icon: UserCog,
        },
        {
            title: 'Períodos Académicos',
            href: '/periodos-academicos',
            icon: Calendar,
        },
        {
            title: 'Matrículas',
            href: '/matriculas',
            icon: FileText,
        },
    ];

    // Menú para Estudiantes
    const studentNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Mi Matrícula',
            href: miMatricula.create.url(),
            icon: FileText,
        },
    ];

    // Menú para Docentes
    const teacherNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Mis Módulos',
            href: dashboard(),
            icon: BookOpenCheck,
        },
    ];

    const mainNavItems = 
        userRole === 'super_admin' || userRole === 'administracion' 
            ? adminNavItems 
            : userRole === 'estudiante'
            ? studentNavItems
            : teacherNavItems;

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
