<?php

namespace App\Console\Commands;

use App\Models\Matricula;
use Illuminate\Console\Command;

class VerificarMatricula extends Command
{
    protected $signature = 'matricula:verificar {id}';
    protected $description = 'Verificar datos de matrícula y sus detalles';

    public function handle()
    {
        $matricula = Matricula::with([
            'estudiante',
            'periodoAcademico',
            'semestre',
            'seccion',
            'turno',
            'detalles.asignacionDocente.modulo',
            'detalles.asignacionDocente.docente'
        ])->findOrFail($this->argument('id'));

        $this->info("=== MATRÍCULA {$matricula->codigo} ===");
        $this->info("Estudiante: {$matricula->estudiante->nombre_completo}");
        $this->info("Período: " . ($matricula->periodoAcademico->nombre ?? 'NULL'));
        $this->info("Semestre: " . ($matricula->semestre->nombre ?? 'NULL'));
        $this->info("Sección: {$matricula->seccion->nombre}");
        $this->info("Turno: {$matricula->turno->nombre}");
        $this->newLine();

        $this->info("=== DETALLES ({$matricula->detalles->count()}) ===");
        foreach ($matricula->detalles as $detalle) {
            $this->line("ID: {$detalle->id}");
            $this->line("  Asignación ID: {$detalle->asignacion_docente_id}");
            $this->line("  Módulo: " . ($detalle->asignacionDocente?->modulo?->nombre ?? 'NULL'));
            $this->line("  Código: " . ($detalle->asignacionDocente?->modulo?->codigo ?? 'NULL'));
            $this->line("  Créditos: " . ($detalle->asignacionDocente?->modulo?->creditos ?? 'NULL'));
            $this->line("  Docente: " . ($detalle->asignacionDocente?->docente?->nombre_completo ?? 'NULL'));
            $this->newLine();
        }

        return 0;
    }
}
