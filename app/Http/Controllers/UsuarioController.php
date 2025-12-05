<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    public function index(Request $request)
    {
        $rol = $request->query('rol');
        
        $query = Usuario::query();
        
        if ($rol) {
            $query->where('rol', $rol);
        }
        
        // Ordenar por rol (super_admin, administracion, docente, estudiante) y luego por nombre_completo
        $usuarios = $query
            ->orderByRaw("CASE 
                WHEN rol = 'super_admin' THEN 1 
                WHEN rol = 'administracion' THEN 2 
                WHEN rol = 'docente' THEN 3 
                WHEN rol = 'estudiante' THEN 4 
                ELSE 5 
            END")
            ->orderBy('nombre_completo')
            ->get();

        return Inertia::render('usuarios/index', [
            'usuarios' => $usuarios,
        ]);
    }

    public function create()
    {
        return Inertia::render('usuarios/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido_paterno' => 'nullable|string|max:255',
            'apellido_materno' => 'nullable|string|max:255',
            'dni' => 'required|string|max:15|unique:usuarios',
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string',
            'rol' => 'required|in:super_admin,administracion,docente,estudiante',
            'email' => 'required|email|unique:usuarios',
            'password' => 'required|string|min:8|confirmed',
            'activo' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['activo'] = $validated['activo'] ?? true;

        // Generar nombre completo
        $partes = array_filter([
            $validated['nombre'],
            $validated['apellido_paterno'] ?? '',
            $validated['apellido_materno'] ?? '',
        ]);
        $validated['nombre_completo'] = implode(' ', $partes);

        $usuario = Usuario::create($validated);

        \App\Services\BitacoraLogger::log(
            'Creación de Usuario',
            'Usuario creado por administrador: ' . $usuario->nombre_completo . ' (' . $usuario->rol . ')',
            'Usuario',
            $usuario->id,
            null,
            $usuario->toArray()
        );

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario creado exitosamente');
    }

    public function show(Usuario $usuario)
    {
        return Inertia::render('Usuarios/Show', [
            'usuario' => $usuario,
        ]);
    }

    public function edit(Usuario $usuario)
    {
        return Inertia::render('usuarios/edit', [
            'usuario' => $usuario,
        ]);
    }

    public function update(Request $request, Usuario $usuario)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido_paterno' => 'nullable|string|max:255',
            'apellido_materno' => 'nullable|string|max:255',
            'dni' => 'required|string|max:15|unique:usuarios,dni,' . $usuario->id,
            'telefono' => 'nullable|string|max:20',
            'direccion' => 'nullable|string',
            'rol' => 'required|in:super_admin,administracion,docente,estudiante',
            'email' => 'required|email|unique:usuarios,email,' . $usuario->id,
            'password' => 'nullable|string|min:8|confirmed',
            'activo' => 'boolean',
        ]);

        if (isset($validated['password']) && !empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Generar nombre completo
        $partes = array_filter([
            $validated['nombre'],
            $validated['apellido_paterno'] ?? '',
            $validated['apellido_materno'] ?? '',
        ]);
        $validated['nombre_completo'] = implode(' ', $partes);

        $usuario->update($validated);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario actualizado exitosamente');
    }

    public function destroy(Usuario $usuario)
    {
        // No permitir eliminar al usuario autenticado
        $currentUser = auth()->user();
        if ($currentUser && $usuario->id === $currentUser->id) {
            return back()->with('error', 'No puedes eliminar tu propio usuario');
        }

        $usuario->delete();

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario eliminado exitosamente');
    }
}
