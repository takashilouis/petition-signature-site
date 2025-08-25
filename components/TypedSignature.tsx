interface TypedSignatureProps {
  name: string;
  className?: string;
}

export function TypedSignature({ name, className = '' }: TypedSignatureProps) {
  if (!name.trim()) {
    return (
      <div className={`h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Type your name to see preview</span>
      </div>
    );
  }

  return (
    <div className={`h-24 border-2 border-gray-200 rounded-lg bg-white flex items-center justify-center p-4 ${className}`}>
      <div className="text-center">
        <div 
          className="text-2xl md:text-3xl text-gray-900"
          style={{ 
            fontFamily: 'Brush Script MT, cursive, serif',
            lineHeight: '1.2'
          }}
        >
          {name}
        </div>
        <div className="text-xs text-gray-500 mt-1">Typed Signature</div>
      </div>
    </div>
  );
}