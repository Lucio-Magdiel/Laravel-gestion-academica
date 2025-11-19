<?php

namespace App\Console\Commands;

use App\Models\AsignacionDocente;
use App\Models\DetalleMatricula;
use App\Models\Matricula;
use Illuminate\Console\Command;

class ActualizarDetallesMatricula extends Command
{
    protected $signature = 'matricula:actualizar-detalles {id}';
    protected $description = 'Actualizar detalles de matrícula con las asignaciones docentes correspondientes';

    public function handle()
    {
        $matriculaId = $this->argument('id');
        $matricula = Matricula::findOrFail($matriculaId);

        $this->info("Actualizando matrícula: {$matricula->codigo}");
        $this->info("Semestre: {$matricula->semestre_id}, Período: {$matricula->periodo_academico_id}");
        $this->info("Sección: {$matricula->seccion_id}, Turno: {$matricula->turno_id}");

        // Buscar asignaciones docentes
        $asignaciones = AsignacionDocente::where('periodo_academico_id', $matricula->periodo_academico_id)
            ->where('seccion_id', $matricula->seccion_id)
            ->where('turno_id', $matricula->turno_id)
            ->whereHas('modulo', function($q) use ($matricula) {
                $q->where('semestre_id', $matricula->semestre_id);
            })
            ->get();

        $this->info("Asignaciones encontradas: {$asignaciones->count()}");

        $creados = 0;
        foreach ($asignaciones as $asignacion) {
            $detalle = DetalleMatricula::firstOrCreate(
                [
                    'matricula_id' => $matricula->id,
                    'asignacion_docente_id' => $asignacion->id,
                ],
                [
                    'estado' => 'registrado',
                ]
            );

            if ($detalle->wasRecentlyCreated) {
                $creados++;
                $this->line("✓ {$asignacion->modulo->nombre}");
            }
        }

        $this->info("\n✅ Proceso completado: {$creados} detalles creados");
        return 0;
    }
}
