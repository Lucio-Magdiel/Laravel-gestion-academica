<?php

namespace Database\Seeders;

use App\Models\PeriodoAcademico;
use Illuminate\Database\Seeder;

class PeriodoAcademicoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $periodos = [
            [
                'nombre' => '2025-I',
                'descripcion' => 'Primer ciclo académico 2025',
                'anio' => 2025,
                'semestre' => 1,
                'fecha_inicio' => '2025-03-01',
                'fecha_fin' => '2025-07-31',
                'estado' => 'activo',
            ],
            [
                'nombre' => '2025-II',
                'descripcion' => 'Segundo ciclo académico 2025',
                'anio' => 2025,
                'semestre' => 2,
                'fecha_inicio' => '2025-08-01',
                'fecha_fin' => '2025-12-31',
                'estado' => 'borrador',
            ],
            [
                'nombre' => '2024-II',
                'descripcion' => 'Segundo ciclo académico 2024',
                'anio' => 2024,
                'semestre' => 2,
                'fecha_inicio' => '2024-08-01',
                'fecha_fin' => '2024-12-31',
                'estado' => 'cerrado',
            ],
        ];

        foreach ($periodos as $periodo) {
            PeriodoAcademico::updateOrCreate(
                [
                    'anio' => $periodo['anio'],
                    'semestre' => $periodo['semestre'],
                ],
                $periodo
            );
        }

        $this->command->info('✓ Períodos académicos creados (2025-I activo para matrículas)');
    }
}
