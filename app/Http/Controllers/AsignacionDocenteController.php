<?php

namespace App\Http\Controllers;

use App\Models\AsignacionDocente;
use App\Models\Modulo;
use App\Models\PeriodoAcademico;
use App\Models\Seccion;
use App\Models\Turno;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AsignacionDocenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $asignaciones = AsignacionDocente::with(['docente', 'modulo.semestre', 'seccion', 'turno', 'periodoAcademico'])
            ->latest()
            ->get();

        return Inertia::render('asignaciones/index', [
            'asignaciones' => $asignaciones,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $docentes = Usuario::where('rol', 'docente')->where('activo', true)->get();
        $modulos = Modulo::where('activo', true)->with('semestre')->get();
        $semestres = \App\Models\Semestre::where('activo', true)->get();
        $secciones = Seccion::where('activo', true)->get();
        $turnos = Turno::where('activo', true)->get();
        $periodos = PeriodoAcademico::orderBy('anio', 'desc')->get();

        return Inertia::render('asignaciones/create', [
            'docentes' => $docentes,
            'modulos' => $modulos,
            'semestres' => $semestres,
            'secciones' => $secciones,
            'turnos' => $turnos,
            'periodos' => $periodos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'docente_id' => 'required|exists:usuarios,id',
            'modulo_id' => 'required|exists:modulos,id',
            'seccion_id' => 'required|exists:secciones,id',
            'turno_id' => 'required|exists:turnos,id',
            'periodo_academico_id' => 'required|exists:periodos_academicos,id',
        ]);

        AsignacionDocente::create($validated);

        return redirect()->route('asignaciones.index')
            ->with('success', 'Asignación creada exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $asignacion = AsignacionDocente::with(['docente', 'modulo.semestre', 'seccion', 'turno', 'periodoAcademico'])
            ->findOrFail($id);
        
        $docentes = Usuario::where('rol', 'docente')->where('activo', true)->get();
        $modulos = Modulo::where('activo', true)->with('semestre')->get();
        $semestres = \App\Models\Semestre::where('activo', true)->get();
        $secciones = Seccion::where('activo', true)->get();
        $turnos = Turno::where('activo', true)->get();
        $periodos = PeriodoAcademico::orderBy('anio', 'desc')->get();

        return Inertia::render('asignaciones/edit', [
            'asignacion' => $asignacion,
            'docentes' => $docentes,
            'modulos' => $modulos,
            'semestres' => $semestres,
            'secciones' => $secciones,
            'turnos' => $turnos,
            'periodos' => $periodos,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $asignacion = AsignacionDocente::findOrFail($id);

        $validated = $request->validate([
            'docente_id' => 'required|exists:usuarios,id',
            'modulo_id' => 'required|exists:modulos,id',
            'seccion_id' => 'required|exists:secciones,id',
            'turno_id' => 'required|exists:turnos,id',
            'periodo_academico_id' => 'required|exists:periodos_academicos,id',
        ]);

        $asignacion->update($validated);

        return redirect()->route('asignaciones.index')
            ->with('success', 'Asignación actualizada exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $asignacion = AsignacionDocente::findOrFail($id);
        $asignacion->delete();

        return redirect()->route('asignaciones.index')
            ->with('success', 'Asignación eliminada exitosamente');
    }
}
