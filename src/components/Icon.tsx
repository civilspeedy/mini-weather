import React from 'react';

export default function Icon(): React.JSX.Element {
  return (
    <div
      style={{
        width: 100,
        height: 100,
        borderWidth: 3,
        borderRadius: 10,
        borderColor: 'black',
        borderStyle: 'solid',
        backgroundColor: 'red',
        display: 'flex',
      }}>
      <div style={{ margin: 'auto' }}>test</div>
    </div>
  );
}
