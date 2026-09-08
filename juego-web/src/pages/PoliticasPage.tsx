import { useEffect } from 'react';

const PRIVACY_POLICY_URL =
  'https://uniempresarial.edu.co/wp-content/uploads/2026/08/Tratamiento-de-Datos-Personales.pdf';

export function PoliticasPage() {
  useEffect(() => {
    window.location.replace(PRIVACY_POLICY_URL);
  }, []);

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-white px-4 py-16 text-center">
      <h1 className="text-2xl font-extrabold text-gray-900">Políticas de Privacidad</h1>
      <p className="mt-3 text-gray-600">Redirigiendo al documento oficial de Uniempresarial…</p>
      <a
        href={PRIVACY_POLICY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-bold text-white hover:bg-primary-hover"
      >
        Abrir política de privacidad
      </a>
    </main>
  );
}
