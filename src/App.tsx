import React, { useCallback, useMemo, useState } from "react";

// function Child({ value }: { value: number }) {
//   console.log("child render");
//   return <div>{value}</div>;
// }

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log("child render");
  return <button onClick={onClick}>click</button>;
});

function App() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
      <Child onClick={handleClick} />
    </div>
  );
}

export default App;
