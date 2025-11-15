<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class Usuario extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UsuarioFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Nombre de la tabla asociada.
     */
    protected $table = 'usuarios';

    /**
     * Atributos asignables masivamente.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'nombre_completo',
        'email',
        'dni',
        'password',
        'telefono',
        'direccion',
        'rol',
        'activo',
    ];

    /**
     * Atributos agregados al modelo.
     *
     * @var list<string>
     */
    protected $appends = ['name'];

    /**
     * Atributos ocultos.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Casts del modelo.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'activo' => 'boolean',
        ];
    }

    /**
     * Accessor para el atributo 'name'.
     * Retorna nombre_completo.
     */
    public function getNameAttribute(): string
    {
        return $this->nombre_completo ?? '';
    }

    /**
     * Mutator para el atributo 'name'.
     * Guarda en nombre_completo.
     */
    public function setNameAttribute($value): void
    {
        $this->attributes['nombre_completo'] = $value;
    }

    public function matriculas()
    {
        return $this->hasMany(Matricula::class, 'estudiante_id');
    }

    public function asignacionesDocentes()
    {
        return $this->hasMany(AsignacionDocente::class, 'docente_id');
    }

    public function bitacoras()
    {
        return $this->hasMany(BitacoraAccion::class);
    }

    public function esSuperAdmin(): bool
    {
        return $this->rol === 'super_admin';
    }

    public function esAdministrador(): bool
    {
        return in_array($this->rol, ['super_admin', 'administracion'], true);
    }

    public function esDocente(): bool
    {
        return $this->rol === 'docente';
    }

    public function esEstudiante(): bool
    {
        return $this->rol === 'estudiante';
    }
}
