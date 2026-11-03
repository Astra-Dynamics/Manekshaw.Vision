import React from 'react';

export interface PasswordCondition {
  id: string;
  label: string;
  satisfied: boolean;
}

export interface PasswordRequirementsProps {
  conditions: PasswordCondition[];
  shakeActive?: boolean;
  className?: string;
}

export const getPasswordConditions = (
  password: string,
  fullName: string = '',
  isSignUp: boolean = true
): PasswordCondition[] => {
  const isMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const cleanName = fullName.trim().toLowerCase();
  const cleanPass = password.trim().toLowerCase();
  const matchesName = cleanName.length > 0 && cleanPass === cleanName;
  const satisfiesNotName = password.length > 0 && !matchesName;

  const list: PasswordCondition[] = [
    { id: 'length', label: 'At least 8 characters long', satisfied: isMinLength },
    { id: 'capital', label: 'At least 1 capital letter', satisfied: hasCapital },
    { id: 'symbol', label: 'At least 1 symbol', satisfied: hasSymbol },
    { id: 'number', label: 'At least 1 number', satisfied: hasNumber },
  ];

  if (isSignUp) {
    list.push({
      id: 'name',
      label: 'Should not match the name',
      satisfied: satisfiesNotName,
    });
  }

  return list;
};

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  conditions,
  shakeActive = false,
  className = ''
}) => {
  return (
    <div
      className={`mt-2.5 p-3 rounded-lg bg-black/30 border border-slate-800/80 space-y-1.5 ${className}`}
      aria-label="Password Requirements"
    >
      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
        <span>Password Requirements</span>
        <span className="text-[10px] text-slate-500">
          {conditions.filter((c) => c.satisfied).length}/{conditions.length} met
        </span>
      </div>

      <div className="space-y-1">
        {conditions.map((cond) => {
          const isUnmetAndShaking = shakeActive && !cond.satisfied;

          return (
            <div
              key={cond.id}
              className={`flex items-center gap-2 text-xs transition-transform duration-150 ${
                isUnmetAndShaking ? 'animate-shake-1px' : ''
              }`}
            >
              {/* Status Indicator Dot */}
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${
                  cond.satisfied
                    ? 'bg-[#1d4ed8] dark:bg-[#2563eb]'
                    : isUnmetAndShaking
                    ? 'bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                    : 'bg-amber-400'
                }`}
              />

              {/* Conditional text with animated cut-across line */}
              <div className="relative inline-block max-w-full">
                <span
                  className={`font-mono text-xs transition-colors duration-300 select-none ${
                    cond.satisfied
                      ? 'text-[#1d4ed8] dark:text-[#2563eb] opacity-80'
                      : isUnmetAndShaking
                      ? 'text-amber-300 font-semibold drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]'
                      : 'text-amber-400 font-medium'
                  }`}
                >
                  {cond.label}
                </span>

                {/* Animated Strike-Through Cut Line */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#1d4ed8] dark:bg-[#2563eb] pointer-events-none transition-all duration-300 ease-out"
                  style={{
                    width: cond.satisfied ? '100%' : '0%',
                    opacity: cond.satisfied ? 1 : 0,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
