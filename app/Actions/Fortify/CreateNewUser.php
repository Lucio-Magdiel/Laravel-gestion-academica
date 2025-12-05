<?php

namespace App\Actions\Fortify;

use App\Models\Usuario;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): Usuario
    {
        Validator::make($input, [
            'nombre' => ['required', 'string', 'max:255', 'regex:/^[\pL\s]+$/u'],
            'apellido_paterno' => ['nullable', 'string', 'max:255', 'regex:/^[\pL\s]+$/u'],
            'apellido_materno' => ['nullable', 'string', 'max:255', 'regex:/^[\pL\s]+$/u'],
            'dni' => [
                'required',
                'string',
                'max:15',
                Rule::unique(Usuario::class, 'dni'),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(Usuario::class, 'email'),
            ],
            'telefono' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s()]*$/'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'password' => $this->passwordRules(),
        ], [
            'nombre.regex' => 'El nombre solo debe contener letras.',
            'apellido_paterno.regex' => 'El apellido paterno solo debe contener letras.',
            'apellido_materno.regex' => 'El apellido materno solo debe contener letras.',
            'telefono.regex' => 'El teléfono solo debe contener números y caracteres válidos.',
        ])->validate();

        $user = Usuario::create([
            'nombre' => $input['nombre'],
            'apellido_paterno' => $input['apellido_paterno'] ?? null,
            'apellido_materno' => $input['apellido_materno'] ?? null,
            'nombre_completo' => trim($input['nombre'] . ' ' . ($input['apellido_paterno'] ?? '') . ' ' . ($input['apellido_materno'] ?? '')),
            'dni' => $input['dni'],
            'email' => $input['email'],
            'telefono' => $input['telefono'] ?? null,
            'direccion' => $input['direccion'] ?? null,
            'rol' => 'estudiante',
            'password' => $input['password'],
        ]);

        \App\Services\BitacoraLogger::log(
            'Registro de Usuario',
            'Nuevo usuario registrado: ' . $user->nombre_completo,
            'Usuario',
            $user->id,
            null,
            $user->toArray()
        );

        return $user;
    }
}
