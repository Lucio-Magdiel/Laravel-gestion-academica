import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, GraduationCap, Users, UserCheck, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface ActivityLog {
    id: number;
    usuario: string;
    accion: string;
    descripcion: string;
    created_at: string;
}

interface AdminDashboardProps {
    stats: {
        total_estudiantes: number;
        total_docentes: number;
        total_modulos: number;
        matriculas_activas: number;
        modulos_sin_docente: number;
    };
    recentActivity: ActivityLog[];
}

export default function AdminDashboard({ stats, recentActivity }: AdminDashboardProps) {
    const statCards = [
        {
            title: 'Estudiantes',
            value: stats.total_estudiantes,
            description: 'Total de estudiantes registrados',
            icon: GraduationCap,
            color: 'text-blue-600',
        },
        {
            title: 'Docentes',
            value: stats.total_docentes,
            description: 'Total de docentes activos',
            icon: Users,
            color: 'text-green-600',
        },
        {
            title: 'Módulos',
            value: stats.total_modulos,
            description: 'Módulos académicos',
            icon: BookOpen,
            color: 'text-purple-600',
        },
        {
            title: 'Matrículas Activas',
            value: stats.matriculas_activas,
            description: 'Matrículas confirmadas',
            icon: UserCheck,
            color: 'text-emerald-600',
        },
        {
            title: 'Módulos sin Docente',
            value: stats.modulos_sin_docente,
            description: 'Requieren asignación',
            icon: AlertCircle,
            color: stats.modulos_sin_docente > 0 ? 'text-red-600' : 'text-gray-600',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Administración" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Vista general del sistema de gestión académica
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones Rápidas</CardTitle>
                            <CardDescription>
                                Accesos directos a funciones principales
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <a
                                href="/usuarios/create"
                                className="flex items-center gap-2 rounded-md border p-3 hover:bg-accent"
                            >
                                <Users className="h-4 w-4" />
                                <span>Registrar nuevo usuario</span>
                            </a>
                            <a
                                href="/asignaciones/create"
                                className="flex items-center gap-2 rounded-md border p-3 hover:bg-accent"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Asignar docente a módulo</span>
                            </a>
                            <a
                                href="/periodos-academicos"
                                className="flex items-center gap-2 rounded-md border p-3 hover:bg-accent"
                            >
                                <AlertCircle className="h-4 w-4" />
                                <span>Gestionar períodos académicos</span>
                            </a>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Actividad Reciente</CardTitle>
                            <CardDescription>
                                Últimas acciones en el sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {recentActivity.map((log) => (
                                        <div key={log.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                                                <AlertCircle className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {log.accion}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {log.descripcion}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="font-medium text-foreground">{log.usuario}</span>
                                                    <span>•</span>
                                                    <span>{log.created_at}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No hay actividad reciente registrada.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
