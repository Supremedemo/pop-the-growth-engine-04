
import React, { createContext, useContext, useReducer } from "react";
import { PredefinedTemplate } from "./templatesData";

type CustomizationState = {
  selectedTemplate: PredefinedTemplate | null;
  customValues: Record<string, any>;
  undoStack: any[];
  redoStack: any[];
};

type CustomizationAction =
  | { type: "SET_TEMPLATE"; template: PredefinedTemplate }
  | { type: "UPDATE_VALUE"; key: string; value: any }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

const initialState: CustomizationState = {
  selectedTemplate: null,
  customValues: {},
  undoStack: [],
  redoStack: [],
};

function reducer(state: CustomizationState, action: CustomizationAction): CustomizationState {
  switch (action.type) {
    case "SET_TEMPLATE":
      return { ...state, selectedTemplate: action.template, customValues: {}, undoStack: [], redoStack: [] };
    case "UPDATE_VALUE":
      return {
        ...state,
        customValues: { ...state.customValues, [action.key]: action.value },
        undoStack: [...state.undoStack, state.customValues],
        redoStack: [],
      };
    case "UNDO":
      if (state.undoStack.length === 0) return state;
      const prev = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        customValues: prev,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [state.customValues, ...state.redoStack]
      };
    case "REDO":
      if (state.redoStack.length === 0) return state;
      const next = state.redoStack[0];
      return {
        ...state,
        customValues: next,
        undoStack: [...state.undoStack, state.customValues],
        redoStack: state.redoStack.slice(1)
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const PredefinedTemplateCustomizationContext = createContext<{
  state: CustomizationState;
  dispatch: React.Dispatch<CustomizationAction>;
}>({
  state: initialState,
  dispatch: () => undefined
});

export const PredefinedTemplateCustomizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <PredefinedTemplateCustomizationContext.Provider value={{ state, dispatch }}>
      {children}
    </PredefinedTemplateCustomizationContext.Provider>
  );
};

export const usePredefinedTemplateCustomization = () =>
  useContext(PredefinedTemplateCustomizationContext);
