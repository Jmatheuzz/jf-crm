import React from 'react';

/**
 * ConfirmationModal
 * - Modal de confirmação acessível e estiloso.
 * - Props:
 *   - open: boolean (controla visibilidade)
 *   - title: string
 *   - description: string
 *   - confirmLabel: string (padrão: "Confirmar")
 *   - cancelLabel: string (padrão: "Cancelar")
 *   - onConfirm: function
 *   - onCancel: function
 * - Usa TailwindCSS se disponível, mas também funciona com estilos inline mínimos.
 */

export default function ConfirmationModal({
  open = false,
  title = 'Tem certeza?',
  description = 'Esta ação não pode ser desfeita.',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm = () => {},
  onCancel = () => {}
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl p-6 shadow-2xl bg-background-paper text-text-primary">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-700 text-sm font-medium hover:bg-gray-800"
            aria-label={cancelLabel}
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium shadow-sm bg-primary-main text-white hover:bg-primary-dark"
            aria-label={confirmLabel}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style jsx>{`\n        @media (max-width: 420px) {\n          div[role='dialog'] > div:nth-child(3) { width: calc(100% - 32px); }\n        }\n      `}</style>
    </div>
  );
}

/* Exemplo de uso:

import React from 'react';
import ConfirmationModal from './ConfirmationModal';

function Demo() {
  const [open, setOpen] = React.useState(false);
  const handleConfirm = () => {
    setOpen(false);
    // executar ação confirmada
  }
  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir modal</button>
      <ConfirmationModal
        open={open}
        title="Excluir item"
        description="Deseja realmente excluir este item? Esta ação é irreversível."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
*/