<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modulo extends Model
{
    use HasFactory;

    protected $fillable = [
        'semestre_id',
        'nombre',
        'codigo',
        'descripcion',
        'creditos',
        'horas_semanales',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function semestre()
    {
        return $this->belongsTo(Semestre::class);
    }

    public function asignaciones()
    {
        return $this->hasMany(AsignacionDocente::class);
    }
}
