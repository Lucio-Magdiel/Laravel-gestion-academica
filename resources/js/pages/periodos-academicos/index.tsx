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
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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
    borrador: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    activo: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    finalizado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function PeriodosIndex({ periodos }: PeriodosIndexProps) {
    const [periodoToDelete, setPeriodoToDelete] = useState<PeriodoAcademico | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const confirmDelete = (periodo: PeriodoAcademico) => {
        setPeriodoToDelete(periodo);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (periodoToDelete) {
            router.delete(`/periodos-academicos/${periodoToDelete.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setPeriodoToDelete(null);
                },
            });
        }
    };

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
                                    <TableHead>Año/Periodo</TableHead>
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
                                                    {periodo.anio} - Periodo {periodo.semestre}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(periodo.fecha_inicio).toLocaleDateString('es-PE')}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(periodo.fecha_fin).toLocaleDateString('es-PE')}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={estadoColors[periodo.estado as keyof typeof estadoColors] || estadoColors.borrador}>
                                                    {periodo.estado.charAt(0).toUpperCase() + periodo.estado.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/periodos-academicos/${periodo.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => confirmDelete(periodo)}
                                                    >
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

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                                Confirmar Eliminación
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                ¿Estás seguro de que deseas eliminar este período académico?
                                <br />
                                Período: <span className="font-bold text-foreground">{periodoToDelete?.nombre}</span>
                                <br /><br />
                                Esta acción no se puede deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Eliminar Período
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
