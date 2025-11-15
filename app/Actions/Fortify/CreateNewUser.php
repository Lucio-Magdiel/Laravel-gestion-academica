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
            'name' => ['required', 'string', 'max:255'],
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
            'password' => $this->passwordRules(),
        ])->validate();

        return Usuario::create([
            'nombre_completo' => $input['name'],
            'dni' => $input['dni'] ?? null,
            'email' => $input['email'],
            'telefono' => $input['telefono'] ?? null,
            'direccion' => $input['direccion'] ?? null,
            'rol' => $input['rol'] ?? 'estudiante',
            'password' => $input['password'],
        ]);
    }
}
