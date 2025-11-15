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
        Schema::create('asignacion_docentes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('docente_id')->constrained('usuarios')->cascadeOnDelete();
            $table->foreignId('modulo_id')->constrained('modulos')->cascadeOnDelete();
            $table->foreignId('periodo_academico_id')->constrained('periodos_academicos')->cascadeOnDelete();
            $table->foreignId('seccion_id')->constrained('secciones')->cascadeOnDelete();
            $table->foreignId('turno_id')->constrained('turnos')->cascadeOnDelete();
            $table->unsignedSmallInteger('cupos_totales')->default(30);
            $table->unsignedSmallInteger('cupos_disponibles')->default(30);
            $table->string('estado')->default('activo');
            $table->timestamps();

            $table->unique([
                'docente_id',
                'modulo_id',
                'periodo_academico_id',
                'seccion_id',
                'turno_id',
            ], 'asignacion_docente_unica');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asignacion_docentes');
    }
};
