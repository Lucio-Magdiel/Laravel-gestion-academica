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
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { store } from '@/routes/usuarios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Usuarios',
        href: '/usuarios',
    },
    {
        title: 'Crear',
        href: '/usuarios/create',
    },
];

export default function UsuariosCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        email: '',
        password: '',
        password_confirmation: '',
        dni: '',
        telefono: '',
        direccion: '',
        rol: 'estudiante' as 'super_admin' | 'administracion' | 'docente' | 'estudiante',
        activo: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Usuario" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Crear Usuario</h1>
                        <p className="text-muted-foreground">
                            Registrar nuevo usuario en el sistema
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Usuario</CardTitle>
                            <CardDescription>
                                Complete los datos del nuevo usuario
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre *</Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        placeholder="Ej: Juan"
                                        required
                                    />
                                    {errors.nombre && (
                                        <p className="text-sm text-red-600">{errors.nombre}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
                                    <Input
                                        id="apellido_paterno"
                                        value={data.apellido_paterno}
                                        onChange={(e) => setData('apellido_paterno', e.target.value)}
                                        placeholder="Ej: Pérez"
                                    />
                                    {errors.apellido_paterno && (
                                        <p className="text-sm text-red-600">{errors.apellido_paterno}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apellido_materno">Apellido Materno</Label>
                                    <Input
                                        id="apellido_materno"
                                        value={data.apellido_materno}
                                        onChange={(e) => setData('apellido_materno', e.target.value)}
                                        placeholder="Ej: García"
                                    />
                                    {errors.apellido_materno && (
                                        <p className="text-sm text-red-600">{errors.apellido_materno}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="ejemplo@correo.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dni">DNI *</Label>
                                    <Input
                                        id="dni"
                                        value={data.dni}
                                        onChange={(e) => setData('dni', e.target.value)}
                                        placeholder="12345678"
                                        maxLength={15}
                                        required
                                    />
                                    {errors.dni && (
                                        <p className="text-sm text-red-600">{errors.dni}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input
                                        id="telefono"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        placeholder="987654321"
                                    />
                                    {errors.telefono && (
                                        <p className="text-sm text-red-600">{errors.telefono}</p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="direccion">Dirección</Label>
                                    <Input
                                        id="direccion"
                                        value={data.direccion}
                                        onChange={(e) => setData('direccion', e.target.value)}
                                        placeholder="Av. Principal 123, Distrito, Ciudad"
                                    />
                                    {errors.direccion && (
                                        <p className="text-sm text-red-600">{errors.direccion}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rol">Rol *</Label>
                                    <Select
                                        value={data.rol}
                                        onValueChange={(value) => setData('rol', value as typeof data.rol)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="estudiante">Estudiante</SelectItem>
                                            <SelectItem value="docente">Docente</SelectItem>
                                            <SelectItem value="administracion">Administración</SelectItem>
                                            <SelectItem value="super_admin">Super Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.rol && (
                                        <p className="text-sm text-red-600">{errors.rol}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="activo"
                                        checked={data.activo}
                                        onCheckedChange={(checked) => setData('activo', checked)}
                                    />
                                    <Label htmlFor="activo">Usuario Activo</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirmar Contraseña *</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
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
                                    {processing ? 'Creando...' : 'Crear Usuario'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
