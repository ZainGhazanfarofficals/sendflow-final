import React from "react";

const SuccessModal = ({ SuccessMessage, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur">
      <div className="w-full max-w-sm rounded-2xl border border-emerald-400/40 bg-slate-900/90 p-5 text-slate-50 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
            ✓
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{SuccessMessage}</p>
            <p className="mt-1 text-xs text-slate-300">
              Your action completed successfully. You can continue editing or close
              this dialog.
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
