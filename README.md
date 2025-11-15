# Sistema de Gestión Académica

Sistema de gestión académica desarrollado con Laravel 11, Inertia.js y React para administrar matrículas, módulos, docentes y estudiantes.

## 🗄️ Base de Datos

**Proveedor:** Neon.tech (PostgreSQL Cloud)
- **Host:** `ep-lingering-rice-adehszt3.c-2.us-east-1.aws.neon.tech`
- **Database:** `neondb`
- **Usuario:** `neondb_owner`
- **Conexión:** SSL requerido con endpoint ID personalizado

## 📊 Estructura de Datos

### Usuarios
**Tabla:** `usuarios`
- Gestiona todos los usuarios del sistema
- **Roles disponibles:**
  - `super_admin` - Administrador general
  - `administracion` - Personal administrativo
  - `docente` - Profesores
  - `estudiante` - Alumnos
- **Campos clave:** `nombre_completo`, `dni`, `email`, `rol`, `telefono`, `direccion`

### Semestres
**Tabla:** `semestres`
- Define los semestres curriculares (1° a 6°)
- **Campos:** `numero` (único), `nombre`, `descripcion`, `orden`, `activo`

### Módulos
**Tabla:** `modulos`
- Asignaturas/cursos de cada semestre
- **Relación:** Pertenece a un `semestre`
- **Campos:** `nombre`, `codigo` (único), `descripcion`, `horas_semanales`, `activo`

### Turnos
**Tabla:** `turnos`
- Horarios de clases (mañana, tarde, noche)
- **Campos:** `nombre`, `hora_inicio`, `hora_fin`, `descripcion`, `activo`

### Secciones
**Tabla:** `secciones`
- Divisiones de grupos (A, B, C, etc.)
- **Campos:** `nombre` (único), `descripcion`, `activo`

### Períodos Académicos
**Tabla:** `periodos_academicos`
- Define ciclos escolares
- **Campos:** `nombre`, `anio`, `semestre`, `fecha_inicio`, `fecha_fin`, `estado`, `descripcion`
- **Constraint único:** Combinación `anio + semestre`
- **Estados:** `borrador`, `activo`, `cerrado`

### Asignación de Docentes
**Tabla:** `asignacion_docentes`
- Relaciona docentes con módulos específicos
- **Relaciones:**
  - `docente_id` → `usuarios` (rol docente)
  - `modulo_id` → `modulos`
  - `periodo_academico_id` → `periodos_academicos`
  - `seccion_id` → `secciones`
  - `turno_id` → `turnos`
- **Control de cupos:** `cupos_totales`, `cupos_disponibles`
- **Constraint único:** Docente + Módulo + Período + Sección + Turno

### Matrículas
**Tabla:** `matriculas`
- Inscripción de estudiantes por período
- **Relaciones:**
  - `estudiante_id` → `usuarios` (rol estudiante)
  - `periodo_academico_id` → `periodos_academicos`
  - `seccion_id` → `secciones`
  - `turno_id` → `turnos`
- **Campos:** `codigo` (único), `estado`, `fecha_registro`, `fecha_confirmacion`, `observaciones`
- **Constraint único:** Un estudiante por período académico
- **Estados:** `registrado`, `confirmado`, `anulado`

### Detalle de Matrículas
**Tabla:** `detalle_matriculas`
- Módulos inscritos por matrícula
- **Relaciones:**
  - `matricula_id` → `matriculas`
  - `asignacion_docente_id` → `asignacion_docentes`
- **Campos:** `estado`, `nota_final`, `observaciones`
- **Constraint único:** Matrícula + Asignación Docente

### Bitácora de Acciones
**Tabla:** `bitacora_acciones`
- Auditoría de cambios en el sistema
- **Relación:** `usuario_id` → `usuarios` (nullable)
- **Campos:** `accion`, `descripcion`, `entidad`, `entidad_id`, `datos_originales` (JSON), `datos_cambiados` (JSON), `ip`, `user_agent`

## 🔗 Relaciones Principales

```
semestres
    └── modulos
            └── asignacion_docentes ← docente (usuario)
                                   ← periodo_academico
                                   ← seccion
                                   ← turno
                    └── detalle_matriculas
                            └── matriculas ← estudiante (usuario)
                                         ← periodo_academico
                                         ← seccion
                                         ← turno
```

## ⚙️ Configuración Técnica

### Stack Tecnológico
- **Backend:** Laravel 11
- **Frontend:** React + Inertia.js
- **Base de Datos:** PostgreSQL (Neon.tech)
- **Autenticación:** Laravel Fortify (2FA incluido)
- **Build:** Vite

### Requisitos
- PHP 8.2+
- Node.js 18+
- Extensiones PHP: `pdo_pgsql`, `pgsql`
- Composer
- NPM

### Variables de Entorno Clave
```env
DB_CONNECTION=pgsql
DB_HOST=ep-lingering-rice-adehszt3.c-2.us-east-1.aws.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_Pi3U4OkygvoX
DB_SSLMODE=require
DB_ENDPOINT=ep-lingering-rice-adehszt3
```

### Connector Personalizado
El sistema usa `App\Database\NeonPostgresConnector` para manejar la conexión con Neon.tech, inyectando automáticamente el endpoint ID requerido por su infraestructura.

## 🚀 Comandos Útiles

```bash
# Migraciones
php artisan migrate              # Ejecutar migraciones
php artisan migrate:status       # Ver estado
php artisan migrate:rollback     # Revertir último batch
php artisan migrate:fresh        # Limpiar y recrear

# Seeders
php artisan db:seed              # Ejecutar todos los seeders
php artisan db:seed --class=SemestreSeeder

# Cache
php artisan config:clear         # Limpiar cache de configuración
php artisan cache:clear          # Limpiar cache de aplicación

# Desarrollo
npm run dev                      # Servidor Vite
php artisan serve                # Servidor Laravel
```

## 📝 Notas Importantes

1. **Migraciones duplicadas eliminadas:**
   - `2025_11_14_044235_create_periodo_academicos_table` (typo)
   - `2025_11_14_044558_create_bitacora_accions_table` (typo)

2. **PHP en uso:** Laragon PHP 8.3.16 (no XAMPP)
   - Ruta: `C:\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.ini`

3. **Conexión a BD:** No requiere servidor local (Laragon/XAMPP) para comandos `artisan`, solo para servir la web.

## 👥 Roles y Permisos

### Super Admin
- ✅ Control completo del sistema
- ✅ Gestionar usuarios (crear, editar, eliminar)
- ✅ Promover/degradar roles (docente ↔ administrador)
- ✅ Acceso a bitácora de acciones
- ✅ Configuración global del sistema
- 💡 **Recomendación:** Agregar gestión de períodos académicos (abrir/cerrar matrículas)

### Administración
- ✅ Crear y gestionar módulos/cursos
- ✅ Administrar estudiantes (registrar, editar, dar de baja)
- ✅ Administrar docentes (registrar, editar)
- ✅ Asignar docentes a módulos (por semestre, sección, turno)
- ✅ Ver estadísticas de matrículas
- ✅ Generar reportes (PDF/Excel)
- ✅ Acceso a bitácora de acciones
- 💡 **Recomendación:** Validar cupos disponibles antes de asignar
- 💡 **Recomendación:** Dashboard con métricas (estudiantes activos, módulos sin docente, cupos disponibles)

### Docentes
- ✅ Iniciar sesión
- ✅ Ver sus módulos asignados
- ✅ Ver lista de estudiantes por módulo
- 💡 **Recomendación:** Registrar asistencia
- 💡 **Recomendación:** Ingresar calificaciones (nota_final en detalle_matriculas)
- 💡 **Recomendación:** Descargar lista de estudiantes (PDF/Excel)
- 💡 **Recomendación:** Ver historial académico del estudiante

### Estudiantes
- ✅ Iniciar sesión
- ✅ Seleccionar semestre para matricularse
- ✅ Elegir sección (A o B) según cupos disponibles
- ✅ Ver módulos automáticos del semestre seleccionado
- ✅ Ver información: docente, horario, sección
- ✅ Confirmar pago de matrícula
- ✅ Descargar constancia de matrícula (PDF)
- 💡 **Recomendación:** Ver su horario semanal (grilla visual)
- 💡 **Futura mejora:** Historial de pagos

## 🎓 Información Académica

### Carrera: Computación e Informática
- **Duración:** 3 años (6 semestres)
- **Módulos por semestre:** 6 (algunos semestres pueden tener más, sujeto a ajustes)
- **Turno único:** Mañana (7:50 AM - 1:00 PM)
- **Secciones:** A (25 estudiantes), B (resto)
- **Identificación única:** DNI del estudiante
- **Ciclos académicos:**
  - **Primer ciclo:** Semestres 1, 3, 5
  - **Segundo ciclo:** Semestres 2, 4, 6
  - **Examen anual:** Una vez al año

### Plan de Estudios

#### Semestre 1
1. Procesador de textos
2. TIC
3. Arquitectura de plataformas y soporte técnico
4. Hoja de cálculo
5. Plataformas de productividad
6. Diagnóstico y solución de incidentes

#### Semestre 2
1. Modelado de procesos de negocio
2. Comunicación efectiva
3. Mantenimiento y configuración de equipos informáticos
4. Administración de sistemas operativos
5. Administración de centros de cómputo
6. Tutoría
7. Trabajo colaborativo *(nota: 7 módulos)*
8. Redes y teleproceso *(nota: 8 módulos)*

#### Semestre 3
1. Ensamblaje y reparación de computadoras
2. Modelamiento de sistemas
3. Administración y gestión de redes y servidores
4. Inglés para la comunicación oral
5. Pruebas de rendimiento de redes
6. Auditoría en computación e informática

#### Semestre 4
1. Análisis y diseño de sistemas
2. Base de datos
3. Emprendimiento
4. Tutoría
5. Fundamentos de programación
6. Seguridad informática
7. Lenguaje de programación *(nota: 7 módulos)*
8. Cultura ambiental *(nota: 8 módulos)*

#### Semestre 5
1. Programación orientada a objetos
2. Programación distribuida
3. Diseño web
4. Solución de problemas
5. Administración de base de datos
6. Diseño y animación de gráficos
7. Investigación *(nota: 7 módulos)*

#### Semestre 6
1. Fundamentos de internet de las cosas
2. Comportamiento ético
3. Gestión de proyectos de tecnología de información
4. Desarrollo de aplicaciones móviles
5. Taller de programación web

> **⚠️ Importante:** Semestres 2, 4 y 5 tienen más de 6 módulos. Recomiendo ajustar a 6 o configurar como módulos opcionales/electivos.

## 📄 Reportes del Sistema

### Constancia de Matrícula (PDF/Excel)
**Contenido:**
- Nombre completo del estudiante
- DNI
- Semestre cursado
- Sección asignada
- Período académico
- Turno y horario
- Lista de módulos matriculados con:
  - Nombre del módulo
  - Código
  - Docente asignado
  - Horario específico (si aplica)

### Reportes Administrativos
- 💡 **Recomendación:** Listado de estudiantes por módulo (para docentes)
- 💡 **Recomendación:** Estadísticas de matrícula por semestre
- 💡 **Recomendación:** Módulos sin docente asignado
- 💡 **Recomendación:** Reporte de cupos disponibles

## 🔄 Flujo de Matrícula

### Proceso del Estudiante
1. **Registro/Login** → Validar con DNI único
2. **Validar período activo** → Solo permitir matrícula si el período está abierto
3. **Selección de semestre** → Elegir del 1° al 6°
4. **Selección de sección** → Elegir A o B (cupos disponibles)
5. **Vista previa de módulos** → Se muestran automáticamente los módulos del semestre
6. **Información desplegada:**
   - Nombre del módulo
   - Docente asignado
   - Sección elegida (A o B)
   - Turno: Mañana (7:50 AM - 1:00 PM)
   - Cupos disponibles
7. **Método de pago** → Confirmación de pago para validar matrícula
8. **Confirmación de matrícula** → Generar registro en BD con estado "confirmado"
9. **Descarga de constancia** → PDF con toda la información

### Validaciones Clave
- ✅ DNI único (no permitir duplicados)
- ✅ Un estudiante solo puede matricularse una vez por período académico
- ✅ Validar que el período académico esté "activo" para matrículas
- ✅ Validar cupos disponibles en la sección elegida
- ✅ Confirmar pago antes de finalizar matrícula
- 💡 **Futura mejora:** Asignación automática por ranking (Top 25 → Sección A, resto → Sección B)

## 🔐 Seguridad y Auditoría

### Bitácora de Acciones
**Acceso:** Super Admin y Administración

**Eventos registrados:**
- Creación/edición/eliminación de usuarios
- Asignación de docentes a módulos
- Matrículas de estudiantes
- Cambios de roles
- Modificaciones en módulos/cursos
- Anulación de matrículas

**Información capturada:**
- Usuario que realizó la acción
- Timestamp
- Tipo de acción
- Entidad afectada
- Datos antes/después (JSON)
- IP y navegador

## 💡 Recomendaciones Adicionales

### Funcionalidades Sugeridas (Prioridad)
1. **Sistema de pagos:**
   - Integración con pasarelas de pago (Niubiz, Culqi, PayPal)
   - Registro de comprobantes de pago
   - Estados: Pendiente → Pagado → Confirmado
   - Validar matrícula solo si hay pago confirmado

2. **Gestión de períodos académicos:**
   - Crear períodos (ej: "2025-I", "2025-II")
   - Estados: Borrador → Activo (matrículas abiertas) → Cerrado
   - Solo permitir matrículas en período activo
   - Fechas de inicio/fin de matrícula

3. **Dashboard visual:**
   - Gráficos de estadísticas
   - Alertas (módulos sin docente, cupos llenos)
   - Accesos rápidos por rol

4. **Asignación de secciones:**
   - Manual: Estudiante elige su sección
   - Automática (futura): Por ranking académico

### Funcionalidades Futuras
- Sistema de calificaciones (docentes ingresan notas)
- Historial académico del estudiante
- Notificaciones por email
- Reportes de rendimiento académico
- Ranking de estudiantes

### Consideraciones Técnicas
- **Backup automático:** Configurar respaldos periódicos en Neon
- **Logs de errores:** Monitorear fallos de conexión
- **Performance:** Indexar columnas frecuentes (dni, email, codigo)
- **Exportación masiva:** Botón para exportar todas las matrículas del período

## 📚 Próximos Pasos (MVP - Producto Mínimo Viable)

### Fase 1: Core del Sistema (Esencial)
- [ ] Seeders con plan de estudios completo
- [ ] CRUD de usuarios por rol
- [ ] Gestión de períodos académicos (abrir/cerrar matrículas)
- [ ] Asignación de docentes a módulos
- [ ] Flujo de matrícula de estudiantes
- [ ] Sistema de pagos básico
- [ ] Generación de constancia de matrícula (PDF)

### Fase 2: Administración
- [ ] Dashboard por rol con métricas
- [ ] Reportes Excel/PDF (listados, estadísticas)
- [ ] Bitácora de acciones
- [ ] Gestión de cupos por sección

### Fase 3: Mejoras Futuras
- [ ] Sistema de calificaciones
- [ ] Ranking de estudiantes
- [ ] Asignación automática de secciones
- [ ] Notificaciones por email
- [ ] Historial de pagos detallado

---

**Desarrollado con ❤️ para gestión académica eficiente**
