<?php

namespace Database\Seeders;

use App\Models\Turno;
use Illuminate\Database\Seeder;

class TurnoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Turno::create([
            'nombre' => 'Mañana',
            'hora_inicio' => '07:50:00',
            'hora_fin' => '13:00:00',
            'descripcion' => 'Turno único - Mañana',
            'activo' => true,
        ]);
    }
}
