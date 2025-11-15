<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seccion extends Model
{
    use HasFactory;

    protected $table = 'secciones';

    protected $fillable = [
        'nombre',
        'descripcion',
        'activo',
    ];

    protected $casts = [
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
