import { Input } from '@/components/ui/input';
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
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-react';
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
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

    const confirmDelete = (usuario: User) => {
        setUserToDelete(usuario);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (userToDelete) {
            router.delete(`/usuarios/${userToDelete.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    const handleSearchChange = (rol: string, value: string) => {
        setSearchTerms(prev => ({
            ...prev,
            [rol]: value
        }));
    };

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

                <div className="space-y-6">
                    {Object.entries(rolLabels).map(([rolKey, rolLabel]) => {
                        const searchTerm = searchTerms[rolKey] || '';
                        const searchLower = searchTerm.toLowerCase();

                        const usersInRole = usuarios.filter(u => (u.rol || 'estudiante') === rolKey).filter(usuario => {
                            if (!searchTerm) return true;
                            const nombre = (usuario.nombre_completo || usuario.name || '').toLowerCase();
                            const email = (usuario.email || '').toLowerCase();
                            const dni = (usuario.dni || '').toLowerCase();
                            return (
                                nombre.includes(searchLower) ||
                                email.includes(searchLower) ||
                                dni.includes(searchLower)
                            );
                        });

                        const styles = {
                            super_admin: {
                                border: 'border-purple-500/50',
                                bg: 'bg-purple-500/5 hover:bg-purple-500/10',
                                text: 'text-purple-700 dark:text-purple-400',
                                badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20'
                            },
                            administracion: {
                                border: 'border-blue-500/50',
                                bg: 'bg-blue-500/5 hover:bg-blue-500/10',
                                text: 'text-blue-700 dark:text-blue-400',
                                badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20'
                            },
                            docente: {
                                border: 'border-green-500/50',
                                bg: 'bg-green-500/5 hover:bg-green-500/10',
                                text: 'text-green-700 dark:text-green-400',
                                badge: 'bg-green-500/10 text-green-700 dark:text-green-300 hover:bg-green-500/20'
                            },
                            estudiante: {
                                border: 'border-gray-500/50',
                                bg: 'bg-gray-500/5 hover:bg-gray-500/10',
                                text: 'text-gray-700 dark:text-gray-400',
                                badge: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 hover:bg-gray-500/20'
                            },
                        }[rolKey as keyof typeof rolLabels] || {
                            border: 'border-gray-500/50',
                            bg: 'bg-gray-500/5',
                            text: 'text-gray-700',
                            badge: 'bg-gray-100 text-gray-800'
                        };

                        return (
                            <Card key={rolKey} className={`overflow-hidden border ${styles.border} ${styles.bg} shadow-sm transition-colors duration-200`}>
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <CardTitle className={`flex items-center gap-2 text-xl ${styles.text}`}>
                                                {rolLabel}
                                                <Badge variant="secondary" className={`ml-2 border-0 ${styles.badge}`}>
                                                    {usersInRole.length}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                Usuarios registrados como {rolLabel.toLowerCase()}
                                            </CardDescription>
                                        </div>
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder={`Buscar ${rolLabel.toLowerCase()}...`}
                                                className="bg-background/50 pl-9"
                                                value={searchTerm}
                                                onChange={(e) => handleSearchChange(rolKey, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nombre</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>DNI</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {usersInRole.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                                                        No hay usuarios registrados con este rol
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                usersInRole.map((usuario) => (
                                                    <TableRow key={usuario.id}>
                                                        <TableCell className="font-medium">{usuario.nombre_completo || usuario.name}</TableCell>
                                                        <TableCell>{usuario.email}</TableCell>
                                                        <TableCell>{usuario.dni}</TableCell>
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
                                                            <div className="flex justify-end gap-3">
                                                                <Link href={`/usuarios/${usuario.id}/edit`}>
                                                                    <Button variant="outline" size="sm">
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                    onClick={() => confirmDelete(usuario)}
                                                                >
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
                                ¿Estás seguro de que deseas eliminar al usuario <span className="font-bold text-foreground">{userToDelete?.nombre_completo || userToDelete?.name}</span>?
                                <br /><br />
                                Esta acción eliminará permanentemente al usuario y todos sus datos asociados. Esta acción no se puede deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Eliminar Usuario
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
