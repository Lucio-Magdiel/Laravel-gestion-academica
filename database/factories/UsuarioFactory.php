<?php

namespace Database\Factories;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Usuario>
 */
class UsuarioFactory extends Factory
{
    protected $model = Usuario::class;

    /**
     * Contraseña temporal para los usuarios de prueba.
     */
    protected static ?string $password = null;

    /**
     * Define el estado por defecto del modelo.
     */
    public function definition(): array
    {
        return [
            'nombre_completo' => fake()->name(),
            'dni' => fake()->unique()->numerify('########'),
            'telefono' => fake()->optional()->e164PhoneNumber(),
            'direccion' => fake()->optional()->address(),
            'rol' => fake()->randomElement(['super_admin', 'administracion', 'docente', 'estudiante']),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= 'password',
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ];
    }

    /**
     * Indica que el correo no debe estar verificado.
     */
    public function noVerificado(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function unverified(): static
    {
        return $this->noVerificado();
    }

    /**
     * Indica que el usuario no tiene doble factor configurado.
     */
    public function sinDobleFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ]);
    }

    public function withoutTwoFactor(): static
    {
        return $this->sinDobleFactor();
    }
}
