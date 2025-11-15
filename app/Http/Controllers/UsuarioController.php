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
        
        $usuarios = $query->latest()->get();

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
            'name' => 'required|string|max:255',
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

        Usuario::create($validated);

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
            'name' => 'required|string|max:255',
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

        $usuario->update($validated);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario actualizado exitosamente');
    }

    public function destroy(Usuario $usuario)
    {
        // No permitir eliminar al usuario autenticado
        if ($usuario->id === auth()->id()) {
            return back()->with('error', 'No puedes eliminar tu propio usuario');
        }

        $usuario->delete();

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario eliminado exitosamente');
    }
}
