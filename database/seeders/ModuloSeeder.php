<?php

namespace Database\Seeders;

use App\Models\Modulo;
use App\Models\Semestre;
use Illuminate\Database\Seeder;

class ModuloSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modulosPorSemestre = [
            1 => [
                'Procesador de textos',
                'TIC',
                'Arquitectura de plataformas y soporte técnico',
                'Hoja de cálculo',
                'Plataformas de productividad',
                'Diagnóstico y solución de incidentes',
            ],
            2 => [
                'Modelado de procesos de negocio',
                'Comunicación efectiva',
                'Mantenimiento y configuración de equipos informáticos',
                'Administración de sistemas operativos',
                'Administración de centros de cómputo',
                'Tutoría',
                'Trabajo colaborativo',
                'Redes y teleproceso',
            ],
            3 => [
                'Ensamblaje y reparación de computadoras',
                'Modelamiento de sistemas',
                'Administración y gestión de redes y servidores',
                'Inglés para la comunicación oral',
                'Pruebas de rendimiento de redes',
                'Auditoría en computación e informática',
            ],
            4 => [
                'Análisis y diseño de sistemas',
                'Base de datos',
                'Emprendimiento',
                'Tutoría',
                'Fundamentos de programación',
                'Seguridad informática',
                'Lenguaje de programación',
                'Cultura ambiental',
            ],
            5 => [
                'Programación orientada a objetos',
                'Programación distribuida',
                'Diseño web',
                'Solución de problemas',
                'Administración de base de datos',
                'Diseño y animación de gráficos',
                'Investigación',
            ],
            6 => [
                'Fundamentos de internet de las cosas',
                'Comportamiento ético',
                'Gestión de proyectos de tecnología de información',
                'Desarrollo de aplicaciones móviles',
                'Taller de programación web',
            ],
        ];

        foreach ($modulosPorSemestre as $semestreNumero => $modulos) {
            $semestre = Semestre::where('numero', $semestreNumero)->first();
            
            if (!$semestre) {
                continue;
            }

            foreach ($modulos as $index => $nombreModulo) {
                Modulo::create([
                    'semestre_id' => $semestre->id,
                    'nombre' => $nombreModulo,
                    'codigo' => 'S' . $semestreNumero . '-M' . str_pad($index + 1, 2, '0', STR_PAD_LEFT),
                    'descripcion' => 'Módulo del ' . $semestre->nombre,
                    'horas_semanales' => 6,
                    'activo' => true,
                ]);
            }
        }
    }
}
