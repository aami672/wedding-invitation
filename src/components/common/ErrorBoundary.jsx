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
    console.error('Wishlys Studio caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-center">
          <div className="bg-white max-w-md p-8 rounded-3xl border border-stone-200 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center text-xl font-bold">
              !
            </div>
            <h3 className="font-serif text-2xl text-[#2B1E17] font-light">Something went wrong</h3>
            <p className="text-xs text-stone-500">
              An unexpected display issue occurred. Your wedding invitation data is safe.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-[#8B6F47] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#725a38] transition-colors cursor-pointer"
              >
                Reload Studio
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
