import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Check } from 'lucide-react';

interface FormData {
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    dni: string;
    telefono: string;
    direccion: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        email: '',
        dni: '',
        telefono: '',
        direccion: '',
        password: '',
        password_confirmation: '',
    });

    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const nombreCompleto = `${formData.nombre} ${formData.apellido_paterno} ${formData.apellido_materno}`.trim();
    const passwordsMatch = formData.password && formData.password === formData.password_confirmation;
    const fieldsCompleted = {
        nombre: !!formData.nombre && /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(formData.nombre) && formData.nombre.length > 2,
        apellido_paterno: !!formData.apellido_paterno && /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(formData.apellido_paterno) && formData.apellido_paterno.length > 2,
        apellido_materno: !!formData.apellido_materno && /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(formData.apellido_materno) && formData.apellido_materno.length > 2,
        email: !!formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
        dni: !!formData.dni && /^\d{8}$/.test(formData.dni),
        telefono: !!formData.telefono && /^\+?[\d\s-]{9,}$/.test(formData.telefono),
        direccion: !!formData.direccion && formData.direccion.length > 5,
        password: !!formData.password && formData.password.length >= 8,
        confirmPassword: passwordsMatch,
    };

    const allFieldsComplete = Object.values(fieldsCompleted).every(v => v);

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                method="post"
                action={store.url()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            {/* Sección: Información Personal */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-semibold text-muted-foreground">1</div>
                                    <h3 className="text-sm font-semibold">Personal Information</h3>
                                    {fieldsCompleted.nombre && fieldsCompleted.apellido_paterno && fieldsCompleted.apellido_materno && fieldsCompleted.dni && (
                                        <Check className="h-4 w-4 text-green-500 ml-auto" />
                                    )}
                                </div>

                                <div className="grid gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="nombre">First Name *</Label>
                                        <Input
                                            id="nombre"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Cirilo"

                                            className={fieldsCompleted.nombre ? 'border-green-500' : (formData.nombre.length > 0 ? 'border-red-500' : '')}
                                        />
                                        <InputError message={errors.nombre} className="mt-1" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="apellido_paterno">Paternal Last Name</Label>
                                        <Input
                                            id="apellido_paterno"
                                            type="text"
                                            tabIndex={2}
                                            name="apellido_paterno"
                                            value={formData.apellido_paterno}
                                            onChange={handleChange}
                                            placeholder="Pampañaypa"

                                            className={fieldsCompleted.apellido_paterno ? 'border-green-500' : (formData.apellido_paterno.length > 0 ? 'border-red-500' : '')}
                                        />
                                        <InputError message={errors.apellido_paterno} className="mt-1" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="apellido_materno">Maternal Last Name</Label>
                                        <Input
                                            id="apellido_materno"
                                            type="text"
                                            tabIndex={3}
                                            name="apellido_materno"
                                            value={formData.apellido_materno}
                                            onChange={handleChange}
                                            placeholder="Atacuri"

                                            className={fieldsCompleted.apellido_materno ? 'border-green-500' : (formData.apellido_materno.length > 0 ? 'border-red-500' : '')}
                                        />
                                        <InputError message={errors.apellido_materno} className="mt-1" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="dni">DNI *</Label>
                                        <Input
                                            id="dni"
                                            type="text"
                                            required
                                            tabIndex={4}
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleChange}
                                            placeholder="12345678"
                                            maxLength={15}

                                            className={fieldsCompleted.dni ? 'border-green-500' : (formData.dni.length > 0 ? 'border-red-500' : '')}
                                        />
                                        <InputError message={errors.dni} className="mt-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Sección: Contacto */}
                            <div className="space-y-4 border-t pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-semibold text-muted-foreground">2</div>
                                    <h3 className="text-sm font-semibold">Contact Information</h3>
                                    {fieldsCompleted.email && fieldsCompleted.telefono && fieldsCompleted.direccion && (
                                        <Check className="h-4 w-4 text-green-500 ml-auto" />
                                    )}
                                </div>

                                <div className="grid gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={5}
                                            autoComplete="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="email@example.com"

                                            className={fieldsCompleted.email ? 'border-green-500' : (formData.email.length > 0 ? 'border-red-500' : '')}
                                        />
                                        <InputError message={errors.email} className="mt-1" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="telefono">Phone Number</Label>
                                        <Input
                                            id="telefono"
                                            type="tel"
                                            tabIndex={6}
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            placeholder="+51 983..."

                                            className={fieldsCompleted.telefono ? 'border-green-500' : (formData.telefono.length > 0 ? 'border-red-500' : '')}
                                        />
                                        <InputError message={errors.telefono} className="mt-1" />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="direccion">Address</Label>
                                        <Input
                                            id="direccion"
                                            type="text"
                                            tabIndex={7}
                                            name="direccion"
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            placeholder="Av. Principal 123, Distrito, Ciudad"

                                            className={fieldsCompleted.direccion ? 'border-green-500' : (formData.direccion.length > 0 ? 'border-red-500' : '')}
                                        />
                                        <InputError message={errors.direccion} className="mt-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Sección: Credenciales */}
                            <div className="space-y-4 border-t pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-semibold text-muted-foreground">3</div>
                                    <h3 className="text-sm font-semibold">Password</h3>
                                    {fieldsCompleted.password && fieldsCompleted.confirmPassword && (
                                        <Check className="h-4 w-4 text-green-500 ml-auto" />
                                    )}
                                </div>

                                <div className="grid gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={8}
                                            autoComplete="new-password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Min 8 characters"
                                            className={formData.password && formData.password.length >= 8 ? 'border-green-500' : ''}
                                        />
                                        <InputError message={errors.password} className="mt-1" />
                                        {formData.password && (
                                            <p className={`text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {formData.password.length >= 8 ? '✓ Strong password' : '⚠ Min 8 characters required'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">Confirm password *</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={9}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            placeholder="Confirm password"
                                            className={passwordsMatch ? 'border-green-500' : formData.password_confirmation ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.password_confirmation} className="mt-1" />
                                        {formData.password_confirmation && !passwordsMatch && (
                                            <p className="text-xs text-red-600">✗ Passwords do not match</p>
                                        )}
                                        {passwordsMatch && (
                                            <p className="text-xs text-green-600">✓ Passwords match</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            {allFieldsComplete && (
                                <div className="border-t pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        {showPreview ? '▼ Hide' : '▶ Show'} Preview
                                    </button>

                                    {showPreview && (
                                        <Card className="mt-3 bg-muted/50">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-base">Account Preview</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Full Name:</span>
                                                    <span className="font-semibold">{nombreCompleto}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Email:</span>
                                                    <span className="font-semibold">{formData.email}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">DNI:</span>
                                                    <span className="font-semibold">{formData.dni}</span>
                                                </div>
                                                {formData.telefono && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Phone:</span>
                                                        <span className="font-semibold">{formData.telefono}</span>
                                                    </div>
                                                )}
                                                {formData.direccion && (
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Address:</span>
                                                        <span className="font-semibold">{formData.direccion}</span>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={10}
                                disabled={!allFieldsComplete || processing}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                {allFieldsComplete ? 'Create account' : 'Complete all fields'}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={11}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
