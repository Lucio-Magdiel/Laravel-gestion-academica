<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            // Agregar campos de nombre separado
            $table->string('nombre')->nullable()->after('id');
            $table->string('apellido_paterno')->nullable()->after('nombre');
            $table->string('apellido_materno')->nullable()->after('apellido_paterno');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn(['nombre', 'apellido_paterno', 'apellido_materno']);
        });
    }
};
