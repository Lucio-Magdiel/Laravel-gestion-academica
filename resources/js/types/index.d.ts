import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash?: {
        success?: string;
        error?: string;
        message?: string;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name?: string;
    nombre?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    nombre_completo?: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    rol?: 'super_admin' | 'administracion' | 'docente' | 'estudiante';
    dni?: string;
    telefono?: string;
    direccion?: string;
    activo?: boolean;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Semestre {
    id: number;
    numero: number;
    nombre: string;
    ciclo: 'I' | 'II';
    activo: boolean;
}

export interface Modulo {
    id: number;
    codigo: string;
    nombre: string;
    creditos: number;
    horas_semanales: number;
    semestre_id: number;
    semestre?: Semestre;
    activo: boolean;
}

export interface Turno {
    id: number;
    nombre: string;
    hora_inicio: string;
    hora_fin: string;
    activo: boolean;
}

export interface Seccion {
    id: number;
    nombre: string;
    capacidad_maxima: number;
    activo: boolean;
}

export interface PeriodoAcademico {
    id: number;
    nombre: string;
    descripcion?: string;
    anio: number;
    semestre: number;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
    activo: boolean;
}

export interface AsignacionDocente {
    id: number;
    docente_id: number;
    modulo_id: number;
    seccion_id: number;
    turno_id: number;
    periodo_academico_id: number;
    docente?: User;
    modulo?: Modulo;
    seccion?: Seccion;
    turno?: Turno;
    periodoAcademico?: PeriodoAcademico;
}

export interface Matricula {
    id: number;
    codigo: string;
    estudiante_id: number;
    periodo_academico_id: number;
    semestre_id?: number;
    seccion_id: number;
    turno_id: number;
    estado: 'registrado' | 'confirmado' | 'anulado';
    fecha_registro: string;
    fecha_confirmacion?: string;
    observaciones?: string;
    created_at?: string;
    updated_at?: string;
    estudiante?: User;
    periodoAcademico?: PeriodoAcademico;
    semestre?: Semestre;
    seccion?: Seccion;
    turno?: Turno;
    detalles?: DetalleMatricula[];
}

export interface DetalleMatricula {
    id: number;
    matricula_id: number;
    asignacion_docente_id: number;
    asignacionDocente?: AsignacionDocente;
}
