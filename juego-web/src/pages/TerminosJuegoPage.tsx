import { Link } from 'react-router-dom';

const TERMS_URL = 'https://uniempresarial.edu.co/terminos-y-condiciones';
const PRIVACY_PDF_URL =
  'https://uniempresarial.edu.co/wp-content/uploads/2026/08/Tratamiento-de-Datos-Personales.pdf';

export function TerminosJuegoPage() {
  return (
    <main className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-white px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-2xl">
              📜
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Términos y Condiciones del Juego
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              ¿Dónde Está Stuttgart? — Uniempresarial
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">1. Descripción del juego</h2>
              <p>
                <strong>¿Dónde Está Stuttgart?</strong> es una dinámica de marketing institucional de Uniempresarial que consiste en dos modalidades:
              </p>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-600">
                <li><strong>🎡 Ruleta de premios:</strong> el participante gira una ruleta virtual y recibe un obsequio según el resultado</li>
                <li><strong>🔍 Reto de búsqueda:</strong> el participante completa un reto de búsqueda contra el cronómetro</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">2. Elegibilidad</h2>
              <p>Pueden participar:</p>
              <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-600">
                <li>Estudiantes universitarios mayores de 18 años</li>
                <li>Personal de universidades participantes</li>
                <li>Cualquier persona presente en el evento donde se encuentre el quiosco del juego</li>
              </ul>
              <p className="mt-2">
                No hay compra necesaria para participar. La participación es <strong>totalmente gratuita</strong>.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">3. Premios</h2>
              <ul className="ml-4 list-disc space-y-1 text-gray-600">
                <li>Los premios son <strong>obsequios promocionales</strong> sin valor económico canjeable</li>
                <li>No se entregan premios en efectivo ni transferibles</li>
                <li>El inventario de premios está sujeto a disponibilidad</li>
                <li>Uniempresarial se reserva el derecho de sustituir premios por otros de valor similar</li>
                <li><strong>Un premio por persona</strong> — se valida por número de teléfono</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">4. Frecuencia de participación</h2>
              <p>
                El operador del quiosco controla la frecuencia de uso. Los participantes pueden girar la ruleta o completar el reto de búsqueda según las indicaciones del personal en el evento.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                No hay límite técnico de participationes, pero el control se realiza de forma presencial por el operador.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">5. Datos personales</h2>
              <p>
                Al participar, autorizas el tratamiento de tus datos personales conforme a la{' '}
                <Link to="/privacidad" className="font-bold text-primary hover:underline">
                  Política de Privacidad
                </Link>{' '}
                de este juego y la{' '}
                <a href={PRIVACY_PDF_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-primary hover:underline">
                  Política de Tratamiento de Datos Personales de Uniempresarial
                </a>.
              </p>
              <p className="mt-2">
                Tus datos serán tratados conforme a la <strong>Ley 1581 de 2012</strong> y el <strong>Decreto 1377 de 2013</strong> de Colombia.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">6. Limitación de responsabilidad</h2>
              <ul className="ml-4 list-disc space-y-1 text-gray-600">
                <li>Uniempresarial no se responsabiliza por premios no reclamados</li>
                <li>El juego se proporciona "tal cual" sin garantías de disponibilidad continua</li>
                <li>Uniempresarial puede modificar, suspender o cancelar el juego en cualquier momento</li>
                <li>Los resultados de la ruleta son aleatorios y no están sujetos a reclamación</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">7. Modificaciones</h2>
              <p>
                Uniempresarial se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones se publicarán en esta página y entrarán en vigor desde su publicación.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-black text-gray-900">8. Legislación aplicable</h2>
              <p>
                Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa será resuelta por los tribunales competentes de Bogotá, Colombia.
              </p>
            </section>
          </div>

          {/* Links */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/privacidad"
                className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary/20 transition-all"
              >
                🔒 Política de Privacidad
              </Link>
              <a
                href={TERMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all"
              >
                📋 Términos Uniempresarial
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
