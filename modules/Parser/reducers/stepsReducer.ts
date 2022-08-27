import { StepsState } from "../types";

export const INITIAL_STATE: StepsState = {
  currentStep: 0,
  fieldsAccepted: false,
  fileAccepted: false,
  fields: [],
  fileState: null,
  selectedFile: null,
};

export interface ActionTypes {
  type: "PREVIOUS" | "NEXT" | "SET_FIELDS" | "SET_FILE" | "SET_FILE_STATE";
  payload?: any;
}

const stepsReducer = (state: StepsState, action: ActionTypes): StepsState => {
  switch (action.type) {
    case "PREVIOUS":
      return {
        ...state,
        currentStep: action?.payload.currentStep
          ? action.payload.currentStep - 1
          : 0,
      };
    case "NEXT":
      return {
        ...state,
        currentStep: action?.payload.currentStep
          ? action.payload.currentStep + 1
          : 1,
      };
    case "SET_FILE":
      return {
        ...state,
        selectedFile: action?.payload,
      };
    case "SET_FILE_STATE":
      return {
        ...state,
        fileState: action?.payload,
      };
    default:
      return INITIAL_STATE;
  }
};

export default stepsReducer;
