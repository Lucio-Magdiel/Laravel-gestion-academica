<?php

namespace App\Services;

use App\Models\BitacoraAccion;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class BitacoraLogger
{
    /**
     * Registrar una acción en la bitácora.
     *
     * @param string $accion Nombre corto de la acción (ej: 'Crear Usuario')
     * @param string|null $descripcion Descripción detallada
     * @param string|null $entidad Nombre de la entidad afectada (ej: 'Usuario')
     * @param int|string|null $entidadId ID de la entidad afectada
     * @param array|null $datosOriginales Datos antes del cambio
     * @param array|null $datosCambiados Datos después del cambio
     * @return BitacoraAccion
     */
    public static function log(
        string $accion,
        ?string $descripcion = null,
        ?string $entidad = null,
        $entidadId = null,
        ?array $datosOriginales = null,
        ?array $datosCambiados = null
    ) {
        return BitacoraAccion::create([
            'usuario_id' => Auth::id(), // Puede ser null si es una acción del sistema o registro público
            'accion' => $accion,
            'descripcion' => $descripcion,
            'entidad' => $entidad,
            'entidad_id' => $entidadId,
            'datos_originales' => $datosOriginales,
            'datos_cambiados' => $datosCambiados,
            'ip' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}
