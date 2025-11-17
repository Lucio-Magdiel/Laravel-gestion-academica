import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { route } from 'ziggy-js';

interface PeriodoAcademico {
  id: number;
  anio: number;
  semestre: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

interface Props {
  periodo: PeriodoAcademico;
}

export default function EditPeriodoAcademico({ periodo }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    anio: periodo.anio.toString(),
    semestre: periodo.semestre.toString(),
    fecha_inicio: periodo.fecha_inicio,
    fecha_fin: periodo.fecha_fin,
    activo: periodo.activo,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('periodos-academicos.update', periodo.id));
  };

  return (
    <AppLayout>
      <Head title="Editar Período Académico" />

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
            <h2 className="text-2xl font-bold tracking-tight">Editar Período Académico</h2>
            <p className="text-muted-foreground">
              Modifica la información del período académico
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Período</CardTitle>
            <CardDescription>
              Actualiza los datos del período académico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Año */}
                <div className="space-y-2">
                  <Label htmlFor="anio">
                    Año <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="anio"
                    type="number"
                    min="2020"
                    max="2050"
                    value={data.anio}
                    onChange={(e) => setData('anio', e.target.value)}
                    placeholder="Ej: 2025"
                  />
                  {errors.anio && (
                    <p className="text-sm text-destructive">{errors.anio}</p>
                  )}
                </div>

                {/* Semestre */}
                <div className="space-y-2">
                  <Label htmlFor="semestre">
                    Semestre <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={data.semestre}
                    onValueChange={(value) => setData('semestre', value)}
                  >
                    <SelectTrigger id="semestre">
                      <SelectValue placeholder="Selecciona el semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Semestre 1</SelectItem>
                      <SelectItem value="2">Semestre 2</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.semestre && (
                    <p className="text-sm text-destructive">{errors.semestre}</p>
                  )}
                </div>

                {/* Fecha Inicio */}
                <div className="space-y-2">
                  <Label htmlFor="fecha_inicio">
                    Fecha de Inicio <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    value={data.fecha_inicio}
                    onChange={(e) => setData('fecha_inicio', e.target.value)}
                  />
                  {errors.fecha_inicio && (
                    <p className="text-sm text-destructive">{errors.fecha_inicio}</p>
                  )}
                </div>

                {/* Fecha Fin */}
                <div className="space-y-2">
                  <Label htmlFor="fecha_fin">
                    Fecha de Fin <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fecha_fin"
                    type="date"
                    value={data.fecha_fin}
                    onChange={(e) => setData('fecha_fin', e.target.value)}
                  />
                  {errors.fecha_fin && (
                    <p className="text-sm text-destructive">{errors.fecha_fin}</p>
                  )}
                </div>

                {/* Estado Activo */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="activo"
                      checked={data.activo}
                      onCheckedChange={(checked) => setData('activo', checked)}
                    />
                    <Label htmlFor="activo">Período activo</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Solo los períodos activos estarán disponibles para matrículas y asignaciones
                  </p>
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
