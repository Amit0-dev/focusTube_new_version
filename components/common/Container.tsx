import React from 'react';

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`w-full container max-w-5xl mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
