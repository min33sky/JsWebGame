import React from 'react';

const ResetButton = ({ onReset, result }) => {
  if (result.length === 0) return null;
  return (
    <button className="reset-btn" onClick={onReset}>
      Reset
    </button>
  );
};

export default ResetButton;
