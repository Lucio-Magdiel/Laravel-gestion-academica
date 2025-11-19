<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matricula extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'estudiante_id',
        'periodo_academico_id',
        'semestre_id',
        'seccion_id',
        'turno_id',
        'estado',
        'fecha_registro',
        'fecha_confirmacion',
        'observaciones',
    ];

    protected $casts = [
        'fecha_registro' => 'date',
        'fecha_confirmacion' => 'date',
    ];

    public function estudiante()
    {
        return $this->belongsTo(Usuario::class, 'estudiante_id');
    }

    public function periodo()
    {
        return $this->belongsTo(PeriodoAcademico::class, 'periodo_academico_id');
    }

    public function periodoAcademico()
    {
        return $this->belongsTo(PeriodoAcademico::class, 'periodo_academico_id');
    }

    public function seccion()
    {
        return $this->belongsTo(Seccion::class);
    }

    public function semestre()
    {
        return $this->belongsTo(Semestre::class);
    }

    public function turno()
    {
        return $this->belongsTo(Turno::class);
    }

    public function detalles()
    {
        return $this->hasMany(DetalleMatricula::class);
    }

    public function estaConfirmada(): bool
    {
        return $this->estado === 'confirmada';
    }
}
