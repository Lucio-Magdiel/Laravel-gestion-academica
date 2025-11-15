<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Usuario::create([
            'nombre_completo' => 'Super Administrador',
            'dni' => '00000000',
            'telefono' => '999999999',
            'direccion' => 'Dirección del sistema',
            'rol' => 'super_admin',
            'email' => 'admin@sistema.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $this->command->info('✅ Super Admin creado: admin@sistema.com / password');
    }
}
