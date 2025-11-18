<?php

use App\Http\Controllers\AsignacionDocenteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MatriculaController;
use App\Http\Controllers\ModuloController;
use App\Http\Controllers\PeriodoAcademicoController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard según rol
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Rutas para Super Admin y Administración
    Route::middleware(['role:super_admin,administracion'])->group(function () {
        Route::resource('usuarios', UsuarioController::class);
        Route::resource('modulos', ModuloController::class);
        Route::resource('periodos-academicos', PeriodoAcademicoController::class);
        Route::resource('asignaciones', AsignacionDocenteController::class);
        
        // Gestión de matrículas (vista administrativa)
        Route::get('matriculas', [MatriculaController::class, 'index'])->name('matriculas.index');
        Route::get('matriculas/{matricula}', [MatriculaController::class, 'show'])->name('matriculas.show');
        Route::post('matriculas/{matricula}/confirmar-pago', [MatriculaController::class, 'confirmarPago'])
            ->name('matriculas.confirmar-pago');
    });
    
    // Rutas solo para Super Admin
    Route::middleware(['role:super_admin'])->group(function () {
        // Aquí puedes agregar rutas exclusivas del super admin
        // Como gestión de configuración, respaldos, etc.
    });
    
    // Rutas para Estudiantes
    Route::middleware(['role:estudiante'])->group(function () {
        Route::get('mi-matricula/crear', [MatriculaController::class, 'create'])->name('mi-matricula.create');
        Route::post('mi-matricula', [MatriculaController::class, 'store'])->name('mi-matricula.store');
        Route::get('mi-matricula/{matricula}', [MatriculaController::class, 'show'])->name('mi-matricula.show');
        Route::post('mi-matricula/{matricula}/confirmar-pago', [MatriculaController::class, 'confirmarPago'])
            ->name('mi-matricula.confirmar-pago');
        Route::get('mi-matricula/{matricula}/constancia', [MatriculaController::class, 'descargarConstancia'])
            ->name('mi-matricula.constancia');
        Route::delete('mi-matricula/{matricula}', [MatriculaController::class, 'destroy'])
            ->name('mi-matricula.destroy');
    });
    
    // Rutas para Docentes
    Route::middleware(['role:docente'])->group(function () {
        // Los docentes pueden ver sus módulos asignados desde el dashboard
        // Aquí se pueden agregar rutas para registro de asistencia, calificaciones, etc.
    });
});

require __DIR__.'/settings.php';
