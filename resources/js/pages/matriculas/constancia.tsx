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
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, FileText, Printer } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Mi Matrícula',
        href: '/dashboard',
    },
    {
        title: 'Constancia',
        href: '#',
    },
];

interface ConstanciaProps {
    matricula: Matricula;
}

export default function Constancia({ matricula }: ConstanciaProps) {
    const totalCreditos = matricula.detalles?.reduce((sum, detalle) => {
        return sum + (detalle.asignacionDocente?.modulo?.creditos || 0);
    }, 0) || 0;

    const totalHoras = matricula.detalles?.reduce((sum, detalle) => {
        return sum + (detalle.asignacionDocente?.modulo?.horas_semanales || 0);
    }, 0) || 0;

    const handleDescargar = () => {
        window.open(`/mi-matricula/${matricula.id}/constancia/descargar`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Constancia de Matrícula" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Constancia de Matrícula</h1>
                            <p className="text-muted-foreground">
                                Código: {matricula.codigo}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleDescargar} className="gap-2">
                            <Download className="h-4 w-4" />
                            Descargar PDF
                        </Button>
                    </div>
                </div>

                {/* Preview de la Constancia */}
                <div className="mx-auto w-full max-w-4xl">
                    <Card className="border-2">
                        <CardHeader className="border-b-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10">
                            <div className="text-center">
                                <CardTitle className="text-2xl text-primary">
                                    Laravel Starter Kit
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Instituto de Educación Superior Tecnológico Público
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 p-8">
                            {/* Título */}
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">CONSTANCIA DE MATRÍCULA</h2>
                            </div>

                            {/* Descripción */}
                            <p className="text-muted-foreground">
                                La Dirección del <strong>Laravel Starter Kit</strong>, certifica que:
                            </p>

                            {/* Datos del Estudiante */}
                            <Card className="bg-muted/50">
                                <CardContent className="space-y-3 p-6">
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="font-semibold">Estudiante:</span>
                                        <span className="col-span-2">{matricula.estudiante?.nombre_completo}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="font-semibold">DNI:</span>
                                        <span className="col-span-2">{matricula.estudiante?.dni}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="font-semibold">Código de Matrícula:</span>
                                        <span className="col-span-2">{matricula.codigo}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="font-semibold">Período Académico:</span>
                                        <span className="col-span-2">{matricula.periodo_academico?.nombre || 'N/A'}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="font-semibold">Semestre:</span>
                                        <span className="col-span-2">{matricula.semestre?.nombre || 'N/A'}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="font-semibold">Sección:</span>
                                        <span className="col-span-2">{matricula.seccion?.nombre}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="font-semibold">Turno:</span>
                                        <span className="col-span-2">{matricula.turno?.nombre}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="font-semibold">Fecha de Matrícula:</span>
                                        <span className="col-span-2">
                                            {new Date(matricula.fecha_registro).toLocaleDateString('es-ES')}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="font-semibold">Estado:</span>
                                        <span className="col-span-2">
                                            <Badge className="bg-green-600">
                                                {matricula.estado === 'confirmado' ? 'ACTIVA' : matricula.estado.toUpperCase()}
                                            </Badge>
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Módulos Matriculados */}
                            {matricula.detalles && matricula.detalles.length > 0 && (
                                <>
                                    <div>
                                        <p className="font-semibold">
                                            Se encuentra matriculado(a) en los siguientes módulos:
                                        </p>
                                    </div>

                                    <div className="overflow-hidden rounded-lg border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Código</TableHead>
                                                    <TableHead>Módulo</TableHead>
                                                    <TableHead className="text-center">Créditos</TableHead>
                                                    <TableHead className="text-center">Horas</TableHead>
                                                    <TableHead>Docente</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {matricula.detalles.map((detalle) => (
                                                    <TableRow key={detalle.id}>
                                                        <TableCell>{detalle.asignacionDocente?.modulo?.codigo}</TableCell>
                                                        <TableCell className="font-medium">
                                                            {detalle.asignacionDocente?.modulo?.nombre}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {detalle.asignacionDocente?.modulo?.creditos}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {detalle.asignacionDocente?.modulo?.horas_semanales}
                                                        </TableCell>
                                                        <TableCell>
                                                            {detalle.asignacionDocente?.docente?.nombre_completo || 'Por asignar'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow className="bg-muted/50 font-bold">
                                                    <TableCell colSpan={2} className="text-right">TOTAL:</TableCell>
                                                    <TableCell className="text-center">{totalCreditos}</TableCell>
                                                    <TableCell className="text-center">{totalHoras}</TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            )}

                            {/* Texto Final */}
                            <p className="text-muted-foreground">
                                Se expide la presente constancia a solicitud del interesado para los fines que estime conveniente.
                            </p>

                            {/* Footer */}
                            <div className="border-t pt-6 text-center text-sm text-muted-foreground">
                                <p>Fecha de emisión: {new Date().toLocaleDateString('es-ES')} {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                                <p className="mt-1">Este documento es válido con sello y firma de la dirección académica</p>
                            </div>

                            {/* Sello */}
                            <div className="flex justify-center">
                                <div className="rounded-full border-4 border-primary px-8 py-4 font-bold text-primary transform -rotate-12">
                                    VÁLIDO
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Botones de acción al final */}
                <div className="flex justify-center gap-4">
                    <Button onClick={handleDescargar} size="lg" className="gap-2">
                        <Download className="h-5 w-5" />
                        Descargar e Imprimir PDF
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
