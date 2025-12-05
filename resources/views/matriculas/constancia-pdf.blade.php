<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Constancia de Matrícula - {{ $matricula->codigo }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            background: #f5f5f5;
        }
        
        .constancia {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
        }
        
        .header h1 {
            color: #2563eb;
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .header h2 {
            color: #64748b;
            font-size: 18px;
            font-weight: normal;
        }
        
        .titulo {
            text-align: center;
            font-size: 24px;
            color: #1e293b;
            margin: 30px 0;
            font-weight: bold;
        }
        
        .contenido {
            line-height: 1.8;
            color: #334155;
            font-size: 14px;
            text-align: justify;
        }
        
        .datos {
            margin: 30px 0;
            background: #f8fafc;
            padding: 20px;
            border-left: 4px solid #2563eb;
        }
        
        .datos-row {
            display: flex;
            margin-bottom: 12px;
        }
        
        .datos-label {
            font-weight: bold;
            min-width: 180px;
            color: #475569;
        }
        
        .datos-value {
            color: #1e293b;
        }
        
        .cursos-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        
        .cursos-table th {
            background: #2563eb;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        
        .cursos-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .cursos-table tr:nth-child(even) {
            background: #f8fafc;
        }
        
        .footer {
            margin-top: 60px;
            text-align: center;
            color: #64748b;
            font-size: 12px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
        }
        
        .firma {
            margin-top: 80px;
            text-align: center;
        }
        
        .firma-linea {
            width: 300px;
            border-top: 2px solid #1e293b;
            margin: 0 auto 10px;
        }
        
        .firma-texto {
            color: #475569;
            font-size: 14px;
        }
        
        .sello {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            border: 2px solid #2563eb;
            border-radius: 50%;
            color: #2563eb;
            font-weight: bold;
            transform: rotate(-15deg);
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .constancia {
                box-shadow: none;
                padding: 40px;
            }
        }
    </style>
</head>
<body>
    <div class="constancia">
        <div class="header">
            <img src="{{ asset('images/logo.png') }}" alt="Logo" style="height: 80px; margin-bottom: 10px;">
            <h1>Gestion Academica</h1>
            <h2>Instituto de Educación Superior Tecnológico Público "DIVINO JESÚS"</h2>
        </div>
        
        <div class="titulo">CONSTANCIA DE MATRÍCULA</div>
        
        <div class="contenido">
            <p style="margin-bottom: 20px;">
                La Dirección del <strong>Gestion Academica</strong>, certifica que:
            </p>
        </div>
        
        <div class="datos">
            <div class="datos-row">
                <div class="datos-label">Estudiante:</div>
                <div class="datos-value">{{ $matricula->estudiante->nombre_completo }}</div>
            </div>
            <div class="datos-row">
                <div class="datos-label">DNI:</div>
                <div class="datos-value">{{ $matricula->estudiante->dni }}</div>
            </div>
            <div class="datos-row">
                <div class="datos-label">Código de Matrícula:</div>
                <div class="datos-value">{{ $matricula->codigo }}</div>
            </div>
            <div class="datos-row">
                <div class="datos-label">Período Académico:</div>
                <div class="datos-value">{{ $matricula->periodoAcademico->nombre ?? 'N/A' }}</div>
            </div>
            <div class="datos-row">
                <div class="datos-label">Semestre:</div>
                <div class="datos-value">{{ $matricula->semestre->nombre ?? 'N/A' }}</div>
            </div>
            <div class="datos-row">
                <div class="datos-label">Sección:</div>
                <div class="datos-value">{{ $matricula->seccion->nombre }}</div>
            </div>
            <div class="datos-row">
                <div class="datos-label">Turno:</div>
                <div class="datos-value">{{ $matricula->turno->nombre }}</div>
            </div>
            <div class="datos-row">
                <div class="datos-label">Fecha de Matrícula:</div>
                <div class="datos-value">{{ $matricula->fecha_registro->format('d/m/Y') }}</div>
            </div>
            <div class="datos-row">
                <div class="datos-label">Estado:</div>
                <div class="datos-value">
                    <strong style="color: #16a34a;">{{ $matricula->estado === 'confirmado' ? 'ACTIVA' : strtoupper($matricula->estado) }}</strong>
                </div>
            </div>
        </div>
        
        @if($matricula->detalles && count($matricula->detalles) > 0)
        <div class="contenido">
            <p style="margin: 20px 0;"><strong>Se encuentra matriculado(a) en los siguientes módulos:</strong></p>
        </div>
        
        <table class="cursos-table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Módulo</th>
                    <th>Créditos</th>
                    <th>Horas</th>
                    <th>Docente</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $totalCreditos = 0;
                    $totalHoras = 0;
                @endphp
                @foreach($matricula->detalles as $detalle)
                    @if($detalle->asignacionDocente && $detalle->asignacionDocente->modulo)
                        @php
                            $modulo = $detalle->asignacionDocente->modulo;
                            $totalCreditos += $modulo->creditos ?? 0;
                            $totalHoras += $modulo->horas_semanales ?? 0;
                        @endphp
                        <tr>
                            <td>{{ $modulo->codigo }}</td>
                            <td>{{ $modulo->nombre }}</td>
                            <td style="text-align: center;">{{ $modulo->creditos }}</td>
                            <td style="text-align: center;">{{ $modulo->horas_semanales }}</td>
                            <td>{{ $detalle->asignacionDocente->docente->nombre_completo ?? 'Por asignar' }}</td>
                        </tr>
                    @endif
                @endforeach
                <tr style="background: #e0f2fe; font-weight: bold;">
                    <td colspan="2" style="text-align: right;">TOTAL:</td>
                    <td style="text-align: center;">{{ $totalCreditos }}</td>
                    <td style="text-align: center;">{{ $totalHoras }}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        @endif
        
        <div class="contenido">
            <p style="margin-top: 30px;">
                Se expide la presente constancia a solicitud del interesado para los fines que estime conveniente.
            </p>
        </div>
        
        <div class="footer">
            <p>Fecha de emisión: {{ now()->format('d/m/Y H:i') }}</p>
            <p style="margin-top: 5px;">Este documento es válido con sello y firma de la dirección académica</p>
        </div>
        
        <div class="firma">
            <div class="sello">VÁLIDO</div>
            <div style="margin-top: 40px;">
                <div class="firma-linea"></div>
                <div class="firma-texto">Dirección Académica</div>
                <div class="firma-texto" style="font-weight: bold;">Gestion Academica</div>
            </div>
        </div>
    </div>
    
    <script>
        // Auto-imprimir al cargar
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>
