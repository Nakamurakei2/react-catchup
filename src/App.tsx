import React, { useReducer } from "react";

type State = {
  username: "";
  email: "";
  password: "";
};

type Action = {
  type: string;
  payload: {
    inputName: keyof State;
    value: string;
  };
};

// useReducerのみを使用してフォーム状態をまとめて管理。
// inputのonchangeは一つ使用し。reducerは純粋関数
function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case "change":
      console.log("state", state);
      return {
        ...state,
        [action.payload.inputName]: action.payload.value,
      };

    default:
      return state;
  }
}

const initialValue: State = {
  username: "",
  email: "",
  password: "",
};

function App() {
  const [state, dispatch] = useReducer(formReducer, initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    console.log("inputname", target.name);
    console.log("value", target.value);

    dispatch({
      type: "change",
      payload: { inputName: target.name as keyof State, value: target.value },
    });
  };

  return (
    <div>
      <input
        type="text"
        name="username"
        value={state.username}
        onChange={(e) => onChange(e)}
      />

      <input
        type="email"
        name="email"
        value={state.email}
        onChange={(e) => onChange(e)}
      />

      <input
        type="password"
        name="password"
        value={state.password}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
}

export default App;
