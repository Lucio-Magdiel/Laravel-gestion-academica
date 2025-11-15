<?php

namespace Database\Seeders;

use App\Models\Semestre;
use Illuminate\Database\Seeder;

class SemestreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $semestres = [
            ['numero' => 1, 'nombre' => 'Primer Semestre', 'descripcion' => 'Semestre 1 - Ciclo I', 'orden' => 1],
            ['numero' => 2, 'nombre' => 'Segundo Semestre', 'descripcion' => 'Semestre 2 - Ciclo II', 'orden' => 2],
            ['numero' => 3, 'nombre' => 'Tercer Semestre', 'descripcion' => 'Semestre 3 - Ciclo I', 'orden' => 3],
            ['numero' => 4, 'nombre' => 'Cuarto Semestre', 'descripcion' => 'Semestre 4 - Ciclo II', 'orden' => 4],
            ['numero' => 5, 'nombre' => 'Quinto Semestre', 'descripcion' => 'Semestre 5 - Ciclo I', 'orden' => 5],
            ['numero' => 6, 'nombre' => 'Sexto Semestre', 'descripcion' => 'Semestre 6 - Ciclo II', 'orden' => 6],
        ];

        foreach ($semestres as $semestre) {
            Semestre::create($semestre);
        }
    }
}
