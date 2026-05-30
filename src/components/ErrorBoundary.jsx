import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("WAVZ ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Premium visual error screen for critical crashes
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#061E31] text-white p-6 relative overflow-hidden">
          {/* Glowing background elements */}
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#1173BD]/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#FFB814]/5 blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-md w-full text-center space-y-6 bg-slate-950/40 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFB814]/10 border border-[#FFB814]/30 text-[#FFB814] animate-pulse">
              ⚠️
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white">Application Recovery Active</h2>
              <p className="text-xs text-white/50 leading-relaxed">
                WAVZ Shield has intercepted a rendering exception. The interface has been secured to prevent further failure.
              </p>
            </div>

            {/* Error Message Details */}
            <div className="bg-black/40 border border-white/5 rounded-lg p-3 text-left overflow-x-auto text-[11px] font-mono text-cyan-400 max-h-[150px]">
              <span className="text-white/40 block mb-1">EXCEPTION DETECTED:</span>
              {this.state.error?.toString() || "Unknown rendering exception"}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 bg-[#FFB814] text-[#082D4A] hover:bg-[#F5A800] transition-colors rounded-xl font-semibold text-[13px] shadow-lg shadow-[#FFB814]/10 cursor-pointer"
              >
                Reload Application
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full py-2.5 px-4 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all rounded-xl font-medium text-[13px] cursor-pointer"
              >
                Attempt Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
