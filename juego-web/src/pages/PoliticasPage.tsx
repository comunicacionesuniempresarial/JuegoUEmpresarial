import { Link } from 'react-router-dom';

const PRIVACY_PDF_URL =
  'https://uniempresarial.edu.co/wp-content/uploads/2026/08/Tratamiento-de-Datos-Personales.pdf';
const TERMS_URL = 'https://uniempresarial.edu.co/terminos-y-condiciones';
const PQRS_URL = 'https://uniempresarial.edu.co';

export function PoliticasPage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
              🔒
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Política de Privacidad
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              ¿Dónde Está Stuttgart? — Uniempresarial
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">1. Datos que recolectamos</h2>
              <p>
                Al participar en el juego <strong>¿Dónde Está Stuttgart?</strong>, recolectamos los siguientes datos personales:
              </p>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-600">
                <li><strong>Nombre completo</strong> — identificación del participante</li>
                <li><strong>Número de teléfono</strong> — en formato +57 (Colombia)</li>
                <li><strong>Correo electrónico</strong> — (opcional)</li>
                <li><strong>Carrera o programa académico</strong> — (opcional)</li>
                <li><strong>Juego participado</strong> — Ruleta o Búsqueda</li>
                <li><strong>Resultado</strong> — premio ganado o tiempo registrado</li>
                <li><strong>Consentimiento</strong> — registro de aceptación de tratamiento de datos</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">2. Para qué usamos tus datos</h2>
              <p>Los datos se utilizan exclusivamente para:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-600">
                <li>Registrar tu participación en el juego</li>
                <li>Controlar la entrega de premios (obsequios)</li>
                <li>Generar estadísticas de participación para Uniempresarial</li>
                <li>Cumplir con obligaciones legales de tratamiento de datos</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">3. Almacenamiento y seguridad</h2>
              <p>
                Los datos se almacenan en <strong>Supabase</strong>, un servicio de base de datos en la nube con cifrado en tránsito (TLS) y en reposo. El acceso está restringido únicamente a administradores autorizados de Uniempresarial.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">4. Tus derechos</h2>
              <p>
                De acuerdo con la <strong>Ley 1581 de 2012</strong> y el <strong>Decreto 1377 de 2013</strong> (Colombia), tienes derecho a:
              </p>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-600">
                <li><strong>Conocer</strong> qué datos tenemos sobre ti</li>
                <li><strong>Actualizar</strong> o corregir tus datos</li>
                <li><strong>Solicitar la supresión</strong> de tus datos personales</li>
                <li><strong>Revocar</strong> el consentimiento dado</li>
                <li><strong>Presentar quejas</strong> ante la Superintendencia de Industria y Comercio (SIC)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">5. Documentos oficiales</h2>
              <p>Para más detalles, consulta los documentos oficiales de Uniempresarial:</p>
              <div className="mt-3 flex flex-col gap-2">
                <a
                  href={PRIVACY_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                >
                  📄 Política de Tratamiento de Datos Personales (PDF)
                </a>
                <a
                  href={TERMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                >
                  📋 Términos y Condiciones — Uniempresarial
                </a>
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">6. Contacto</h2>
              <p>
                Para ejercer tus derechos o resolver dudas sobre el tratamiento de tus datos, puedes comunicarte a través del canal de PQRS de Uniempresarial:
              </p>
              <a
                href={PQRS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/20 transition-all"
              >
                📧 Ir a PQRS Uniempresarial
              </a>
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
