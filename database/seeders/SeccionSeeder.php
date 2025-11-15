<?php

namespace Database\Seeders;

use App\Models\Seccion;
use Illuminate\Database\Seeder;

class SeccionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $secciones = [
            ['nombre' => 'A', 'descripcion' => 'Sección A - Capacidad 25 estudiantes', 'activo' => true],
            ['nombre' => 'B', 'descripcion' => 'Sección B - Capacidad según demanda', 'activo' => true],
        ];

        foreach ($secciones as $seccion) {
            Seccion::create($seccion);
        }
    }
}
