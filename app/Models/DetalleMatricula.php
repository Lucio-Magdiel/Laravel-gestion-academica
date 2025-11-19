<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleMatricula extends Model
{
    use HasFactory;

    protected $fillable = [
        'matricula_id',
        'asignacion_docente_id',
        'estado',
        'nota_final',
        'observaciones',
    ];

    protected $casts = [
        'nota_final' => 'decimal:2',
    ];

    public function matricula()
    {
        return $this->belongsTo(Matricula::class);
    }

    public function asignacion()
    {
        return $this->belongsTo(AsignacionDocente::class, 'asignacion_docente_id');
    }

    // Alias para mantener compatibilidad
    public function asignacionDocente()
    {
        return $this->belongsTo(AsignacionDocente::class, 'asignacion_docente_id');
    }
}
