"Use client";

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Multi-Ring Spinner Component
export const MultiRingSpinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer ring - blue */}
      <div className="absolute inset-0 border-2 border-transparent border-t-[#58a6ff] rounded-full animate-spin" />
      
      {/* Middle ring - purple */}
      <div className="absolute top-1 left-1 right-1 bottom-1 border-2 border-transparent border-t-[#a855f7] rounded-full animate-spin-reverse" 
           style={{ animationDuration: '1.5s' }} />
      
      {/* Inner ring - orange */}
      <div className="absolute top-2 left-2 right-2 bottom-2 border-2 border-transparent border-t-[#f97316] rounded-full animate-spin" 
           style={{ animationDuration: '2s' }} />
    </div>
  );
};

// Pulsing Dots Spinner Component
export const PulsingDotsSpinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const gaps = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  };

  return (
    <div className={`flex ${gaps[size]} ${className}`}>
      <div 
        className={`${dotSizes[size]} rounded-full bg-gradient-to-r from-[#58a6ff] to-[#a855f7] animate-pulse-scale`}
        style={{ animationDelay: '-0.32s' }}
      />
      <div 
        className={`${dotSizes[size]} rounded-full bg-gradient-to-r from-[#58a6ff] to-[#a855f7] animate-pulse-scale`}
        style={{ animationDelay: '-0.16s' }}
      />
      <div 
        className={`${dotSizes[size]} rounded-full bg-gradient-to-r from-[#58a6ff] to-[#a855f7] animate-pulse-scale`}
      />
    </div>
  );
};

// Gradient Ring Spinner Component
export const GradientRingSpinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div 
        className="w-full h-full rounded-full animate-spin"
        style={{
          background: `conic-gradient(from 0deg, transparent, #58a6ff, #a855f7, #f97316, transparent)`,
          animationDuration: '1.2s'
        }}
      >
        <div className="absolute inset-0.5 bg-[#0d1117] rounded-full" />
      </div>
    </div>
  );
};

// Typing Indicator Component
export const TypingIndicator: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-1 px-4 py-3 bg-[rgba(22,27,34,0.8)] border border-[#30363d] rounded-2xl backdrop-blur-sm ${className}`}>
      <div 
        className="w-1.5 h-1.5 rounded-full bg-[#7d8590] animate-typing"
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="w-1.5 h-1.5 rounded-full bg-[#7d8590] animate-typing"
        style={{ animationDelay: '0.2s' }}
      />
      <div 
        className="w-1.5 h-1.5 rounded-full bg-[#7d8590] animate-typing"
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  );
};

// Chat Message Loading Component
interface ChatMessageLoadingProps {
  message?: string;
  className?: string;
}

export const ChatMessageLoading: React.FC<ChatMessageLoadingProps> = ({ 
  message = "AI is thinking...",
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-3 p-4 bg-[rgba(22,27,34,0.8)] border border-[#30363d] rounded-xl backdrop-blur-sm max-w-sm ${className}`}>
      <div className="w-5 h-5 border-2 border-[#30363d] border-t-[#58a6ff] rounded-full animate-spin flex-shrink-0" />
      <span className="text-[#7d8590] text-sm">{message}</span>
    </div>
  );
};

// Simple Spinner Component (most common use case)
export const SimpleSpinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div className={`${sizeClasses[size]} border-[#30363d] border-t-[#58a6ff] rounded-full animate-spin ${className}`} />
  );
};

// Main Loading Spinner Component with variants
interface LoadingSpinnerProps {
  variant?: 'simple' | 'multi-ring' | 'dots' | 'gradient' | 'typing' | 'message';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  variant = 'simple',
  size = 'md',
  message,
  className = ''
}) => {
  switch (variant) {
    case 'multi-ring':
      return <MultiRingSpinner size={size} className={className} />;
    case 'dots':
      return <PulsingDotsSpinner size={size} className={className} />;
    case 'gradient':
      return <GradientRingSpinner size={size} className={className} />;
    case 'typing':
      return <TypingIndicator className={className} />;
    case 'message':
      return <ChatMessageLoading message={message} className={className} />;
    default:
      return <SimpleSpinner size={size} className={className} />;
  }
};