import React from 'react';

/**
 * FullscreenLoader
 * - Tela de carregamento em tela cheia com cor #004d4d
 * - Uso simples: <FullscreenLoader message="Carregando..." />
 * - Compatível com TailwindCSS (usa classes utilitárias). Se não usar Tailwind,
 *   o componente também inclui estilos inline mínimos para funcionar.
 */

export default function FullscreenLoader({ message = 'Carregando...', show = true }) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#003636' }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Glow + spinner container */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Glow (agora absolutamente posicionado para não empurrar o spinner) */}
          <div
            aria-hidden
            className="absolute"
            style={{
              width: 220,
              height: 220,
              borderRadius: '9999px',
              filter: 'blur(28px)',
              opacity: 0.18,
              background:
                'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 30%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.08), transparent 30%)',
            }}
          />

          {/* Spinner */}
          <div
            className="rounded-full"
            style={{
              width: 96,
              height: 96,
              border: '6px solid rgba(255,255,255,0.12)',
              borderTopColor: 'white',
              animation: 'fh-spin 1s linear infinite',
            }}
          />
        </div>


        {/* Message */}
        <div className="text-center">
          <p className="text-white text-lg font-semibold tracking-wide" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.35)' }}>
            {message}
          </p>
          <p className="mt-1 text-white text-sm opacity-80">Aguarde um instante...</p>
        </div>
      </div>

      {/* CSS keyframes se Tailwind não minimizar essa parte */}
      <style jsx>{`
        @keyframes fh-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Pequeno ajuste responsivo */
        @media (max-width: 480px) {
          div[role='status'] p { font-size: 14px; }
        }
      `}</style>
    </div>
  );
}

/* Exemplo de uso

import FullscreenLoader from './FullscreenLoader';

function App() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <FullscreenLoader show={loading} message="Carregando recursos..." />
      {!loading && <main>App carregado</main>}
    </>
  );
}
*/
