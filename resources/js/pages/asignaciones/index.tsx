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
import { type BreadcrumbItem, type AsignacionDocente } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Asignaciones',
        href: '/asignaciones',
    },
];

interface AsignacionesIndexProps {
    asignaciones: AsignacionDocente[];
}

export default function AsignacionesIndex({ asignaciones }: AsignacionesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Asignaciones" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Asignaciones Docentes</h1>
                        <p className="text-muted-foreground">
                            Asignación de docentes a módulos académicos
                        </p>
                    </div>
                    <Link href="/asignaciones/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nueva Asignación
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Asignaciones</CardTitle>
                        <CardDescription>
                            Total: {asignaciones.length} asignaciones registradas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Docente</TableHead>
                                    <TableHead>Módulo</TableHead>
                                    <TableHead>Sección</TableHead>
                                    <TableHead>Turno</TableHead>
                                    <TableHead>Período</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {asignaciones.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No hay asignaciones registradas
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    asignaciones.map((asignacion) => (
                                        <TableRow key={asignacion.id}>
                                            <TableCell className="font-medium">
                                                {asignacion.docente?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{asignacion.modulo?.nombre}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {asignacion.modulo?.codigo}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    Sección {asignacion.seccion?.nombre}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {asignacion.turno?.nombre}
                                                <p className="text-sm text-muted-foreground">
                                                    {asignacion.turno?.hora_inicio} - {asignacion.turno?.hora_fin}
                                                </p>
                                            </TableCell>
                                            <TableCell>{asignacion.periodoAcademico?.nombre}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/asignaciones/${asignacion.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="outline" size="sm" className="text-red-600">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
