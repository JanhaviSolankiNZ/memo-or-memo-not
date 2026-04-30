import {
  memo,
  useState,
  createContext,
  useEffect,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useFlashOnRender } from "./hooks";

const ClockContext = createContext();

const useRenderCount = () => {
  const ref = useRef(0);
  ref.current += 1;
  return ref.current;
};

const NormalChild = () => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);

  return (
    <div className="grid_item" ref={ref}>
      <h2>Normal child</h2>
      <p>
        This is a normal child component, when the parent state changes, causing
        a re-render, this component will also re-render even though nothing has
        changed.
      </p>
    </div>
  );
};

const MemoChild = memo(() => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  return (
    <div className="grid_item" ref={ref}>
      <h2>Memo child</h2>
      <p>
        This child is wrapped in React.memo and will only render when the app
        starts.
      </p>
    </div>
  );
});

const MemoChildWithState = memo(() => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  const [childCount, incrementChildCount] = useState(0);

  const childCountHandler = () => {
    incrementChildCount(childCount + 1);
  };

  return (
    <div className="grid_item" ref={ref}>
      <h2>Memo Child With State</h2>
      <p>
        This component is wrapped in React.memo and will only render when the
        app starts or it's own state changes. It will not re-render when parent
        state changes.
      </p>
      <span>Child count: {childCount}</span>
      <button className="increment_button" onClick={childCountHandler}>
        Increment Child Count
      </button>
    </div>
  );
});

const MemoChildWithProp = memo(({ parentCount }) => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  return (
    <div className="grid_item" ref={ref}>
      <h2>Memo Child With Prop</h2>
      <span>Parent Count: {parentCount}</span>
      <p>
        This child is wrapped in React.memo and will only render when the parent
        count changes
      </p>
    </div>
  );
});

const MemoChildUpdateParentState = memo(({ incrementParentCount }) => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  return (
    <div className="grid_item" ref={ref}>
      <h2>Memo Child Update Parent State</h2>
      <p>
        This component is wrapped in React.memo and will only render when the
        app starts. It also updates the parent state when clicked and proves
        this will not cause a re-render.
      </p>
      <button className="increment_button" onClick={incrementParentCount}>
        Incremet Parent Count
      </button>
    </div>
  );
});

const ClockChild = () => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  const { time, alarm, toggleAlarm } = useContext(ClockContext);
  return (
    <div className="grid_item" ref={ref}>
      <h2>Clock Child</h2>
      <p>This component is not wrapped in a memo and uses a context. It will re-render when parent re-renders or anything in context changes.  </p>
      <span>
        {time} - Alarm is {alarm ? "on" : "off"}
      </span>
      <button
        className={alarm ? "toggle_on" : "toggle_off"}
        onClick={toggleAlarm}
      >
        Toggle Alarm
      </button>
    </div>
  );
};

const MemoClockChild = memo(() => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  const { time } = useContext(ClockContext);
  return (
    <div className="grid_item" ref={ref}>
      <h2>Memo Clock Child</h2>
      <p>
        This component is wrapped in a memo and uses the clock context. It will
        re-render when the time changes but it wont re-render when the parent
        re-renders.
      </p>
      <p>
        Note that the component will re-render when Anything in the context
        changes, even if it's something that the component doesn't use.
      </p>
      <span>{time}</span>
    </div>
  );
});

const ClockGrandChild = () => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  const { time, toggleClock, clockRunning } = useContext(ClockContext);
  return (
    <div className="grid_item" ref={ref}>
      <h2>Clock Grand Child</h2>
      <p>
        This grand child component does not use React.memo so it re-renders when
        it's parent does, it also uses clock context time so will re-render when
        that time changes.
      </p>
      <span>{time}</span>
      <button
        className={clockRunning ? "toggle_on" : "toggle_off"}
        onClick={toggleClock}
      >
        Toggle Clock
      </button>
    </div>
  );
};

const MemoClockGrandChild = memo(() => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  const { time, toggleClock, clockRunning } = useContext(ClockContext);

  return (
    <div className="grid_item" ref={ref}>
      <h2>Memo Clock Grand Child</h2>
      <p>
        This grand child component uses React.memo so it wont re-enders when
        it's parent does but does re-render when its clock context time changes
      </p>
      <span>{time}</span>
      <button
        className={clockRunning ? "toggle_on" : "toggle_off"}
        onClick={toggleClock}
      >
        Toggle Clock
      </button>
    </div>
  );
});

const NestedClockChild = () => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  return (
    <div className="grid_item" ref={ref}>
      <p>
        This component is not wrapped in React.memo and it's child uses context
        data. This component will re-render when the parent does but does not
        re-render when the clock context changes.
      </p>
      <ClockGrandChild />
      <MemoClockGrandChild />
    </div>
  );
};

const UseMemoChild = memo(() => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  const { time } = useContext(ClockContext);

  const memoizedTime = useMemo(() => time, [time]);

  return (
    <div className="grid_item" ref={ref}>
      <h2>Use Memo Child</h2>
      <p>
        This component uses the clock context and will re-render when any
        context item changes but at least only compute the time display string
        when the time changes.
      </p>
      <p>
        Don't get carried away and memoise the output, instead memoise children
        that if it helps.
      </p>
      <span>{memoizedTime}</span>
    </div>
  );
});

const MemoChildInlineCallback = memo(({onClick}) => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  return (
    <div className="grid_item" ref={ref}>
      <h2>Memo + Inline Callback</h2>
      <p>
        This component is wrapped in React.memo but receives an inline () =&gt;
        handler() prop. A new function reference is created on every parent
        render, so memo's comparison always fails and this re-renders every time
        the parent does.
      </p>
      <button className="increment_button" onClick={onClick}>
        Increment Parent Count
      </button>
    </div>
  );
});

const MemoChildUseCallback = memo(({onClick}) => {
  const renders = useRenderCount();
  const ref = useFlashOnRender(renders);
  return (
    <div className="grid_item" ref={ref}>
      <h2>Memo + useCallback</h2>
      <p>
        This component is wrapped in React.memo but receives a callback wrapped
        in useCallback. The function reference is stable across renders, so
        memo's comparison succeeds and this component never re-renders
        unnecessarily.
      </p>
      <button className="increment_buttob" onClick={onClick}>
        Increment Parent Count
      </button>
    </div>
  );
});

const RenderOptimizer = () => {
  const [count, setCount] = useState(0);
  const [isToggled, setToggle] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleDateString());
  const [alarm, setAlarm] = useState(false);
  const [clockRunning, setClockRunning] = useState(true);

  // Tick every second
  useEffect(() => {
    if (!clockRunning) return;
    const id = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    );
    return () => clearInterval(id);
  }, [clockRunning]);

  const handleToggle = useCallback(() => setToggle(t => !t),[])
  const handleIncrement = useCallback(() => setCount(count => count + 1),[]);
  const toggleAlarm = useCallback(() => setAlarm(a => !a),[])
  const toggleClock = useCallback(() => setClockRunning(c => !c),[]);

  return (
    <ClockContext.Provider
      value={{ time, alarm, toggleAlarm, toggleClock, clockRunning }}
    >
      <h1>Render Optimisation</h1>
      <div className="grid_container">
        <div className="grid_item counter_container">
          Top count: {count}
          <button className="increment_button" onClick={handleIncrement}>
            Increment
          </button>
          <button
            onClick={handleToggle}
            className={isToggled ? "toggle_on" : "toggle_off"}
          >
            Toggle
          </button>
        </div>
        <NormalChild />
        <MemoChild />
        <MemoChildWithState />
        <MemoChildWithProp parentCount={count} />
        <MemoChildUpdateParentState incrementParentCount={handleIncrement} />
        <ClockChild />
        <MemoClockChild />
        <NestedClockChild />
        <UseMemoChild />
        <MemoChildInlineCallback onClick={() => setCount(c => c+1)} />
        <MemoChildUseCallback onClick={handleIncrement} />
      </div>
    </ClockContext.Provider>
  );
};

export default RenderOptimizer;
