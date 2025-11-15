import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Matricula } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, Users, Calendar, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface EstudianteDashboardProps {
    matricula: Matricula | null;
}

const estadoColors = {
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    confirmado: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    anulado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const estadoIcons = {
    pendiente: AlertCircle,
    confirmado: CheckCircle,
    anulado: XCircle,
};

export default function EstudianteDashboard({ matricula }: EstudianteDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Estudiante" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mi Dashboard</h1>
                    <p className="text-muted-foreground">
                        Información de mi matrícula y módulos
                    </p>
                </div>

                {!matricula ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>No tienes matrícula activa</CardTitle>
                            <CardDescription>
                                Realiza tu matrícula para comenzar tus estudios
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/mi-matricula/crear">
                                <Button>Iniciar Matrícula</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle>Mi Matrícula</CardTitle>
                                        <CardDescription>
                                            Código: {matricula.codigo}
                                        </CardDescription>
                                    </div>
                                    <Badge className={estadoColors[matricula.estado]}>
                                        {matricula.estado.charAt(0).toUpperCase() + matricula.estado.slice(1)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Período Académico</p>
                                        <p className="text-sm text-muted-foreground">
                                            {matricula.periodoAcademico?.nombre}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Semestre</p>
                                        <p className="text-sm text-muted-foreground">
                                            {matricula.semestre?.nombre}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Sección</p>
                                        <p className="text-sm text-muted-foreground">
                                            Sección {matricula.seccion?.nombre}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Turno</p>
                                        <p className="text-sm text-muted-foreground">
                                            {matricula.turno?.nombre} ({matricula.turno?.hora_inicio} - {matricula.turno?.hora_fin})
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Fecha de Matrícula</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(matricula.fecha_matricula).toLocaleDateString('es-PE')}
                                        </p>
                                    </div>
                                    {matricula.fecha_pago && (
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Fecha de Pago</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(matricula.fecha_pago).toLocaleDateString('es-PE')}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {matricula.estado === 'confirmado' && (
                                    <Link href={`/mi-matricula/${matricula.id}/constancia`}>
                                        <Button variant="outline" className="w-full gap-2">
                                            <Download className="h-4 w-4" />
                                            Descargar Constancia de Matrícula
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Mis Módulos</h2>
                            {!matricula.detalles || matricula.detalles.length === 0 ? (
                                <Card>
                                    <CardContent className="py-8 text-center">
                                        <p className="text-muted-foreground">
                                            No tienes módulos matriculados
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {matricula.detalles.map((detalle) => (
                                        <Card key={detalle.id}>
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    {detalle.asignacionDocente?.modulo?.nombre}
                                                </CardTitle>
                                                <CardDescription>
                                                    Código: {detalle.asignacionDocente?.modulo?.codigo}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {detalle.asignacionDocente?.modulo?.creditos} créditos
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {detalle.asignacionDocente?.modulo?.horas_semanales} horas/semana
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        Docente: {detalle.asignacionDocente?.docente?.name || 'Por asignar'}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
