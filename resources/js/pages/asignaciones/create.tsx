import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User, type Modulo, type Seccion, type Turno, type PeriodoAcademico, type Semestre } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Info } from 'lucide-react';
import { useMemo } from 'react';
import { store } from '@/routes/asignaciones';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Asignaciones',
        href: '/asignaciones',
    },
    {
        title: 'Crear',
        href: '/asignaciones/create',
    },
];

interface AsignacionesCreateProps {
    docentes: User[];
    modulos: Modulo[];
    secciones: Seccion[];
    turnos: Turno[];
    periodos: PeriodoAcademico[];
    semestres: Semestre[];
}

export default function AsignacionesCreate({ docentes, modulos, secciones, turnos, periodos, semestres }: AsignacionesCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        docente_id: '',
        semestre_id: '',
        modulo_id: '',
        seccion_id: '',
        turno_id: '',
        periodo_academico_id: '',
    });

    // Filtrar módulos según el semestre seleccionado
    const modulosFiltrados = useMemo(() => {
        if (!data.semestre_id) return [];
        return modulos.filter(m => m.semestre_id === Number(data.semestre_id));
    }, [data.semestre_id, modulos]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Asignación Docente" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Nueva Asignación Docente</h1>
                        <p className="text-muted-foreground">
                            Asignar un docente a un módulo académico
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Asignación</CardTitle>
                            <CardDescription>
                                Complete los datos de la asignación docente
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                                <div className="flex gap-2">
                                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    <p className="text-sm text-blue-900 dark:text-blue-100">
                                        Primero seleccione el semestre para filtrar los módulos disponibles
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="periodo_academico_id">Período Académico *</Label>
                                    <Select
                                        value={data.periodo_academico_id}
                                        onValueChange={(value) => setData('periodo_academico_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un período" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {periodos.map((periodo) => (
                                                <SelectItem key={periodo.id} value={periodo.id.toString()}>
                                                    {periodo.anio} - Periodo {periodo.semestre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.periodo_academico_id && (
                                        <p className="text-sm text-red-600">{errors.periodo_academico_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="docente_id">Docente *</Label>
                                    <Select
                                        value={data.docente_id}
                                        onValueChange={(value) => setData('docente_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un docente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {docentes.map((docente) => (
                                                <SelectItem key={docente.id} value={docente.id.toString()}>
                                                    {docente.name} - {docente.dni}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.docente_id && (
                                        <p className="text-sm text-red-600">{errors.docente_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="semestre_id">Semestre *</Label>
                                    <Select
                                        value={data.semestre_id}
                                        onValueChange={(value) => {
                                            setData({ ...data, semestre_id: value, modulo_id: '' });
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un semestre" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {semestres.map((semestre) => (
                                                <SelectItem key={semestre.id} value={semestre.id.toString()}>
                                                    {semestre.nombre} - Ciclo {semestre.ciclo}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.semestre_id && (
                                        <p className="text-sm text-red-600">{errors.semestre_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="modulo_id">Módulo *</Label>
                                    <Select
                                        value={data.modulo_id}
                                        onValueChange={(value) => setData('modulo_id', value)}
                                        disabled={!data.semestre_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    data.semestre_id
                                                        ? "Seleccione un módulo"
                                                        : "Primero seleccione un semestre"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {modulosFiltrados.length === 0 ? (
                                                <div className="p-2 text-center text-sm text-muted-foreground">
                                                    No hay módulos disponibles para este semestre
                                                </div>
                                            ) : (
                                                modulosFiltrados.map((modulo) => (
                                                    <SelectItem key={modulo.id} value={modulo.id.toString()}>
                                                        {modulo.codigo} - {modulo.nombre} ({modulo.creditos} créditos)
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.modulo_id && (
                                        <p className="text-sm text-red-600">{errors.modulo_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="seccion_id">Sección *</Label>
                                    <Select
                                        value={data.seccion_id}
                                        onValueChange={(value) => setData('seccion_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione una sección" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {secciones.map((seccion) => (
                                                <SelectItem key={seccion.id} value={seccion.id.toString()}>
                                                    Sección {seccion.nombre} {seccion.capacidad_maxima}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.seccion_id && (
                                        <p className="text-sm text-red-600">{errors.seccion_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="turno_id">Turno *</Label>
                                    <Select
                                        value={data.turno_id}
                                        onValueChange={(value) => setData('turno_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un turno" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {turnos.map((turno) => (
                                                <SelectItem key={turno.id} value={turno.id.toString()}>
                                                    {turno.nombre} ({turno.hora_inicio} - {turno.hora_fin})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.turno_id && (
                                        <p className="text-sm text-red-600">{errors.turno_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creando...' : 'Crear Asignación'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
