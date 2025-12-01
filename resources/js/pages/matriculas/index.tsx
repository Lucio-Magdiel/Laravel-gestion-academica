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
import { Eye, Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Matrículas',
        href: '/matriculas',
    },
];

interface MatriculasIndexProps {
    matriculas: {
        data: Matricula[];
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { label: string; className: string }> = {
        registrado: {
            label: 'Pendiente de Pago',
            className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-900/80 border-transparent'
        },
        confirmado: {
            label: 'Activo',
            className: 'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900/80 border-transparent'
        },
        anulado: {
            label: 'Anulado',
            className: 'bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-900/80 border-transparent'
        },
    };

    const estadoInfo = estados[estado] || {
        label: estado,
        className: 'bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-900/80 border-transparent'
    };

    return <Badge className={estadoInfo.className} variant="outline">{estadoInfo.label}</Badge>;
};

export default function MatriculasIndex({ matriculas }: MatriculasIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Matrículas" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Matrículas</h1>
                        <p className="text-muted-foreground">
                            Gestionar matrículas de estudiantes
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Registro de Matrículas</CardTitle>
                        <CardDescription>
                            Total: {matriculas.total} matrículas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Estudiante</TableHead>
                                        <TableHead>Período</TableHead>
                                        <TableHead>Sección</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha Registro</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {matriculas.data.map((matricula) => (
                                        <TableRow key={matricula.id}>
                                            <TableCell className="font-mono text-sm">
                                                {matricula.codigo}
                                            </TableCell>
                                            <TableCell>
                                                {matricula.estudiante?.nombre_completo}
                                            </TableCell>
                                            <TableCell>
                                                {matricula.periodo_academico?.nombre}
                                            </TableCell>
                                            <TableCell>
                                                {matricula.seccion?.nombre}
                                            </TableCell>
                                            <TableCell>
                                                {getEstadoBadge(matricula.estado)}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(matricula.fecha_registro).toLocaleDateString('es-ES')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Link href={`/matriculas/${matricula.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {matriculas.data.length === 0 && (
                            <div className="py-8 text-center">
                                <p className="text-muted-foreground">No hay matrículas registradas</p>
                            </div>
                        )}

                        {/* Paginación */}
                        {matriculas.last_page > 1 && (
                            <div className="mt-6 flex justify-center gap-2">
                                {matriculas.links.map((link) => (
                                    link.url && (
                                        <Link key={link.url} href={link.url}>
                                            <Button
                                                variant={link.active ? "default" : "outline"}
                                                disabled={!link.url}
                                            >
                                                {link.label.replace(/&laquo;/, '«').replace(/&raquo;/, '»')}
                                            </Button>
                                        </Link>
                                    )
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
