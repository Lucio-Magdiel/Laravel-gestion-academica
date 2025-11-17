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
import { type BreadcrumbItem, type PeriodoAcademico } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Períodos Académicos',
        href: '/periodos-academicos',
    },
];

interface PeriodosIndexProps {
    periodos: PeriodoAcademico[];
}

const estadoColors = {
    activo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    inactivo: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    cerrado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function PeriodosIndex({ periodos }: PeriodosIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Períodos Académicos" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Períodos Académicos</h1>
                        <p className="text-muted-foreground">
                            Gestión de períodos y ciclos académicos
                        </p>
                    </div>
                    <Link href="/periodos-academicos/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Período
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Períodos</CardTitle>
                        <CardDescription>
                            Total: {periodos.length} períodos registrados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Período</TableHead>
                                    <TableHead>Año/Semestre</TableHead>
                                    <TableHead>Fecha Inicio</TableHead>
                                    <TableHead>Fecha Fin</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {periodos.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No hay períodos académicos registrados
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    periodos.map((periodo) => (
                                        <TableRow key={periodo.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p>{periodo.nombre}</p>
                                                    {periodo.descripcion && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {periodo.descripcion}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {periodo.anio} - Semestre {periodo.semestre}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(periodo.fecha_inicio).toLocaleDateString('es-PE')}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(periodo.fecha_fin).toLocaleDateString('es-PE')}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={estadoColors[periodo.estado as keyof typeof estadoColors] || estadoColors.inactivo}>
                                                    {periodo.activo ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/periodos-academicos/${periodo.id}/edit`}>
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
