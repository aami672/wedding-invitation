import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Paigaam Studio caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="paigaam-site min-h-screen bg-[#120C0A] flex items-center justify-center p-6 text-center text-[#FBF7F0]">
          <div className="paigaam-atelier-card max-w-md p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-full border border-[#C8A055]/40 bg-[#C8A055]/10 text-[#E6C88A] mx-auto flex items-center justify-center site-display text-xl font-bold">
              P
            </div>
            <h3 className="site-display text-2xl text-[#FBF7F0] font-semibold">
              Something went wrong
            </h3>
            <p className="text-xs text-[#C7B8A3] leading-relaxed">
              An unexpected display issue occurred inside Paigaam Studio. Your invitation progress is safely preserved.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="paigaam-gold-btn px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                Reload Paigaam Studio
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
