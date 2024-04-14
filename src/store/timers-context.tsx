import { type ReactNode, createContext, useContext, useReducer } from "react";

export type Timer = {
  name: string;
  duration: number;
};
type TimersState = {
  isRunning: boolean;
  timers: Timer[];
};
const initialState: TimersState = {
  isRunning: true,
  timers: [],
};
// merging timersState with another object that will contain all the methods that should be called to manipulate that state value that managed with help of the context feature
type TimersContextValue = TimersState & {
  addTimer: (timerData: Timer) => void;
  startTimers: () => void;
  stopTimers: () => void;
};
const TimersContext = createContext<TimersContextValue | null>(null);
export function useTimersContext() {
  const timersCtx = useContext(TimersContext);
  if (timersCtx === null) {
    throw new Error("TimersContext is null - that shouldn't happen");
  }
  return timersCtx;
}

type TimersContextProviderProps = {
  children: ReactNode;
};
type StartTimersAction = {
  type: "START_TIMERS";
};
type StopTimersAction = {
  type: "STOP_TIMERS";
};
type AddTimerAction = {
  type: "ADD_TIMER";
  payload: Timer;
};
type Action = StartTimersAction | StopTimersAction | AddTimerAction;

function timersReducer(state: TimersState, action: Action): TimersState {
  if (action.type === "START_TIMERS") {
    return {
      ...state,
      isRunning: true,
    };
  }
  if (action.type === "STOP_TIMERS") {
    return {
      ...state,
      isRunning: false,
    };
  }
  if (action.type === "ADD_TIMER") {
    return {
      ...state,
      timers: [
        ...state.timers,
        {
          name: action.payload.name,
          duration: action.payload.duration,
        },
      ],
    };
  }
  return state;
}
export default function TimersContextProvider({
  children,
}: TimersContextProviderProps) {
  const [timersState, dispatch] = useReducer(timersReducer, initialState);
  const ctx: TimersContextValue = {
    timers: timersState.timers,
    isRunning: timersState.isRunning,
    addTimer(timerData) {
      dispatch({
        type: "ADD_TIMER",
        payload: timerData,
      });
    },
    startTimers() {
      dispatch({
        type: "START_TIMERS",
      });
    },
    stopTimers() {
      dispatch({
        type: "STOP_TIMERS",
      });
    },
  };
  return (
    <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
  );
}
