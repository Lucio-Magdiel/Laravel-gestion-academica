import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
import { update } from '@/routes/asignaciones';

interface Semestre {
  id: number;
  numero: number;
  nombre: string;
  activo: boolean;
}

interface Modulo {
  id: number;
  semestre_id: number;
  codigo: string;
  nombre: string;
  creditos: number;
  activo: boolean;
  semestre: Semestre;
}

interface Usuario {
  id: number;
  nombre_completo: string;
  email: string;
}

interface Seccion {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

interface Turno {
  id: number;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
}

interface PeriodoAcademico {
  id: number;
  anio: number;
  semestre: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

interface Asignacion {
  id: number;
  docente_id: number;
  modulo_id: number;
  seccion_id: number;
  turno_id: number;
  periodo_academico_id: number;
  modulo: Modulo;
}

interface Props {
  asignacion: Asignacion;
  docentes: Usuario[];
  modulos: Modulo[];
  semestres: Semestre[];
  secciones: Seccion[];
  turnos: Turno[];
  periodos: PeriodoAcademico[];
}

export default function EditAsignacion({
  asignacion,
  docentes,
  modulos,
  semestres,
  secciones,
  turnos,
  periodos,
}: Props) {
  const { data, setData, patch, processing, errors } = useForm({
    docente_id: asignacion.docente_id.toString(),
    semestre_id: asignacion.modulo.semestre_id.toString(),
    modulo_id: asignacion.modulo_id.toString(),
    seccion_id: asignacion.seccion_id.toString(),
    turno_id: asignacion.turno_id.toString(),
    periodo_academico_id: asignacion.periodo_academico_id.toString(),
  });

  const modulosFiltrados = useMemo(() => {
    if (!data.semestre_id) return [];
    return modulos.filter(
      (modulo) => modulo.semestre_id.toString() === data.semestre_id
    );
  }, [data.semestre_id, modulos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(update.url(asignacion.id));
  };

  return (
    <AppLayout>
      <Head title="Editar Asignación" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Editar Asignación</h2>
            <p className="text-muted-foreground">
              Modifica la asignación de docente a módulo
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Asignación</CardTitle>
            <CardDescription>
              Actualiza los datos de la asignación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Docente */}
                <div className="space-y-2">
                  <Label htmlFor="docente_id">
                    Docente <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={data.docente_id}
                    onValueChange={(value) => setData('docente_id', value)}
                  >
                    <SelectTrigger id="docente_id">
                      <SelectValue placeholder="Selecciona un docente" />
                    </SelectTrigger>
                    <SelectContent>
                      {docentes.map((docente) => (
                        <SelectItem key={docente.id} value={docente.id.toString()}>
                          {docente.nombre_completo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.docente_id && (
                    <p className="text-sm text-destructive">{errors.docente_id}</p>
                  )}
                </div>

                {/* Semestre */}
                <div className="space-y-2">
                  <Label htmlFor="semestre_id">
                    Semestre <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={data.semestre_id}
                    onValueChange={(value) => {
                      setData('semestre_id', value);
                      setData('modulo_id', '');
                    }}
                  >
                    <SelectTrigger id="semestre_id">
                      <SelectValue placeholder="Selecciona el semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {semestres.map((semestre) => (
                        <SelectItem key={semestre.id} value={semestre.id.toString()}>
                          {semestre.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Módulo */}
                <div className="space-y-2">
                  <Label htmlFor="modulo_id">
                    Módulo <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={data.modulo_id}
                    onValueChange={(value) => setData('modulo_id', value)}
                    disabled={!data.semestre_id}
                  >
                    <SelectTrigger id="modulo_id">
                      <SelectValue placeholder="Selecciona un módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modulosFiltrados.map((modulo) => (
                        <SelectItem key={modulo.id} value={modulo.id.toString()}>
                          {modulo.codigo} - {modulo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.modulo_id && (
                    <p className="text-sm text-destructive">{errors.modulo_id}</p>
                  )}
                </div>

                {/* Sección */}
                <div className="space-y-2">
                  <Label htmlFor="seccion_id">
                    Sección <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={data.seccion_id}
                    onValueChange={(value) => setData('seccion_id', value)}
                  >
                    <SelectTrigger id="seccion_id">
                      <SelectValue placeholder="Selecciona una sección" />
                    </SelectTrigger>
                    <SelectContent>
                      {secciones.map((seccion) => (
                        <SelectItem key={seccion.id} value={seccion.id.toString()}>
                          {seccion.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.seccion_id && (
                    <p className="text-sm text-destructive">{errors.seccion_id}</p>
                  )}
                </div>

                {/* Turno */}
                <div className="space-y-2">
                  <Label htmlFor="turno_id">
                    Turno <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={data.turno_id}
                    onValueChange={(value) => setData('turno_id', value)}
                  >
                    <SelectTrigger id="turno_id">
                      <SelectValue placeholder="Selecciona un turno" />
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
                    <p className="text-sm text-destructive">{errors.turno_id}</p>
                  )}
                </div>

                {/* Período Académico */}
                <div className="space-y-2">
                  <Label htmlFor="periodo_academico_id">
                    Período Académico <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={data.periodo_academico_id}
                    onValueChange={(value) => setData('periodo_academico_id', value)}
                  >
                    <SelectTrigger id="periodo_academico_id">
                      <SelectValue placeholder="Selecciona el período" />
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
                    <p className="text-sm text-destructive">{errors.periodo_academico_id}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  disabled={processing}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
