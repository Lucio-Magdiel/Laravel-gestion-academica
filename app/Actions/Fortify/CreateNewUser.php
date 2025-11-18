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
            'nombre' => ['required', 'string', 'max:255'],
            'apellido_paterno' => ['nullable', 'string', 'max:255'],
            'apellido_materno' => ['nullable', 'string', 'max:255'],
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
            'telefono' => ['nullable', 'string', 'max:20'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'password' => $this->passwordRules(),
        ])->validate();

        return Usuario::create([
            'nombre' => $input['nombre'],
            'apellido_paterno' => $input['apellido_paterno'] ?? null,
            'apellido_materno' => $input['apellido_materno'] ?? null,
            'dni' => $input['dni'],
            'email' => $input['email'],
            'telefono' => $input['telefono'] ?? null,
            'direccion' => $input['direccion'] ?? null,
            'rol' => $input['rol'] ?? 'estudiante',
            'password' => $input['password'],
        ]);
    }
}
