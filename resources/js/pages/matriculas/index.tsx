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
    const estados: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
        registrado: { label: 'Pendiente de Pago', variant: 'outline' },
        confirmado: { label: 'Activo', variant: 'default' },
        anulado: { label: 'Anulado', variant: 'destructive' },
    };
    
    const estadoInfo = estados[estado] || { label: estado, variant: 'default' };
    return <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>;
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
                                                {matricula.periodoAcademico?.nombre}
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
