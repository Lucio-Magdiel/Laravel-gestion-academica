<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SemestreSeeder::class,
            TurnoSeeder::class,
            SeccionSeeder::class,
            ModuloSeeder::class,
            PeriodoAcademicoSeeder::class,
            SuperAdminSeeder::class,
        ]);

        $this->command->info('🎉 Base de datos poblada exitosamente!');
    }
}
