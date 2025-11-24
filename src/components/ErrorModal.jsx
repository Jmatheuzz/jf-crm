import React from "react";
import ReactDOM from "react-dom";
import { XCircle } from "lucide-react";

const modalRoot = document.getElementById("modal-root") || (() => {
  const el = document.createElement("div");
  el.id = "modal-root";
  document.body.appendChild(el);
  return el;
})();

export class ErrorModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, message: "" };
    window.showErrorModal = this.show.bind(this);
    window.hideErrorModal = this.hide.bind(this);
  }

  show(message) {
    this.setState({ visible: true, message });
  }

  hide() {
    this.setState({ visible: false, message: "" });
  }

  render() {
    if (!this.state.visible) return null;

    return ReactDOM.createPortal(
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999]">
        <div className="bg-background-paper rounded-2xl shadow-xl p-6 max-w-sm text-center animate-fadeIn text-text-primary">
          <XCircle className="text-red-500 w-14 h-14 mx-auto mb-3" />
          <h2 className="text-xl font-semibold mb-2">Erro</h2>
          <p className="text-text-secondary mb-4">{this.state.message}</p>
          <button
            onClick={() => this.hide()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>,
      modalRoot
    );
  }
}
