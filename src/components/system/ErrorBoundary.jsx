import { Component } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, info) {
    console.error("Nexus runtime error:", error, info);
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="nexus-error-shell">
        <section className="nexus-error-card">
          <div>
            <AlertTriangle size={42} />
          </div>
          <h1>Visual Engine Terhenti</h1>
          <p>
            Ada bagian simulasi yang gagal dirender. Biasanya ini terjadi karena GPU/browser menolak WebGL, dependency belum terinstall lengkap, atau perangkat terlalu berat menjalankan scene 3D.
          </p>
          <pre>{this.state.error?.message || "Unknown error"}</pre>
          <button onClick={this.reset}>
            <RefreshCcw size={18} />
            Muat Ulang Komponen
          </button>
        </section>
      </main>
    );
  }
}