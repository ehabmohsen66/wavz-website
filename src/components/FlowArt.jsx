import React from 'react';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

export const FlowSection = ({
  className,
  style = {},
  children,
  'aria-label': ariaLabel,
}) => (
  <div
    data-flow-section
    aria-label={ariaLabel}
    className={cx('w-full', className)}
    style={style}
  >
    {children}
  </div>
);

export const FlowArt = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  return (
    <main
      aria-label={ariaLabel}
      className={cx('w-full', className)}
    >
      {children}
    </main>
  );
};

export default FlowArt;
