import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PeriodoAcademico, type Semestre, type Seccion, type Turno } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Calendar, Clock, GraduationCap, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Nueva Matrícula',
        href: '/mi-matricula/crear',
    },
];

interface MatriculaCreateProps {
    periodos: PeriodoAcademico[];
    semestres: Semestre[];
    secciones: Seccion[];
    turnos: Turno[];
    periodo_activo?: PeriodoAcademico;
}

export default function MatriculaCreate({ periodos, semestres, secciones, turnos, periodo_activo }: MatriculaCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        periodo_academico_id: periodo_activo?.id || '',
        semestre_id: '',
        seccion_id: '',
        turno_id: '',
    });

    const semestreSeleccionado = semestres.find(s => s.id === Number(data.semestre_id));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mi-matricula');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Matrícula" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Realizar Matrícula</h1>
                        <p className="text-muted-foreground">
                            Complete el proceso de matrícula académica
                        </p>
                    </div>
                </div>

                {!periodo_activo ? (
                    <Card className="border-yellow-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-700">
                                <AlertCircle className="h-5 w-5" />
                                No hay período académico activo
                            </CardTitle>
                            <CardDescription>
                                Actualmente no hay ningún período académico activo para realizar matrículas. 
                                Por favor, contacte con administración.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Período Académico */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Período Académico
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="rounded-lg border bg-muted/50 p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold">{periodo_activo.nombre}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(periodo_activo.fecha_inicio).toLocaleDateString('es-PE')} - {new Date(periodo_activo.fecha_fin).toLocaleDateString('es-PE')}
                                                </p>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">Activo</Badge>
                                        </div>
                                    </div>
                                    {errors.periodo_academico_id && (
                                        <p className="text-sm text-red-600">{errors.periodo_academico_id}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Selección de Semestre */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Seleccione su Semestre
                                </CardTitle>
                                <CardDescription>
                                    Elija el semestre al que desea matricularse
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={data.semestre_id.toString()}
                                    onValueChange={(value) => setData('semestre_id', value)}
                                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                                >
                                    {semestres.map((semestre) => (
                                        <label
                                            key={semestre.id}
                                            htmlFor={`semestre-${semestre.id}`}
                                            className="cursor-pointer"
                                        >
                                            <Card className={`transition-all hover:border-primary ${
                                                data.semestre_id === semestre.id.toString() ? 'border-primary ring-2 ring-primary' : ''
                                            }`}>
                                                <CardContent className="flex items-start gap-3 p-4">
                                                    <RadioGroupItem
                                                        value={semestre.id.toString()}
                                                        id={`semestre-${semestre.id}`}
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold">{semestre.nombre}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Ciclo {semestre.ciclo}
                                                        </p>
                                                        <Badge variant="outline" className="mt-2">
                                                            Semestre {semestre.numero}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </label>
                                    ))}
                                </RadioGroup>
                                {errors.semestre_id && (
                                    <p className="text-sm text-red-600 mt-2">{errors.semestre_id}</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Turno y Sección */}
                        {data.semestre_id && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5" />
                                            Turno
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup
                                            value={data.turno_id.toString()}
                                            onValueChange={(value) => setData('turno_id', value)}
                                            className="space-y-3"
                                        >
                                            {turnos.map((turno) => (
                                                <label
                                                    key={turno.id}
                                                    htmlFor={`turno-${turno.id}`}
                                                    className="cursor-pointer"
                                                >
                                                    <div className={`flex items-start gap-3 rounded-lg border p-4 transition-all hover:border-primary ${
                                                        data.turno_id === turno.id.toString() ? 'border-primary ring-2 ring-primary bg-primary/5' : ''
                                                    }`}>
                                                        <RadioGroupItem
                                                            value={turno.id.toString()}
                                                            id={`turno-${turno.id}`}
                                                        />
                                                        <div>
                                                            <p className="font-semibold">{turno.nombre}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {turno.hora_inicio} - {turno.hora_fin}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                        {errors.turno_id && (
                                            <p className="text-sm text-red-600 mt-2">{errors.turno_id}</p>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Sección
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup
                                            value={data.seccion_id.toString()}
                                            onValueChange={(value) => setData('seccion_id', value)}
                                            className="space-y-3"
                                        >
                                            {secciones.map((seccion) => (
                                                <label
                                                    key={seccion.id}
                                                    htmlFor={`seccion-${seccion.id}`}
                                                    className="cursor-pointer"
                                                >
                                                    <div className={`flex items-start gap-3 rounded-lg border p-4 transition-all hover:border-primary ${
                                                        data.seccion_id === seccion.id.toString() ? 'border-primary ring-2 ring-primary bg-primary/5' : ''
                                                    }`}>
                                                        <RadioGroupItem
                                                            value={seccion.id.toString()}
                                                            id={`seccion-${seccion.id}`}
                                                        />
                                                        <div>
                                                            <p className="font-semibold">Sección {seccion.nombre}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Capacidad: {seccion.capacidad_maxima} estudiantes
                                                            </p>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                        {errors.seccion_id && (
                                            <p className="text-sm text-red-600 mt-2">{errors.seccion_id}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Resumen y confirmación */}
                        {data.semestre_id && data.turno_id && data.seccion_id && (
                            <Card className="border-primary">
                                <CardHeader>
                                    <CardTitle>Resumen de Matrícula</CardTitle>
                                    <CardDescription>
                                        Verifique los datos antes de confirmar
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Período:</span>
                                            <span className="font-semibold">{periodo_activo.nombre}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Semestre:</span>
                                            <span className="font-semibold">{semestreSeleccionado?.nombre}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Turno:</span>
                                            <span className="font-semibold">
                                                {turnos.find(t => t.id === Number(data.turno_id))?.nombre}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Sección:</span>
                                            <span className="font-semibold">
                                                Sección {secciones.find(s => s.id === Number(data.seccion_id))?.nombre}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                                        <p className="text-sm text-blue-900 dark:text-blue-100">
                                            <strong>Importante:</strong> Después de confirmar la matrícula, 
                                            deberá proceder con el pago para completar el proceso.
                                        </p>
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
                                            {processing ? 'Procesando...' : 'Confirmar Matrícula'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </form>
                )}
            </div>
        </AppLayout>
    );
}
