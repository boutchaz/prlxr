import stepsReducer, {
  ActionTypes,
  INITIAL_STATE,
} from "../reducers/stepsReducer";


import { createContext, ReactNode, useContext, useReducer } from "react";
import { StepsState } from "../types";

export const StepsContext = createContext<{
  state: StepsState;
  dispatch: React.Dispatch<ActionTypes>;
}>({
  state: INITIAL_STATE,
  dispatch: () => {
    // empty dispatch default function
  },
});

const StepsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(stepsReducer, INITIAL_STATE);

  return (
    <StepsContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </StepsContext.Provider>
  );
};

export const useSteps = () => useContext(StepsContext);

export default StepsProvider;
