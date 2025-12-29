import React, { useCallback, useEffect, useMemo, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const logCount = useCallback(() => {
    console.log("logcount");
    console.log(cp)
  }, [count]);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>logcount</button>
    </div>
  );
}

export default App;
