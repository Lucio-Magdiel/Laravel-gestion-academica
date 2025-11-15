<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriodoAcademico extends Model
{
    use HasFactory;

    protected $table = 'periodos_academicos';

    protected $fillable = [
        'nombre',
        'anio',
        'semestre',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'descripcion',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    public function asignaciones()
    {
        return $this->hasMany(AsignacionDocente::class);
    }

    public function matriculas()
    {
        return $this->hasMany(Matricula::class);
    }

    public function esActual(): bool
    {
        $hoy = now()->toDateString();

        return $this->fecha_inicio->toDateString() <= $hoy && $this->fecha_fin->toDateString() >= $hoy;
    }
}
