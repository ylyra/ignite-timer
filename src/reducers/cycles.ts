import { produce } from "immer";
import { ActionTypes, DISPATCH_ACTIONS } from "../@types/cycles.dispatch";

export interface CyclesState {
  cycles: CycleProps[];
  activeCycleId: string;
}

export interface CycleProps {
  id: string;
  task: string;
  minutes: number;
  startDate: Date;
  interrupetedDate?: Date;
  finishedDate?: Date;
}

export function cyclesReducer(
  state: CyclesState,
  action: DISPATCH_ACTIONS<CycleProps>
) {
  if (action.type === ActionTypes.CREATE_NEW_CYCLE) {
    return produce(state, (draft) => {
      draft.cycles.push(action.payload.newCycle);
      draft.activeCycleId = action.payload.newCycle.id;
    });
  }

  if (action.type === ActionTypes.INTERRUPT_CURRENT_CYCLE) {
    const currentCycleIndex = state.cycles.findIndex(
      (cycle) => cycle.id === state.activeCycleId
    );
    if (currentCycleIndex === -1) {
      return state;
    }

    return produce(state, (draft) => {
      draft.cycles[currentCycleIndex].interrupetedDate = new Date();
      draft.activeCycleId = "";
    });
  }

  if (action.type === ActionTypes.FINISH_CURRENT_CYCLE) {
    const currentCycleIndex = state.cycles.findIndex(
      (cycle) => cycle.id === state.activeCycleId
    );
    if (currentCycleIndex === -1) {
      return state;
    }
    return produce(state, (draft) => {
      draft.cycles[currentCycleIndex].finishedDate = new Date();
      draft.activeCycleId = "";
    });
  }

  if (action.type === ActionTypes.SAVE_FROM_LOCAL_STORAGE) {
    return produce(state, (draft) => {
      draft.cycles = action.payload.cycles;
    });
  }

  if (action.type === ActionTypes.SET_ACTIVE_CYCLE) {
    return produce(state, (draft) => {
      draft.activeCycleId = action.payload.activeCycleId;
    });
  }

  return state;
}
