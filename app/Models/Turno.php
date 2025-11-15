<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Turno extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'hora_inicio',
        'hora_fin',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'hora_inicio' => 'string',
        'hora_fin' => 'string',
        'activo' => 'boolean',
    ];

    public function asignaciones()
    {
        return $this->hasMany(AsignacionDocente::class);
    }

    public function matriculas()
    {
        return $this->hasMany(Matricula::class);
    }
}
