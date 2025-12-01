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
import { type BreadcrumbItem, type Modulo } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, BookOpen, Clock, AlertTriangle } from 'lucide-react';
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
        title: 'Módulos',
        href: '/modulos',
    },
];

interface ModulosIndexProps {
    modulos: Modulo[];
}

export default function ModulosIndex({ modulos }: ModulosIndexProps) {
    const [moduloToDelete, setModuloToDelete] = useState<Modulo | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const confirmDelete = (modulo: Modulo) => {
        setModuloToDelete(modulo);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (moduloToDelete) {
            router.delete(`/modulos/${moduloToDelete.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setModuloToDelete(null);
                },
            });
        }
    };

    // Agrupar módulos por semestre
    const modulosPorSemestre = modulos.reduce((acc, modulo) => {
        const semestreNum = modulo.semestre?.numero || 0;
        if (!acc[semestreNum]) {
            acc[semestreNum] = [];
        }
        acc[semestreNum].push(modulo);
        return acc;
    }, {} as Record<number, Modulo[]>);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Módulos" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Módulos Académicos</h1>
                        <p className="text-muted-foreground">
                            Gestión del plan de estudios por semestre
                        </p>
                    </div>
                    <Link href="/modulos/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Módulo
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6">
                    {Object.keys(modulosPorSemestre).sort().map((semestreNum) => {
                        const modulosSemestre = modulosPorSemestre[Number(semestreNum)];
                        const semestre = modulosSemestre[0]?.semestre;

                        return (
                            <Card key={semestreNum}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{semestre?.nombre || `Semestre ${semestreNum}`}</span>
                                        <Badge variant="outline" className="ml-2">
                                            {modulosSemestre.length} módulos
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        Ciclo {semestre?.ciclo}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Código</TableHead>
                                                <TableHead>Nombre del Módulo</TableHead>
                                                <TableHead className="w-[200px] text-center">Créditos</TableHead>
                                                <TableHead className="w-[200px] text-center">Horas/Semana</TableHead>
                                                <TableHead className="w-[200px] text-center">Estado</TableHead>
                                                <TableHead className="w-[100px] text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {modulosSemestre.map((modulo) => (
                                                <TableRow key={modulo.id}>
                                                    <TableCell className="font-mono font-medium">
                                                        {modulo.codigo}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                            {modulo.nombre}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="secondary">
                                                            {modulo.creditos} créditos
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            {modulo.horas_semanales}h
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {modulo.activo ? (
                                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                                Activo
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                                                Inactivo
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={`/modulos/${modulo.id}/edit`}>
                                                                <Button variant="outline" size="sm">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                onClick={() => confirmDelete(modulo)}
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
                        );
                    })}
                </div>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="h-5 w-5" />
                                Confirmar Eliminación
                            </DialogTitle>
                            <DialogDescription className="pt-2">
                                ¿Estás seguro de que deseas eliminar el módulo <span className="font-bold text-foreground">{moduloToDelete?.nombre}</span>?
                                <br /><br />
                                Esta acción eliminará permanentemente el módulo. Esta acción no se puede deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Eliminar Módulo
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
