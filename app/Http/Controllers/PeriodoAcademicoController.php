<?php

namespace App\Http\Controllers;

use App\Models\PeriodoAcademico;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodoAcademicoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $periodos = PeriodoAcademico::orderBy('anio', 'desc')
            ->orderBy('semestre', 'desc')
            ->get();

        return Inertia::render('periodos-academicos/index', [
            'periodos' => $periodos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('periodos-academicos/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'anio' => 'required|integer|min:2020|max:2050',
            'semestre' => 'required|in:1,2',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'estado' => 'required|in:borrador,activo,finalizado',
        ]);

        // Generar nombre automáticamente
        $semestreNombre = $validated['semestre'] == 1 ? '1' : '2';
        $validated['nombre'] = "Periodo {$semestreNombre} {$validated['anio']}";

        PeriodoAcademico::create($validated);

        return redirect()->route('periodos-academicos.index')
            ->with('success', 'Período académico creado exitosamente');
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
        $periodo = PeriodoAcademico::findOrFail($id);

        return Inertia::render('periodos-academicos/edit', [
            'periodo' => $periodo,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $periodo = PeriodoAcademico::findOrFail($id);

        $validated = $request->validate([
            'anio' => 'required|integer|min:2020|max:2050',
            'semestre' => 'required|in:1,2',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'estado' => 'required|in:borrador,activo,finalizado',
        ]);

        // Generar nombre automáticamente
        $semestreNombre = $validated['semestre'] == 1 ? '1' : '2';
        $validated['nombre'] = "Periodo {$semestreNombre} {$validated['anio']}";

        $periodo->update($validated);

        return redirect()->route('periodos-academicos.index')
            ->with('success', 'Período académico actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $periodo = PeriodoAcademico::findOrFail($id);
        $periodo->delete();

        return redirect()->route('periodos-academicos.index')
            ->with('success', 'Período académico eliminado exitosamente');
    }
}
