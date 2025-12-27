## Learning React hooks

## useState
useStateは、**コンポーネントの状態(state)を保持し、変更時に再レンダリングさせる仕組み**。
```
const [state, setState] = useState(initialValue);
```
・State：現在の状態
・setState：状態を更新する関数
・initialValue：初期値（初回レンダリング時にのみ使われる）

```
import {useState} from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}
```
1. 初回レンダリング→ `count = 0`
2. ボタンクリック
3. `setCount(1)`が呼ばれる
4. Reactが再レンダリング
5. 画面に`1`が表示される

### useStateのルール
- 直接書き換えてはいけない
```
count++; // NG
setCount(count + 1); // OK
```
・stateはイミュータブル(不変)として扱う

- setStateは非同期っぽく動く
```
setCount(count + 1);
console.log(count); // まだ古い値
```
・`setState`は即時反映されないため
・次のレンダリングで反映される

- 前の値に依存する場合は関数型更新
```
setCount(prev => prev + 1); // OK
setCount(count + 1); // バグりやすい
```

- オブジェクト/配列の更新

オブジェクトの場合はコピーして使用する
```
setUser(prev => {
  ...prev,
  age: 30,
});
```

配列の場合
```
const [list, setList] = useState<string[]>([]);

setList(prev => [...prev, 'new item']);
```
削除の場合
```
setList(prev => prev.filter(item => item !== 'A));
```

## useEffect
useEffectは、**レンダリングの結果に対して副作用(side effect)を起こす仕組み**。
副作用とは、
・API通信
・DOM操作
・タイマー設定
・外部ライブラリとの連携
・Subscriptionの開始/解除
```
useEffect(() => {
  // 副作用
},[dependencies])
```

### 実行タイミング
- 空の配列
```
useEffect(() => {
  console.log('effect');
},[])
```
・実行されるタイミング
→初回レンダリング後(mount後)に**1回だけ**

- 依存配列なし
```
useEffect(() => {
  console.log('毎回実行');
})
```
・実行されるタイミング
→毎レンダリング後に実行  
(**パフォーマンスが悪化するためほぼ使用しない**)

- 依存配列あり
```
useEffect(() => {
  console.log(count);
},[count])
```
・実行タイミング
→`count`が変わった時にだけ実行

### 依存配列の本質
**useEffectは、「依存配列の値が変わったら実行」**する。
```
useEffect(() => {
  // この中で使っている値は、原則依存配列に入る
},[a, b]);
```
→古い値(stale clusure)を使うバグを防ぐため


### クリーンアップ関数
```
useEffect(() => {
  const id = setInterval(() => {
    console.log('trick');
  },1000);

  return() => {
    clearInterval(id);
  };
},[]);
```
・呼ばれるタイミング
→コンポーネントがアンマウントされる時
→次のEffectが実行される直前
**イベント登録・タイマー系は必須**

- 「Reactの外とやりとりする」→ useEffect
- 「DOM / API / timer / event」→ useEffect
- 「計算だけ」→ useEffect不要

## useReducer
useReducerは、**「現在の状態」と「アクション」を受け取って、新しい状態を返す純粋関数(reducer)**を使う。
```
const [state, dispatch] = useReducer(reducer, initialState);
```
・`state`：現在の状態
・`dispatch`：状態を更新するための関数
・`reducer`：状態遷移を定義する関数
・`initialState`：初期状態

### reducer関数
reducer関数は常に**純粋関数**である必要がある。
```
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset"; payload: number };


function counterReducer(state: number, action: Action): number {
  switch(action.type) {
    case 'increment':
      return state + 1;

    case 'decrement':
      return state - 1;

    case 'reset':
      return action.payload;

    default:
      return state;
  }
}
```
・現在の状態を変更しない
　→常に新しい状態を返す

・副作用を持たない
　→API呼び出しやconsole.log()は避ける

### 実装例
```
function counterReducer(state: number, action: { type:string; payload?: number }) {
  switch(action.type) {
    case 'increment':
      return state + 1;

    case 'decrement':
      return state - 1;
  }
}


export default function Counter() {
  const [count, setCount] = useReducer(counterReducer, 0);

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount({type: 'increment'})}></button>
      <button onclick={() => setCount({type: 'decrement'})}></button>
    </>
  )
}
```

## useContext
useContextは、**コンポーネント間で状態や値を簡単に共有するために使用する**。

Reactでは通常、親から子へ`props`wp私て値を伝えるが、階層が深くなるとpropsの受け渡しが面倒になる。
→これを**props drilling**という。

そこで`useContext`を使うと、
・コンポーネント階層を飛び越えて値を渡せる
・グローバルに近い形で状態や関数を共有できる

### useContextの基本構造
### Contextの作成
```
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext<{ theme: string; toggleTheme: () => void } | undefined>(undefined);
```
・`createContext`に初期値を渡す

### Providerで値を渡す
Contextには**Provider**というコンポーネントがあり、これで値を子コンポーネントに渡す。
```
export const ThemeProvider: React.Fc<{children: React.ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```
・Providerの`value`に渡したオブジェクトが**子コンポーネントから参照可能**
・Providerの中に入れたコンポーネントは全てContextを使える

### useContextで値を取得する
子コンポーネントで`useContext`を使って値を取得する
```
const ThemeSwitcher: React.Fc = () => {
  const context = useContext(ThemeContext);

  if(!context) {
    throw new Error('ThemeSwitcher must be used within ThemeProvider');
  }

  const { theme, toggleTheme } = context;

  return (
    <button onClick={toggleTheme}>
      current theme: {theme}
    </button>
  )
}
```
※Provider以外で呼ぶと`undefined`になる。

### useReducerと組み合わせる
`useContext`は**状態の値だけでなく、dispatch関数も共有することができる**ため、`useReducer`と組み合わせると大規模アプリの状態管理がスッキリする。

## useRef
useRefは、**再レンダリングを発生させずに値を保持したい時**と、**DOM要素要素に直接アクセスしたい時**に使うHooks。

### 基本構文
```
const ref = useRef(intialValue);
```
・`ref.current`に値が入る
・`ref.current`を変更しても**再レンダリングされない**
・コンポーネントが生きている間、値は保持され続ける
・**画面に影響しない内部データ**は`useRef`を使用する

### 使い道
- フォーカスを当てる例
```
function App() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </div>
  )
}
```
・`ref={inputRef}`でDOMと紐づく
・`inputRef.current`は実DOM

- 再レンダリングしたくない値の保存
カウントしても画面更新しない例
```
function App() {
  const countRef = useRef(0);

  const increment = () => {
    countRef.current += 1;
    console.log(countRef.current);
  };

  return <button onClick={increment}>+1</button>
}
```

## useMemo
useMemoは、**思い計算結果をキャッシュして、無駄な再計算を防ぐためのフック**。
→再レンダリングのたびに同じ計算をやり直さないようにするためのもの。

### 構文
```
const memorizedValue = useMemo(() => {
  return result;
},[依存配列]);
```
・第一引数：計算する関数
・第二引数：依存配列
  →**これが変わった時にだけ再計算**される。

### useMemo使わない場合の問題
```
funtion Example({num}: {num: number}) {
  const expensive = heacCalc(num); // 毎回実行される

  return <div>{expensive}</div>
}
```
→親が再レンダリングされるたびに`heavyCalc`が再度実行される

### useMemoを使うと
```
function Example({num}: {num: number}) {
  const expensive = useMemo(() => {
    return heavyCalc(num);
  }, [num]);

  return <div>{expensive}</div>
}
```
→`num`が変わらない限り再計算されない

### よくある使用シーン
- 思い計算
```
const sortedList = useMemo(() => {
  return list.sort((a, b) => a - b);
},[list])
```
- オブジェクト/配列の参照を固定したい時
```
const options = useMemo(() => ({
  page: 1,
  limit: 20,
}), []);
```

## useCallback
usecallbackは、**関数をメモ化(同じ参照を使い回す)ためのHooks**

### 基本構文
```
const fn = useCallback(() => {
 // 処理
},[deps]);
```
・第二引数が空の場合は、初回レンダリング時にのみ関数が**1回だけ作られる**

**「新しい関数が作られると重くなるからuseCallbackを使う」**のではない。
実際は、
・関数が再生成されるコストはほぼ無視できるレベル
・問題になるのは、**「関数の参照が変わること」**

### useCallbackが効く本当の場面
1. React.memoされた子コンポーネント
関数propsは毎回変わる。
```
function Parent() {
  return <Child onClick={() => console.log('click');} />
}
```
親が再レンダリングされるたびに`() => console.log('click');`は**新しい関数**。
JS的には、`prevOnclick !== nextOnClick`と認識され、propsが毎回変わっている判定になり、Childも再レンダリングされる。
(※関数は参照型のため)

useCallbackは、**同じ関数の参照を使い回すためのフック**のため、useCallbackを使うことで子コンポーネントは再レンダリングされなくなる。

### React.memo×useCallbackの関係
- 親
```
const handleClick = useCallback(() => {
  console.log('click');
},[依存配列(deps)]);
```
・deps(依存配列)が変わらない限り、`handleClick`は**同じ関数を参照**する。

- 子
```
const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log('child render');
  return <button onClick={onClick}>click</button>
});
```

上記の`handleClick`をPropsとして渡す場合、、React.memoは
```
prevProps.onClick === nextProps.onClick // true
```
と認識され**propsが変わっていない=再レンダリングしない**と判定される。

2. useEffectの依存配列に関数を入れる場合
```
const fetchData = useCallback(() => {
  // API処理
},[]);

useEffect(() => {
  fetchData();
},[fetchData]);
```
・無限ループ防止
・ESlint警告回避

## React.memo
`React.memo`は、**関数コンポーネントをメモ化して、不要な再レンダリングを防ぐための仕組み**。
つまり、**propsが変わらない限り、再レンダリングしないコンポーネントにする**のが`React.memo`。

### 基本構文
```
const MyComponent = React.memo(function MyComponent(props) {
  return <div>{props.value}</div>
});
```
or
```
const MyComponent = React.memo((props: Props) => {
  return <div>{props.value}</div>
})
```

### 何をしているのか？
通常、親コンポーネントが再レンダリングされると、**子コンポーネントも無条件で再レンダリングされる**。
```
親が再描画->子も再描画
```
でも、`React.memo`を使うと、
```
親が再描画->子のpropsが同じなら「再描画しない」
```
※厳密比較でpropsが同じか判定。
一致している場合：再レンダリングしない
異なっている場合：再レンダリングする

### React.memoが効果的な場面
- 表示だけのコンポーネント
　→テーブル、リスト、グラフ、カードなど、親が頻繁に再レンダリングされるが、子のpropsはほとんど変わらない場合

- 思いレンダリング処理がある場合
　→計算量が多いJSX(mapで大量DOM生成など)

- 固定データや参照固定データを渡す場合
　→`[1,2,3]`の配列をuseMemoで固定して渡したり、オブジェクトや関数もuseCallback/useMemoで参照固定

### React.memoを使わない方が良い場面
- APIフェッチや副作用を伴う処理
　→`useEffect`でフェッチしているコンポーネントには関係ない。`useMemo`は**描画の最適化**であって、通信や状態更新の最適化ではない

- propsが毎回変わる場合
　→動的に生成される配列、オブジェクト、関数を渡す場合、memoを使っても効果がほとんどない

- 軽いコンポーネント
　→再レンダリングコストがそもそも低い場合、**memoの比較コストのほうが高くなる**こともある