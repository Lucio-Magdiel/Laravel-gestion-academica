<?php

namespace App\Http\Controllers;

use App\Models\AsignacionDocente;
use App\Models\DetalleMatricula;
use App\Models\Matricula;
use App\Models\Modulo;
use App\Models\PeriodoAcademico;
use App\Models\Seccion;
use App\Models\Semestre;
use App\Models\Turno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MatriculaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $matriculas = Matricula::with(['estudiante', 'periodoAcademico', 'seccion', 'turno'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Matriculas/Index', [
            'matriculas' => $matriculas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Verificar que haya un período académico activo
        $periodoActivo = PeriodoAcademico::where('activo', true)->first();

        $periodos = PeriodoAcademico::orderBy('anio', 'desc')->get();
        $semestres = Semestre::where('activo', true)->get();
        $secciones = Seccion::where('activo', true)->get();
        $turnos = Turno::where('activo', true)->get();

        return Inertia::render('matriculas/create', [
            'periodo_activo' => $periodoActivo,
            'periodos' => $periodos,
            'semestres' => $semestres,
            'secciones' => $secciones,
            'turnos' => $turnos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'semestre_id' => 'required|exists:semestres,id',
            'seccion_id' => 'required|exists:secciones,id',
            'turno_id' => 'required|exists:turnos,id',
            'periodo_academico_id' => 'required|exists:periodos_academicos,id',
        ]);

        /** @var \App\Models\Usuario $estudiante */
        $estudiante = auth()->user();

        if (!$estudiante) {
            abort(401);
        }

        // Verificar que no esté ya matriculado en este período
        $matriculaExistente = Matricula::where('estudiante_id', $estudiante->id)
            ->where('periodo_academico_id', $validated['periodo_academico_id'])
            ->first();

        if ($matriculaExistente) {
            return back()->with('error', 'Ya estás matriculado en este período académico');
        }

        DB::beginTransaction();
        try {
            // Generar código de matrícula
            $codigo = 'MAT-' . date('Y') . '-' . str_pad($estudiante->id, 6, '0', STR_PAD_LEFT);

            // Crear matrícula
            $matricula = Matricula::create([
                'codigo' => $codigo,
                'estudiante_id' => $estudiante->id,
                'periodo_academico_id' => $validated['periodo_academico_id'],
                'seccion_id' => $validated['seccion_id'],
                'turno_id' => $validated['turno_id'],
                'estado' => 'registrado', // Cambia a 'confirmado' después del pago
                'fecha_registro' => now(),
            ]);

            // Obtener módulos del semestre y crear detalles
            $modulos = Modulo::where('semestre_id', $validated['semestre_id'])->get();

            foreach ($modulos as $modulo) {
                // Buscar asignación docente para este módulo
                $asignacion = AsignacionDocente::where('modulo_id', $modulo->id)
                    ->where('periodo_academico_id', $validated['periodo_academico_id'])
                    ->where('seccion_id', $validated['seccion_id'])
                    ->where('turno_id', $validated['turno_id'])
                    ->first();

                if ($asignacion && $asignacion->cupos_disponibles > 0) {
                    DetalleMatricula::create([
                        'matricula_id' => $matricula->id,
                        'asignacion_docente_id' => $asignacion->id,
                        'estado' => 'registrado',
                    ]);

                    // Reducir cupos disponibles
                    $asignacion->decrement('cupos_disponibles');
                }
            }

            DB::commit();

            return redirect()->route('matriculas.show', $matricula)
                ->with('success', 'Matrícula registrada exitosamente. Proceda con el pago para confirmarla.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error al procesar la matrícula: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Matricula $matricula)
    {
        $matricula->load([
            'estudiante',
            'periodoAcademico',
            'seccion',
            'turno',
            'detalles.asignacionDocente.modulo',
            'detalles.asignacionDocente.docente',
        ]);

        return Inertia::render('Matriculas/Show', [
            'matricula' => $matricula,
        ]);
    }

    /**
     * Confirmar pago de matrícula
     */
    public function confirmarPago(Matricula $matricula)
    {
        $matricula->update([
            'estado' => 'confirmado',
            'fecha_confirmacion' => now(),
        ]);

        return back()->with('success', 'Pago confirmado. Matrícula activa.');
    }

    /**
     * Descargar constancia de matrícula en PDF
     */
    public function descargarConstancia(Matricula $matricula)
    {
        $matricula->load([
            'estudiante',
            'periodoAcademico',
            'seccion',
            'turno',
            'detalles.asignacionDocente.modulo',
            'detalles.asignacionDocente.docente',
        ]);

        // TODO: Implementar generación de PDF con DomPDF o similar
        // Por ahora retornamos vista
        return view('matriculas.constancia', compact('matricula'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Matricula $matricula)
    {
        // Solo permitir anular si está en estado 'registrado'
        if ($matricula->estado !== 'registrado') {
            return back()->with('error', 'No se puede anular una matrícula confirmada');
        }

        DB::beginTransaction();
        try {
            // Liberar cupos de las asignaciones
            foreach ($matricula->detalles as $detalle) {
                $detalle->asignacionDocente->increment('cupos_disponibles');
            }

            $matricula->delete();
            DB::commit();

            return redirect()->route('matriculas.index')
                ->with('success', 'Matrícula anulada exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Error al anular la matrícula');
        }
    }
}
