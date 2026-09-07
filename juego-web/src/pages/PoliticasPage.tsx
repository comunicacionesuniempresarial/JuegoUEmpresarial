import { useState } from 'react';

export function PoliticasPage() {
  const [activeTab, setActiveTab] = useState<'privacidad' | 'consentimiento'>('privacidad');

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/images/logo-header.png" alt="Uniempresarial" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-900">Políticas de Privacidad</h1>
          <p className="text-gray-500 mt-2">
            Universidad Uniempresarial — ¿Dónde Está Stuttgart?
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('privacidad')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'privacidad'
                ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📄 Políticas de Privacidad
          </button>
          <button
            onClick={() => setActiveTab('consentimiento')}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'consentimiento'
                ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ✅ Consentimiento de Datos
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
          {activeTab === 'privacidad' && (
            <div className="prose max-w-none text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Políticas de Privacidad</h2>

              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Datos que recolectamos</h3>
                <p>
                  En el marco del juego "¿Dónde Está Stuttgart?", recolectamos los siguientes datos personales:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Nombre completo</strong>: Para identificar al participante</li>
                  <li><strong>Número de teléfono</strong>: Para contactar al ganador</li>
                  <li><strong>Resultado del juego</strong>: Premio o tiempo obtenido</li>
                  <li><strong>Fecha y hora</strong>: Cuándo se registró el participante</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Finalidad del tratamiento</h3>
                <p>Los datos proporcionados serán utilizados exclusivamente para:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Contactar a los ganadores de los premios</li>
                  <li>Estadísticas internas de participación</li>
                  <li>Mejorar la experiencia del juego</li>
                </ul>
                <p className="mt-2 font-semibold text-primary">
                  Nunca compartiremos tus datos con terceros sin tu consentimiento expreso.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Derechos del titular</h3>
                <p>Como titular de los datos personales, tienes derecho a:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Acceder a tus datos personales</li>
                  <li>Solicitar la corrección de tus datos</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Oponerte al tratamiento de tus datos</li>
                  <li>Retirar el consentimiento en cualquier momento</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">4. Seguridad</h3>
                <p>
                  Implementamos medidas de seguridad técnicas y organizativas para proteger
                  tus datos personales contra acceso no autorizado, divulgación o alteración.
                  Cumplimos con los estándares de la Norma ISO 27001.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">5. Retención de datos</h3>
                <p>
                  Los datos personales serán conservados durante 90 días a partir de la fecha
                  del juego, después de los cuales serán eliminados de nuestra base de datos.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">6. Contacto</h3>
                <p>
                  Si tienes preguntas sobre estas políticas o deseas ejercer tus derechos,
                  contacta a la Oficina de Protección de Datos de Uniempresarial:
                </p>
                <div className="mt-3 rounded-xl bg-gray-50 p-4 text-sm font-medium">
                  📧 <a href="mailto:protecciondatos@uniempresarial.edu.co" className="text-primary hover:underline">protecciondatos@uniempresarial.edu.co</a><br />
                  📞 +57 (1) 123 4567
                </div>
              </section>
            </div>
          )}

          {activeTab === 'consentimiento' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Consentimiento de Tratamiento de Datos</h2>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-800 text-sm">
                  ⚠️ Este documento constituye el fundamento legal para el tratamiento de sus datos personales.
                </p>
              </div>

              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>De acuerdo con la Ley 1581 de 2012</strong> (Ley de Protección de Datos Personales
                  en Colombia), manifiesto que conozco y acepto de manera libre, voluntaria, expresa e informada:
                </p>

                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>El tratamiento</strong> de mis datos personales (nombre y teléfono) al
                    participar en el juego "¿Dónde Está Stuttgart?" por parte de Uniempresarial.
                  </li>
                  <li>
                    <strong>La finalidad</strong> limitada del tratamiento: contactar a los ganadores
                    y generar estadísticas de participación.
                  </li>
                  <li>
                    <strong>Mis derechos</strong> como titular de los datos: acceso, corrección,
                    supresión, oposición y revocación del consentimiento.
                  </li>
                  <li>
                    <strong>La seguridad</strong> implementada para proteger mis datos personales
                    de acuerdo con normas ISO 27001.
                  </li>
                  <li>
                    <strong>El periodo de retención</strong> de 90 días desde la fecha de participación.
                  </li>
                </ol>

                <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">¿Cómo revocar el consentimiento?</h4>
                  <p className="text-sm text-gray-600">
                    Puede ejercer su derecho a la supresión de datos enviando una solicitud a{' '}
                    <a href="mailto:protecciondatos@uniempresarial.edu.co" className="font-semibold text-primary hover:underline">
                      protecciondatos@uniempresarial.edu.co
                    </a>{' '}
                    indicando su nombre completo y número de teléfono registrado.
                    Responderemos en un plazo máximo de 15 días hábiles.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors font-medium"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}
