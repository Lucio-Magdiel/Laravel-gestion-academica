<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsignacionDocente extends Model
{
    use HasFactory;

    protected $fillable = [
        'docente_id',
        'modulo_id',
        'periodo_academico_id',
        'seccion_id',
        'turno_id',
        'cupos_totales',
        'cupos_disponibles',
        'estado',
    ];

    protected $casts = [
        'cupos_totales' => 'integer',
        'cupos_disponibles' => 'integer',
    ];

    public function docente()
    {
        return $this->belongsTo(Usuario::class, 'docente_id');
    }

    public function modulo()
    {
        return $this->belongsTo(Modulo::class);
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

    public function turno()
    {
        return $this->belongsTo(Turno::class);
    }

    public function detallesMatricula()
    {
        return $this->hasMany(DetalleMatricula::class);
    }

    public function cuposRestantes(): int
    {
        return max(0, $this->cupos_disponibles);
    }
}
