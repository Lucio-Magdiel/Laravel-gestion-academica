import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Matricula } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import React from 'react';

interface MatriculasShowProps {
    matricula: Matricula;
    canConfirmPago: boolean;
}

const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
        registrado: {
            label: 'Pendiente de Pago',
            icon: <Clock className="h-4 w-4" />,
            color: 'bg-yellow-100 text-yellow-800'
        },
        confirmado: {
            label: 'Matrícula Activa',
            icon: <CheckCircle className="h-4 w-4" />,
            color: 'bg-green-100 text-green-800'
        },
        anulado: {
            label: 'Anulado',
            icon: <Clock className="h-4 w-4" />,
            color: 'bg-red-100 text-red-800'
        },
    };

    const estadoInfo = estados[estado] || { label: estado, icon: null, color: '' };
    return (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${estadoInfo.color}`}>
            {estadoInfo.icon}
            {estadoInfo.label}
        </div>
    );
};

export default function MatriculasShow({ matricula, canConfirmPago }: MatriculasShowProps) {
    const [isProcessing, setIsProcessing] = React.useState(false);

    // Detectar si estamos en la vista de estudiante o admin
    const isStudentView = window.location.pathname.includes('/mi-matricula');

    // Construir breadcrumbs dinámicos
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: isStudentView ? 'Mi Matrícula' : 'Matrículas',
            href: isStudentView ? '/dashboard' : '/matriculas',
        },
        {
            title: 'Detalle',
            href: '#',
        },
    ];

    const confirmarPagoUrl = isStudentView
        ? `/mi-matricula/${matricula.id}/confirmar-pago`
        : `/matriculas/${matricula.id}/confirmar-pago`;

    const backUrl = isStudentView ? '/dashboard' : '/matriculas';

    const handleConfirmarPago = () => {
        setIsProcessing(true);
        router.post(confirmarPagoUrl, {}, {
            onFinish: () => setIsProcessing(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Matrícula ${matricula.codigo}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={backUrl}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{matricula.codigo}</h1>
                        <p className="text-muted-foreground">
                            Matrícula de {matricula.estudiante?.nombre_completo}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Información General */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de Matrícula</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Estado</p>
                                        <div className="mt-2">
                                            {getEstadoBadge(matricula.estado)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Período Académico</p>
                                        <p className="mt-1 font-semibold">{matricula.periodo_academico?.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Semestre</p>
                                        <p className="mt-1 font-semibold">{matricula.semestre?.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Sección</p>
                                        <p className="mt-1 font-semibold">{matricula.seccion?.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Turno</p>
                                        <p className="mt-1 font-semibold">{matricula.turno?.nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fecha de Registro</p>
                                        <p className="mt-1 font-semibold">
                                            {new Date(matricula.fecha_registro).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                    {matricula.fecha_confirmacion && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Fecha de Confirmación</p>
                                            <p className="mt-1 font-semibold">
                                                {new Date(matricula.fecha_confirmacion).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cursos Matriculados */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Cursos Matriculados</CardTitle>
                                <CardDescription>
                                    Total: {matricula.detalles?.length || 0} cursos
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Módulo</TableHead>
                                                <TableHead>Créditos</TableHead>
                                                <TableHead>Docente</TableHead>
                                                <TableHead>Estado</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {matricula.detalles && matricula.detalles.map((detalle) => (
                                                <TableRow key={detalle.id}>
                                                    <TableCell className="font-medium">
                                                        {detalle.asignacionDocente?.modulo?.nombre || 'Sin nombre'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {detalle.asignacionDocente?.modulo?.creditos || 0}
                                                    </TableCell>
                                                    <TableCell>
                                                        {detalle.asignacionDocente?.docente?.nombre_completo || 'Por asignar'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {detalle.estado}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {(!matricula.detalles || matricula.detalles.length === 0) && (
                                    <div className="py-8 text-center">
                                        <p className="text-muted-foreground">No hay cursos matriculados</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Panel de Pago */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Confirmación de Pago</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {matricula.estado === 'registrado' ? (
                                    <>
                                        <div className="rounded-lg bg-yellow-50 p-4">
                                            <p className="text-sm text-yellow-800">
                                                <strong>Pendiente de pago</strong>
                                            </p>
                                            <p className="mt-2 text-xs text-yellow-700">
                                                Confirme su pago por transferencia bancaria o efectivo para activar su matrícula
                                            </p>
                                        </div>

                                        <div className="space-y-3 border-t pt-4">
                                            <div>
                                                <p className="text-sm font-semibold text-muted-foreground">Formas de Pago</p>
                                                <ul className="mt-2 space-y-2 text-sm">
                                                    <li className="flex items-center gap-2">
                                                        <span className="text-green-600">✓</span>
                                                        <span>Transferencia Bancaria</span>
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="text-green-600">✓</span>
                                                        <span>Pago en Efectivo</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {canConfirmPago && (
                                                <>
                                                    <div className="border-t pt-4">
                                                        <Button
                                                            onClick={handleConfirmarPago}
                                                            disabled={isProcessing}
                                                            className="w-full"
                                                        >
                                                            {isProcessing ? 'Confirmando...' : 'Confirmar Pago'}
                                                        </Button>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Al confirmar, declaras que has realizado el pago
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="rounded-lg bg-green-50 p-4">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <p className="font-semibold text-green-800">Matrícula Confirmada</p>
                                        </div>
                                        <p className="mt-2 text-sm text-green-700">
                                            Tu matrícula está activa. Ya puedes acceder a tus cursos.
                                        </p>
                                        {matricula.fecha_confirmacion && (
                                            <p className="mt-2 text-xs text-green-600">
                                                Pagado el: {new Date(matricula.fecha_confirmacion).toLocaleDateString('es-ES')}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Información del Estudiante */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Información del Estudiante</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Nombre</p>
                                    <p className="font-semibold">{matricula.estudiante?.nombre_completo}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Email</p>
                                    <p className="font-semibold">{matricula.estudiante?.email}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">DNI</p>
                                    <p className="font-semibold">{matricula.estudiante?.dni}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
