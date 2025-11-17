import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import modulos from '@/routes/modulos';

interface Semestre {
  id: number;
  numero: number;
  nombre: string;
  activo: boolean;
}

interface Props {
  semestres: Semestre[];
}

export default function CreateModulo({ semestres }: Props) {
  const { data, setData, post, processing, errors } = useForm<{
    semestre_id: string;
    codigo: string;
    nombre: string;
    creditos: string | number;
    horas_semanales: string | number;
    activo: boolean;
  }>({
    semestre_id: '',
    codigo: '',
    nombre: '',
    creditos: 0,
    horas_semanales: 0,
    activo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(modulos.store.url(), {
      method: 'post',
    });
  };

  return (
    <AppLayout>
      <Head title="Crear Módulo" />

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
            <h2 className="text-2xl font-bold tracking-tight">Crear Módulo</h2>
            <p className="text-muted-foreground">
              Agrega un nuevo módulo al plan de estudios
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Módulo</CardTitle>
            <CardDescription>
              Completa los datos del módulo académico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Semestre */}
                <div className="space-y-2">
                  <Label htmlFor="semestre_id">
                    Semestre <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={data.semestre_id}
                    onValueChange={(value) => setData('semestre_id', value)}
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
                  {errors.semestre_id && (
                    <p className="text-sm text-destructive">{errors.semestre_id}</p>
                  )}
                </div>

                {/* Código */}
                <div className="space-y-2">
                  <Label htmlFor="codigo">
                    Código <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="codigo"
                    value={data.codigo}
                    onChange={(e) => setData('codigo', e.target.value)}
                    placeholder="Ej: ING-101"
                    maxLength={20}
                  />
                  {errors.codigo && (
                    <p className="text-sm text-destructive">{errors.codigo}</p>
                  )}
                </div>

                {/* Nombre */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nombre">
                    Nombre del Módulo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombre"
                    value={data.nombre}
                    onChange={(e) => setData('nombre', e.target.value)}
                    placeholder="Ej: Programación Orientada a Objetos"
                    maxLength={255}
                  />
                  {errors.nombre && (
                    <p className="text-sm text-destructive">{errors.nombre}</p>
                  )}
                </div>

                {/* Créditos */}
                <div className="space-y-2">
                  <Label htmlFor="creditos">
                    Créditos <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="creditos"
                    type="number"
                    min="1"
                    max="10"
                    value={data.creditos}
                    onChange={(e) => setData('creditos', e.target.value ? parseInt(e.target.value, 10) : 0)}
                    placeholder="Ej: 4"
                  />
                  {errors.creditos && (
                    <p className="text-sm text-destructive">{errors.creditos}</p>
                  )}
                </div>

                {/* Horas Semanales */}
                <div className="space-y-2">
                  <Label htmlFor="horas_semanales">
                    Horas Semanales <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="horas_semanales"
                    type="number"
                    min="1"
                    max="20"
                    value={data.horas_semanales}
                    onChange={(e) => setData('horas_semanales', e.target.value ? parseInt(e.target.value, 10) : 0)}
                    placeholder="Ej: 6"
                  />
                  {errors.horas_semanales && (
                    <p className="text-sm text-destructive">{errors.horas_semanales}</p>
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
                    <Label htmlFor="activo">Módulo activo</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Los módulos inactivos no estarán disponibles para asignación
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
                  {processing ? 'Creando...' : 'Crear Módulo'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
