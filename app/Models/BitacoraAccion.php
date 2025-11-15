<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BitacoraAccion extends Model
{
    use HasFactory;

    protected $table = 'bitacora_acciones';

    protected $fillable = [
        'usuario_id',
        'accion',
        'descripcion',
        'entidad',
        'entidad_id',
        'datos_originales',
        'datos_cambiados',
        'ip',
        'user_agent',
    ];

    protected $casts = [
        'datos_originales' => 'array',
        'datos_cambiados' => 'array',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}
