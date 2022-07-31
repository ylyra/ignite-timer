export enum ActionTypes {
  CREATE_NEW_CYCLE = "CREATE_NEW_CYCLE",
  INTERRUPT_CURRENT_CYCLE = "INTERRUPT_CURRENT_CYCLE",
  FINISH_CURRENT_CYCLE = "FINISH_CURRENT_CYCLE",
  SAVE_FROM_LOCAL_STORAGE = "SAVE_FROM_LOCAL_STORAGE",
  SET_ACTIVE_CYCLE = "SET_ACTIVE_CYCLE",
}

interface DISPATCH_ADD_CYCLE<CycleProps> {
  type: ActionTypes.CREATE_NEW_CYCLE;
  payload: {
    newCycle: CycleProps;
  };
}

interface DISPATCH_INTERRUPT_CYCLE {
  type: ActionTypes.INTERRUPT_CURRENT_CYCLE;
}
interface DISPATCH_FINISH_CYCLE {
  type: ActionTypes.FINISH_CURRENT_CYCLE;
}

interface DISPATCH_SAVE_FROM_LOCAL_STORAGE<CycleProps> {
  type: ActionTypes.SAVE_FROM_LOCAL_STORAGE;
  payload: {
    cycles: CycleProps[];
  };
}

interface DISPATCH_SET_ACTIVE_CYCLE {
  type: ActionTypes.SET_ACTIVE_CYCLE;
  payload: {
    activeCycleId: string;
  };
}

export type DISPATCH_ACTIONS<CycleProps> =
  | DISPATCH_ADD_CYCLE<CycleProps>
  | DISPATCH_INTERRUPT_CYCLE
  | DISPATCH_FINISH_CYCLE
  | DISPATCH_SAVE_FROM_LOCAL_STORAGE<CycleProps>
  | DISPATCH_SET_ACTIVE_CYCLE;
