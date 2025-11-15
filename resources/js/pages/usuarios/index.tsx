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
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Usuarios',
        href: '/usuarios',
    },
];

interface UsuariosIndexProps {
    usuarios: User[];
}

const rolColors = {
    super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    administracion: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    docente: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    estudiante: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const rolLabels = {
    super_admin: 'Super Admin',
    administracion: 'Administración',
    docente: 'Docente',
    estudiante: 'Estudiante',
};

export default function UsuariosIndex({ usuarios }: UsuariosIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
                        <p className="text-muted-foreground">
                            Gestión de usuarios del sistema
                        </p>
                    </div>
                    <Link href="/usuarios/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nuevo Usuario
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Usuarios</CardTitle>
                        <CardDescription>
                            Total: {usuarios.length} usuarios registrados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>DNI</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {usuarios.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No hay usuarios registrados
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    usuarios.map((usuario) => (
                                        <TableRow key={usuario.id}>
                                            <TableCell className="font-medium">{usuario.name}</TableCell>
                                            <TableCell>{usuario.email}</TableCell>
                                            <TableCell>{usuario.dni}</TableCell>
                                            <TableCell>
                                                <Badge className={rolColors[usuario.rol || 'estudiante']}>
                                                    {rolLabels[usuario.rol || 'estudiante']}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {usuario.activo ? (
                                                    <span className="flex items-center gap-1 text-green-600">
                                                        <CheckCircle className="h-4 w-4" />
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-red-600">
                                                        <XCircle className="h-4 w-4" />
                                                        Inactivo
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/usuarios/${usuario.id}/edit`}>
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
