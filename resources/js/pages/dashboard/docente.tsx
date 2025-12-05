import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type AsignacionDocente } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, Clock, Users, Calendar } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DocenteDashboardProps {
    asignaciones: AsignacionDocente[];
}

export default function DocenteDashboard({ asignaciones }: DocenteDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Docente" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mi Dashboard</h1>
                    <p className="text-muted-foreground">
                        Módulos asignados y horarios
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Módulos Asignados
                            </CardTitle>
                            <CardDescription>
                                Total: {asignaciones.length} módulos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{asignaciones.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Mis Asignaciones</h2>
                    {asignaciones.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <p className="text-muted-foreground">
                                    No tienes módulos asignados actualmente
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {asignaciones.map((asignacion) => (
                                <Card key={asignacion.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            {asignacion.modulo?.nombre}
                                        </CardTitle>
                                        <CardDescription>
                                            Código: {asignacion.modulo?.codigo}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>Sección {asignacion.seccion?.nombre}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {asignacion.turno?.nombre} ({asignacion.turno?.hora_inicio} - {asignacion.turno?.hora_fin})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{asignacion.periodo?.nombre}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            <span>{asignacion.modulo?.semestre?.nombre}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
