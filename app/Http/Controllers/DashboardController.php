<?php

namespace App\Http\Controllers;

use App\Models\AsignacionDocente;
use App\Models\Matricula;
use App\Models\Modulo;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\Usuario $user */
        $user = auth()->user();

        return match($user->rol) {
            'super_admin', 'administracion' => $this->adminDashboard(),
            'docente' => $this->docenteDashboard(),
            'estudiante' => $this->estudianteDashboard(),
            default => abort(403),
        };
    }

    private function adminDashboard()
    {
        $stats = [
            'total_estudiantes' => Usuario::where('rol', 'estudiante')->count(),
            'total_docentes' => Usuario::where('rol', 'docente')->count(),
            'total_modulos' => Modulo::count(),
            'matriculas_activas' => Matricula::where('estado', 'confirmado')->count(),
            'modulos_sin_docente' => Modulo::whereDoesntHave('asignaciones')->count(),
        ];

        return Inertia::render('dashboard/admin', [
            'stats' => $stats,
        ]);
    }

    private function docenteDashboard()
    {
        /** @var \App\Models\Usuario $docente */
        $docente = auth()->user();
        
        $asignaciones = AsignacionDocente::where('docente_id', $docente->id)
            ->with(['modulo', 'seccion', 'turno', 'periodo'])
            ->get();

        return Inertia::render('dashboard/docente', [
            'asignaciones' => $asignaciones,
        ]);
    }

    private function estudianteDashboard()
    {
        /** @var \App\Models\Usuario $estudiante */
        $estudiante = auth()->user();
        
        $matricula = Matricula::where('estudiante_id', $estudiante->id)
            ->with(['detalles.asignacionDocente.modulo', 'detalles.asignacionDocente.docente', 'periodoAcademico', 'seccion', 'turno', 'semestre'])
            ->latest()
            ->first();

        return Inertia::render('dashboard/estudiante', [
            'matricula' => $matricula,
        ]);
    }
}
