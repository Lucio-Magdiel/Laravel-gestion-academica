import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Matricula } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, Users, Calendar, Download, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

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
                                    <Badge className={estadoColors[matricula.estado === 'registrado' ? 'pendiente' : matricula.estado]}>
                                        {matricula.estado === 'registrado' ? 'Pendiente de Pago' : 
                                         matricula.estado === 'confirmado' ? 'Activa' : 'Anulado'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {matricula.estado === 'registrado' && (
                                    <div className="mb-4 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                Matrícula pendiente de pago
                                            </p>
                                        </div>
                                        <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                            Completa el pago para activar tu matrícula
                                        </p>
                                        <Link href={`/mi-matricula/${matricula.id}`}>
                                            <Button className="mt-3" size="sm">
                                                Ver Detalles y Confirmar Pago
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Período Académico</p>
                                        <p className="text-sm text-muted-foreground">
                                            {matricula.periodoAcademico?.nombre || 'No disponible'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Semestre</p>
                                        <p className="text-sm text-muted-foreground">
                                            {matricula.semestre?.nombre || 'No disponible'}
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
                                        <p className="text-sm font-medium">Fecha de Registro</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(matricula.fecha_registro).toLocaleDateString('es-PE')}
                                        </p>
                                    </div>
                                    {matricula.fecha_confirmacion && (
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Fecha de Confirmación</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(matricula.fecha_confirmacion).toLocaleDateString('es-PE')}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/mi-matricula/${matricula.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            Ver Detalles Completos
                                        </Button>
                                    </Link>
                                    {matricula.estado === 'confirmado' && (
                                        <Link href={`/mi-matricula/${matricula.id}/constancia`} className="flex-1">
                                            <Button variant="outline" className="w-full gap-2">
                                                <FileText className="h-4 w-4" />
                                                Ver Constancia
                                            </Button>
                                        </Link>
                                    )}
                                </div>
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
                                                    {detalle.asignacionDocente?.modulo?.nombre || 'Sin nombre'}
                                                </CardTitle>
                                                <CardDescription>
                                                    Código: {detalle.asignacionDocente?.modulo?.codigo || 'N/A'}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {detalle.asignacionDocente?.modulo?.creditos || 0} créditos
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        {detalle.asignacionDocente?.modulo?.horas_semanales || 0} horas/semana
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span>
                                                        Docente: {detalle.asignacionDocente?.docente?.nombre_completo || 'Por asignar'}
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
