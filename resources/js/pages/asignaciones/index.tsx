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
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, ChevronDown, AlertTriangle } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
        title: 'Asignaciones',
        href: '/asignaciones',
    },
];

interface AsignacionesIndexProps {
    asignaciones: AsignacionDocente[];
}

export default function AsignacionesIndex({ asignaciones }: AsignacionesIndexProps) {
    const [asignacionToDelete, setAsignacionToDelete] = useState<AsignacionDocente | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const confirmDelete = (asignacion: AsignacionDocente) => {
        setAsignacionToDelete(asignacion);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (asignacionToDelete) {
            router.delete(`/asignaciones/${asignacionToDelete.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setAsignacionToDelete(null);
                },
            });
        }
    };

    // Agrupar por semestre y luego por sección
    const asignacionesPorSemestre = asignaciones.reduce((acc, asignacion) => {
        const semestreNombre = asignacion.modulo?.semestre?.nombre || 'Sin Semestre';
        const semestreId = asignacion.modulo?.semestre?.id || 0;

        if (!acc[semestreId]) {
            acc[semestreId] = {
                nombre: semestreNombre,
                secciones: {}
            };
        }

        const seccionNombre = asignacion.seccion?.nombre || 'Sin Sección';
        if (!acc[semestreId].secciones[seccionNombre]) {
            acc[semestreId].secciones[seccionNombre] = [];
        }

        acc[semestreId].secciones[seccionNombre].push(asignacion);
        return acc;
    }, {} as Record<number, { nombre: string, secciones: Record<string, AsignacionDocente[]> }>);

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

                <div className="space-y-4">
                    {Object.keys(asignacionesPorSemestre).length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                <p>No hay asignaciones registradas</p>
                            </CardContent>
                        </Card>
                    ) : (
                        Object.entries(asignacionesPorSemestre).map(([semestreId, semestreData]) => (
                            <Collapsible key={semestreId} className="space-y-2">
                                <div className="flex items-center justify-between space-x-4 px-4">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" className="flex w-full justify-between p-0 hover:bg-transparent">
                                            <h2 className="text-xl font-semibold text-primary">
                                                {semestreData.nombre}
                                            </h2>
                                            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent className="space-y-2">
                                    {Object.entries(semestreData.secciones).sort().map(([seccionNombre, asignacionesSeccion]) => (
                                        <Collapsible key={seccionNombre} className="ml-4 border-l-2 border-muted pl-4">
                                            <CollapsibleTrigger asChild>
                                                <Button variant="outline" className="mb-2 flex w-full justify-between">
                                                    <span>Sección {seccionNombre}</span>
                                                    <Badge variant="secondary">{asignacionesSeccion.length} asignaciones</Badge>
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <Card>
                                                    <CardContent className="p-0">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Docente</TableHead>
                                                                    <TableHead>Módulo</TableHead>
                                                                    <TableHead>Turno</TableHead>
                                                                    <TableHead>Período</TableHead>
                                                                    <TableHead className="text-right">Acciones</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {asignacionesSeccion.map((asignacion) => (
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
                                                                            {asignacion.turno?.nombre}
                                                                            <p className="text-sm text-muted-foreground">
                                                                                {asignacion.turno?.hora_inicio} - {asignacion.turno?.hora_fin}
                                                                            </p>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            Periodo {asignacion.periodo_academico?.semestre}
                                                                            <p className="text-sm text-muted-foreground">
                                                                                {asignacion.periodo_academico?.anio}
                                                                            </p>
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            <div className="flex justify-end gap-2">
                                                                                <Link href={`/asignaciones/${asignacion.id}/edit`}>
                                                                                    <Button variant="outline" size="sm">
                                                                                        <Pencil className="h-4 w-4" />
                                                                                    </Button>
                                                                                </Link>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                                    onClick={() => confirmDelete(asignacion)}
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </CardContent>
                                                </Card>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        ))
                    )}
                </div>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                                Confirmar Eliminación
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                ¿Estás seguro de que deseas eliminar esta asignación?
                                <br />
                                Docente: <span className="font-bold text-foreground">{asignacionToDelete?.docente?.name}</span>
                                <br />
                                Módulo: <span className="font-bold text-foreground">{asignacionToDelete?.modulo?.nombre}</span>
                                <br /><br />
                                Esta acción no se puede deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Eliminar Asignación
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
