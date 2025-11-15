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
import { Head, Link } from '@inertiajs/react';
import { Plus, Pencil, Trash2, BookOpen, Clock } from 'lucide-react';

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
                                                <TableHead>Código</TableHead>
                                                <TableHead>Nombre del Módulo</TableHead>
                                                <TableHead>Créditos</TableHead>
                                                <TableHead>Horas/Semana</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
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
                                                    <TableCell>
                                                        <Badge variant="secondary">
                                                            {modulo.creditos} créditos
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            {modulo.horas_semanales}h
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {modulo.activo ? (
                                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                                Activo
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">
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
                                                            <Button variant="outline" size="sm" className="text-red-600">
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
            </div>
        </AppLayout>
    );
}
