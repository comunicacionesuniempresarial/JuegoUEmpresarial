# Documento de Especificación de Requerimientos de Software (ERS)

**Proyecto:** "¿Dónde Está Sttutgart?"  
**Versión:** 1.0  
**Fecha:** 4 de Septiembre, 2026  
**Metodología:** Agile Scrum + DevOps CI/CD  
**Estado:** Planificación

---

## 1. INTRODUCCIÓN

### 1.1 Propósito

Este documento define los requerimientos de software para el juego web interactivo "¿Dónde Está Sttutgart?", desarrollado para la Universidad Uniempresarial. El sistema consta de dos minijuegos y un panel administrativo, desplegado en Vercel con backend en Supabase.

### 1.2 Alcance

| Componente | Descripción |
|------------|-------------|
| **Juego 1** | Ruleta de premios con animación CSS |
| **Juego 2** | Búsqueda de Stuttgart entre imágenes de carreras |
| **Panel Admin** | Dashboard para visualizar registros |
| **Backend** | Supabase (Auth + Database + RLS) |

### 1.3 Definiciones

| Término | Definición |
|---------|------------|
| **Studgard** | Mascota de la universidad (perro) |
| **RLS** | Row Level Security (Supabase) |
| **LGPD** | Ley General de Protección de Datos |
| **CI/CD** | Continuous Integration / Continuous Deployment |

---

## 2. DESCRIPCIÓN GENERAL

### 2.1 Perspectiva del Producto

```
┌─────────────────────────────────────────────────────────┐
│                    SISTEMA COMPLETO                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│   │   LANDING   │  │   RULETA    │  │  BÚSQUEDA   │   │
│   │   PAGE      │  │   GAME      │  │  GAME       │   │
│   └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │              PANEL ADMIN (Protegido)            │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                      SUPABASE                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Auth       │  │  Database   │  │  RLS        │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Funciones del Producto

| Función | Prioridad | Complejidad |
|---------|-----------|-------------|
| Landing page con split-screen | P0 | Baja |
| Juego de ruleta | P0 | Media |
| Juego de búsqueda | P0 | Media |
| Formulario de registro | P0 | Baja |
| Studgard companion | P1 | Baja |
| Panel administrativo | P0 | Media |
| Sistema de autenticación | P0 | Baja |
| Audit logging | P1 | Baja |
| Exportación CSV/PDF | P2 | Media |

### 2.3 Características de los Usuarios

| Rol | Permisos | Cantidad |
|-----|----------|----------|
| **Jugador** | Jugar, registrarse | Ilimitado |
| **Admin** | Ver registros, exportar, audit | 2-5 |

---

## 3. REQUERIMIENTOS FUNCIONALES

### 3.1 RF-01: Landing Page

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-01.1 | Hero split-screen vertical 50/50 | P0 |
| RF-01.2 | Logo Uniempresarial en header y footer | P0 |
| RF-01.3 | Fondo blanco en header/footer (brand manual) | P0 |
| RF-01.4 | Studgard thumbs-up en mitad izquierda | P0 |
| RF-01.5 | Studgard confundido en mitad derecha | P0 |
| RF-01.6 | Botón "JUGAR" en cada mitad | P0 |
| RF-01.7 | Click izquierda redirige a `/ruleta` | P0 |
| RF-01.8 | Click derecha redirige a `/busqueda` | P0 |
| RF-01.9 | Icono admin opacity 0.3 en nav | P2 |
| RF-01.10 | Gradientes: azul→púrpura (izq), rojo→amarillo (der) | P1 |

### 3.2 RF-02: Juego Ruleta

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-02.1 | Ruleta centrada, 70-80% viewport | P0 |
| RF-02.2 | Animación CSS GPU (rotate 360°+, 3s) | P0 |
| RF-02.3 | Botón "¡GIRAR!!" rojo | P0 |
| RF-02.4 | Botón deshabilitado durante animación | P0 |
| RF-02.5 | Popup con premio ganado | P0 |
| RF-02.6 | Studgard companion "¡Gira la ruleta!" | P1 |
| RF-02.7 | Studgard "¡Suerte!" durante giro | P1 |
| RF-02.8 | Studgard "¡Ganaste!" en resultado | P1 |

### 3.3 RF-03: Juego Búsqueda

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-03.1 | 7 imágenes de carreras | P0 |
| RF-03.2 | Stuttgart random en cada carga | P0 |
| RF-03.3 | Imagen ocupa 80% viewport | P0 |
| RF-03.4 | Cronómetro inicia al cargar | P0 |
| RF-03.5 | Cronómetro visible (mm:ss) | P0 |
| RF-03.6 | Botón "¡LO ENCONTRÉ!!" rojo | P0 |
| RF-03.7 | Botón detiene cronómetro | P0 |
| RF-03.8 | Popup con tiempo transcurrido | P0 |
| RF-03.9 | Studgard "¡Busca a Stuttgart!" | P1 |
| RF-03.10 | Studgard "¡Rápido, el tiempo corre!" | P1 |
| RF-03.11 | Studgard "¡Lo encontraste!" en resultado | P1 |

### 3.4 RF-04: Formulario Registro

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-04.1 | Modal con blur(10px) fondo | P0 |
| RF-04.2 | Campo nombre (mínimo 2 caracteres) | P0 |
| RF-04.3 | Campo teléfono (regex Colombia) | P0 |
| RF-04.4 | Checkbox consentimiento obligatorio | P0 |
| RF-04.5 | Botón REGISTRAR deshabilitado sin check | P0 |
| RF-04.6 | Toast "¡Registrado!" post-submit | P0 |
| RF-04.7 | Enviar datos a Supabase (INSERT) | P0 |
| RF-04.8 | Studgard "¡Registra tus datos!" | P1 |

### 3.5 RF-05: Studgard Companion

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-05.1 | Tamaño responsive (80/60/40px) | P1 |
| RF-05.2 | Speech bubbles con instrucciones | P1 |
| RF-05.3 | Auto-ocultar después de 5 segundos | P1 |
| RF-05.4 | 3 poses: open, pointing, thumbs-up | P1 |
| RF-05.5 | Posición esquina inferior | P1 |
| RF-05.6 | No invasivo (no tapa contenido) | P1 |

### 3.6 RF-06: Panel Administrativo

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-06.1 | Login con Email/Password | P0 |
| RF-06.2 | Dashboard con estadísticas | P0 |
| RF-06.3 | Tabla de registros | P0 |
| RF-06.4 | Búsqueda de registros | P0 |
| RF-06.5 | Filtrado por juego | P1 |
| RF-06.6 | Paginación | P1 |
| RF-06.7 | Exportar CSV | P0 |
| RF-06.8 | Exportar PDF (jsPDF) | P2 |
| RF-06.9 | Audit log visible | P1 |
| RF-06.10 | Sesión timeout 30min | P1 |

### 3.7 RF-07: Legal/LGPD

| ID | Requerimiento | Prioridad |
|----|---------------|-----------|
| RF-07.1 | Página Políticas de Privacidad | P0 |
| RF-07.2 | Página Consentimiento de Datos | P0 |
| RF-07.3 | Derecho de supresión (solicitar borrado) | P0 |
| RF-07.4 | Retención de datos 90 días | P1 |

---

## 4. REQUERIMIENTOS NO FUNCIONALES

### 4.1 RNF-01: Performance

| ID | Requerimiento | Target | Medición |
|----|---------------|--------|----------|
| RNF-01.1 | First Contentful Paint | <1.5s | Lighthouse |
| RNF-01.2 | Largest Contentful Paint | <2.5s | Lighthouse |
| RNF-01.3 | Time to Interactive | <3s | Lighthouse |
| RNF-01.4 | Cumulative Layout Shift | <0.1 | Lighthouse |
| RNF-01.5 | Total Bundle Size | <200KB gzip | Vite build |
| RNF-01.6 | Lighthouse Score | >90 | Lighthouse |

### 4.2 RNF-02: Seguridad

| ID | Requerimiento | Implementación |
|----|---------------|----------------|
| RNF-02.1 | Autenticación JWT | Supabase Auth |
| RNF-02.2 | Row Level Security | Supabase RLS |
| RNF-02.3 | Audit logging | Tabla audit_log |
| RNF-02.4 | HTTPS obligatorio | Vercel automático |
| RNF-02.5 | Input validation | Zod schema |
| RNF-02.6 | Rate limiting | Supabase built-in |

### 4.3 RNF-03: Disponibilidad

| ID | Requerimiento | Target |
|----|---------------|--------|
| RNF-03.1 | Uptime | >99.9% |
| RNF-03.2 | Tiempo respuesta API | <500ms |
| RNF-03.3 | Recuperación errores | Graceful degradation |

### 4.4 RNF-04: Escalabilidad

| ID | Requerimiento | Target |
|----|---------------|--------|
| RNF-04.1 | Usuarios concurrentes | 1000+ |
| RNF-04.2 | Registros en DB | 50,000+ |
| RNF-04.3 | Escalado automático | Supabase/Vercel |

### 4.5 RNF-05: Mantenibilidad

| ID | Requerimiento | Implementación |
|----|---------------|----------------|
| RNF-05.1 | Código modular | Componentes React |
| RNF-05.2 | Documentación | JSDoc + README |
| RNF-05.3 | Testing | Unit + Integration |

### 4.6 RNF-06: Usabilidad

| ID | Requerimiento | Implementación |
|----|---------------|----------------|
| RNF-06.1 | Responsive design | Mobile-first |
| RNF-06.2 | Accesibilidad | ARIA labels, alt tags |
| RNF-06.3 | Loading states | Skeleton loaders |
| RNF-06.4 | Error handling | Toast notifications |

---

## 5. INTERFACES EXTERNAS

### 5.1 Interfaces de Usuario

| Componente | Tecnología | Descripción |
|------------|------------|-------------|
| Landing Page | React + CSS | Hero split-screen |
| Ruleta | CSS Animations | Giro GPU-acelerado |
| Búsqueda | React + Hooks | Cronómetro + random |
| Modals | React Portal | Formularios |
| Admin | React + Table | Dashboard |

### 5.2 Interfaces de Software

| Componente | API | Descripción |
|------------|-----|-------------|
| Auth | Supabase Auth | Login/Logout/JWT |
| Database | Supabase REST | CRUD registros |
| Audit | Supabase | Logging acciones |

### 5.3 Interfaces de Comunicación

| Protocolo | Uso | Puerto |
|-----------|-----|--------|
| HTTPS | Todas las comunicaciones | 443 |
| WSS | Supabase Realtime (opcional) | 443 |

---

## 6. REQUERIMIENTOS DE DATOS

### 6.1 Estructura de Datos

```sql
-- Registros de juegos
CREATE TABLE records (
  id UUID PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  juego TEXT NOT NULL,
  resultado TEXT,
  created_at TIMESTAMPTZ
);

-- Administradores
CREATE TABLE admins (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ
);

-- Audit log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ
);
```

### 6.2 Reglas de Negocio

| Regla | Validación |
|-------|------------|
| Nombre | Mínimo 2 caracteres |
| Teléfono | Regex Colombia: `^\+57[3][0-9]{9}$` |
| Juego | Solo 'ruleta' o 'busqueda' |
| Consentimiento | Obligatorio antes de INSERT |

---

## 7. REQUERIMIENTOS DE SEGURIDAD

### 7.1 Autenticación

| Control | Implementación |
|---------|----------------|
| Método | Email/Password |
| Token | JWT (Supabase) |
| Expiración | 30 minutos |
| Reset password | Email link |

### 7.2 Autorización

| Rol | Acciones permitidas |
|-----|---------------------|
| **Público** | INSERT en records |
| **Admin** | SELECT, EXPORT en records + audit_log |

### 7.3 Cifrado

| Capa | Implementación |
|------|----------------|
| Tránsito | HTTPS (TLS 1.3) |
| Reposo | Supabase encryption |

### 7.4 Cumplimiento

| Norma | Estado | Detalle |
|-------|--------|---------|
| LGPD | ✅ | Consentimiento + derecho supresión |
| ISO 27001 | ⚠️ Parcial | RLS + Auth + Audit |

---

## 8. DEVOPS & CI/CD

### 8.1 Pipeline

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  PUSH   │───▶│  BUILD  │───▶│  TEST   │───▶│ DEPLOY  │
│  (Git)  │    │ (Vite)  │    │ (Vitest)│    │ (Vercel)│
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### 8.2 Ambientes

| Ambiente | URL | Propósito |
|----------|-----|-----------|
| **Development** | localhost:5173 | Desarrollo local |
| **Preview** | *.vercel.app | PRs/Pull Requests |
| **Production** | juego.uniempresarial.edu.co | Producción |

### 8.3 Estrategia de Deploy

```
1. Developer push a feature branch
2. Vercel crea Preview automática
3. QA verifica en Preview
4. Merge a main
5. Deploy automático a Production
```

### 8.4 Monitoreo

| Herramienta | Uso |
|-------------|-----|
| Vercel Analytics | Performance, uptime |
| Supabase Dashboard | Database, auth, errors |
| Sentry (opcional) | Error tracking |

---

## 9. METODOLOGÍA ÁGIL

### 9.1 Framework: Scrum

| Elemento | Implementación |
|----------|----------------|
| **Sprint** | 1 semana |
| **Daily** | 15 min diarios |
| **Planning** | Lunes inicio de sprint |
| **Review** | Viernes fin de sprint |
| **Retrospective** | Después de review |

### 9.2 Backlog

| Épica | Historias | Story Points |
|-------|-----------|--------------|
| Landing Page | 5 | 8 |
| Ruleta | 6 | 13 |
| Búsqueda | 7 | 13 |
| Formulario | 5 | 8 |
| Admin Panel | 8 | 21 |
| Seguridad | 4 | 8 |
| Legal/LGPD | 3 | 5 |
| **TOTAL** | **38** | **76** |

### 9.3 Definition of Done (DoD)

| Criterio | Checklist |
|----------|-----------|
| ✅ Código implementado | Feature completa |
| ✅ Tests pasando | Unit + Integration |
| ✅ Code review | Aprobado por peer |
| ✅ Sin bugs conocidos | P0/P1 resueltos |
| ✅ Documentada | JSDoc actualizado |
| ✅ Responsive | Mobile-first OK |
| ✅ Accesible | ARIA labels |
| ✅ Deployed | Preview verificada |

---

## 10. ACCEPTANCE CRITERIA (RESUMEN)

| Feature | ACs | Estado |
|---------|-----|--------|
| Landing | AC-01 a AC-07 | ⬜ |
| Ruleta | AC-08 a AC-13 | ⬜ |
| Búsqueda | AC-14 a AC-19 | ⬜ |
| Formulario | AC-20 a AC-28 | ⬜ |
| Companion | AC-29 a AC-34 | ⬜ |
| Legal | AC-35 a AC-37 | ⬜ |
| Admin | AC-38 a AC-47 | ⬜ |

---

## 11. APÉNDICES

### A. Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| CSS | Tailwind + Animations |
| Backend | Supabase |
| Auth | Supabase Auth |
| Database | PostgreSQL (Supabase) |
| Hosting | Vercel |
| Testing | Vitest + React Testing Library |

### B. Assets

| Asset | Ruta |
|-------|------|
| Logo Uniempresarial | `images/LOGO Uniempresarial/logo-header.png` |
| Studgard thumbs-up | `images/studgard-thumbs-up.png` |
| Studgard pointing | `images/studgard-pointing.png` |
| Studgard open | `images/studgard-open.png` |
| Stuttgart Ruleta | `images/Stuttgard girando ruleta/Stuttgart Ruleta.jpg` |
| Stuttgart confundido | `images/Stuttgard perdido...jpg` |
| 7 imágenes carreras | `Dónde Está Sttutgart/*.png` |

---

## 12. APROBACIÓN

| Rol | Nombre | Fecha | Estado |
|-----|--------|-------|--------|
| Product Owner | [ Pendiente ] | - | ⬜ |
| Tech Lead | [ Pendiente ] | - | ⬜ |
| Stakeholder | Uniempresarial | - | ⬜ |

---

**Documento ERS v1.0 — Listo para revisión.**
