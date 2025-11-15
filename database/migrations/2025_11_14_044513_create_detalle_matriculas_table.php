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
        Schema::create('detalle_matriculas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('matricula_id')->constrained('matriculas')->cascadeOnDelete();
            $table->foreignId('asignacion_docente_id')->constrained('asignacion_docentes')->cascadeOnDelete();
            $table->string('estado')->default('registrado');
            $table->decimal('nota_final', 5, 2)->nullable();
            $table->string('observaciones')->nullable();
            $table->timestamps();

            $table->unique(['matricula_id', 'asignacion_docente_id'], 'detalle_matricula_unica');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detalle_matriculas');
    }
};
