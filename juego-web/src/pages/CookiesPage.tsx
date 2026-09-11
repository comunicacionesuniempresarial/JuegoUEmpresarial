import { Link } from 'react-router-dom';

export function CookiesPage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-2xl">
              🍪
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Política de Cookies
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              ¿Dónde Está Stuttgart? — Uniempresarial
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">¿Qué son las cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo para recordar información sobre tu visita.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">¿Usa este juego cookies?</h2>
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                <p className="text-emerald-800 font-semibold">
                  ✅ No utilizamos cookies de rastreo, analytics ni publicitarias.
                </p>
                <p className="mt-2 text-emerald-700 text-xs">
                  El juego <strong>¿Dónde Está Stuttgart?</strong> no instala cookies propias en tu dispositivo.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">Cookies de sesión (Supabase)</h2>
              <p>
                El panel de administración utiliza <strong>Supabase Authentication</strong>, que emplea cookies de sesión técnicas para:
              </p>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-600">
                <li>Mantener la sesión del administrador iniciada</li>
                <li>Verificar la identidad del usuario autenticado</li>
                <li>Proteger el acceso al panel de administración</li>
              </ul>
              <p className="mt-2">
                Estas cookies son <strong>estrictamente necesarias</strong> para el funcionamiento del sistema y no se pueden desactivar. No recopilan información con fines publicitarios.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">Cookies de Vercel</h2>
              <p>
                El sitio está alojado en <strong>Vercel</strong>. Vercel puede usar cookies técnicas para:
              </p>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-600">
                <li>Entregar el sitio de forma eficiente (CDN)</li>
                <li>Proteger contra ataques DDoS</li>
                <li>Generar estadísticas anónimas de uso (si están habilitadas)</li>
              </ul>
              <p className="mt-2 text-xs text-gray-500">
                Consulta la política de cookies de Vercel en{' '}
                <a href="https://vercel.com/legal/cookies-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  vercel.com/legal/cookies-policy
                </a>
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">Gestionar cookies en tu navegador</h2>
              <p>Puedes configurar tu navegador para bloquear o eliminar cookies:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-600">
                <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                <li><strong>Firefox:</strong> Configuración → Privacidad y seguridad → Cookies y datos del sitio</li>
                <li><strong>Safari:</strong> Preferencias → Privacidad → Administrar cookies</li>
                <li><strong>Edge:</strong> Configuración → Privacidad → Cookies</li>
              </ul>
              <p className="mt-2 text-xs text-gray-500">
                Nota: bloquear las cookies de sesión puede afectar el funcionamiento del panel de administración.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
