<?php

namespace Database\Seeders;

use App\Models\AsignacionDocente;
use App\Models\Modulo;
use App\Models\PeriodoAcademico;
use App\Models\Seccion;
use App\Models\Turno;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class AsignacionDocenteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener datos necesarios
        $periodoActivo = PeriodoAcademico::where('estado', 'activo')->first();
        $seccionA = Seccion::where('nombre', 'A')->first();
        $turnoManana = Turno::where('nombre', 'Mañana')->first();
        
        // Obtener o crear docente de prueba
        $docente = Usuario::firstOrCreate(
            ['email' => 'docente@test.com'],
            [
                'nombre' => 'Juan',
                'apellido_paterno' => 'Pérez',
                'apellido_materno' => 'García',
                'nombre_completo' => 'Juan Pérez García',
                'dni' => '87654321',
                'telefono' => '987654321',
                'rol' => 'docente',
                'activo' => true,
                'password' => bcrypt('password'),
            ]
        );

        // Obtener módulos del Sexto Semestre
        $modulosSexto = Modulo::where('semestre_id', 6)->get();

        echo "Creando asignaciones para " . $modulosSexto->count() . " módulos del Sexto Semestre\n";

        foreach ($modulosSexto as $modulo) {
            $asignacion = AsignacionDocente::firstOrCreate(
                [
                    'modulo_id' => $modulo->id,
                    'periodo_academico_id' => $periodoActivo->id,
                    'seccion_id' => $seccionA->id,
                    'turno_id' => $turnoManana->id,
                ],
                [
                    'docente_id' => $docente->id,
                    'cupos_disponibles' => 25,
                    'cupos_totales' => 25,
                ]
            );

            echo "✓ {$modulo->nombre} - {$docente->nombre_completo}\n";
        }

        echo "\n✅ Asignaciones docentes creadas exitosamente\n";
    }
}
