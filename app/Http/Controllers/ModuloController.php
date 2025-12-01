<?php

namespace App\Http\Controllers;

use App\Models\Modulo;
use App\Models\Semestre;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ModuloController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $modulos = Modulo::with('semestre')
            ->orderBy('semestre_id')
            ->orderBy('codigo')
            ->get();

        return Inertia::render('modulos/index', [
            'modulos' => $modulos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $semestres = Semestre::where('activo', true)->orderBy('numero')->get();

        return Inertia::render('modulos/create', [
            'semestres' => $semestres,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'semestre_id' => 'required|integer|exists:semestres,id',
            'codigo' => 'required|string|max:20|unique:modulos,codigo',
            'nombre' => 'required|string|max:255',
            'creditos' => 'required|integer|min:1|max:10',
            'horas_semanales' => 'required|integer|min:1|max:20',
            'activo' => 'boolean',
        ]);

        // Asegurar que los valores sean convertidos a integers
        $validated['semestre_id'] = (int) $validated['semestre_id'];
        $validated['creditos'] = (int) $validated['creditos'];
        $validated['horas_semanales'] = (int) $validated['horas_semanales'];

        Modulo::create($validated);

        return redirect()->route('modulos.index')
            ->with('success', 'Módulo creado exitosamente');
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
        $modulo = Modulo::with('semestre')->findOrFail($id);
        $semestres = Semestre::where('activo', true)->orderBy('numero')->get();

        return Inertia::render('modulos/edit', [
            'modulo' => $modulo,
            'semestres' => $semestres,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $modulo = Modulo::findOrFail($id);

        $validated = $request->validate([
            'semestre_id' => 'required|integer|exists:semestres,id',
            'codigo' => 'required|string|max:20|unique:modulos,codigo,' . $id,
            'nombre' => 'required|string|max:255',
            'creditos' => 'required|integer|min:1|max:10',
            'horas_semanales' => 'required|integer|min:1|max:20',
            'activo' => 'boolean',
        ]);

        // Asegurar que los valores sean convertidos a integers
        $validated['semestre_id'] = (int) $validated['semestre_id'];
        $validated['creditos'] = (int) $validated['creditos'];
        $validated['horas_semanales'] = (int) $validated['horas_semanales'];

        $modulo->update($validated);

        return redirect()->route('modulos.index')
            ->with('success', 'Módulo actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $modulo = Modulo::findOrFail($id);
        $modulo->delete();

        return redirect()->route('modulos.index')
            ->with('success', 'Módulo eliminado exitosamente');
    }
}
