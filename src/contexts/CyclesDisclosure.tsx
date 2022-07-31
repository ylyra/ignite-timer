import { addMinutes, differenceInSeconds, parseISO } from "date-fns";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { SubmitHandler } from "react-hook-form";
import { ActionTypes } from "../@types/cycles.dispatch";
import { CycleProps, cyclesReducer, CyclesState } from "../reducers/cycles";

type NewTaskFormData = {
  task: string;
  minutes: number;
};

interface CyclesDisclosureProps {
  activeCycle?: CycleProps;
  cycles: CycleProps[];
  activeCycleId: string;
  markCurrentCycleAsFinished: () => void;
  createNewCycle: (data: NewTaskFormData) => void;
  handleInterruptCycle: () => void;

  amountSecondsPassed: number;
  changeSecondsPassed: (amount: number) => void;
}

interface CyclesDisclosureProviderProps {
  children: ReactNode;
}

const CyclesDisclosure = createContext({} as CyclesDisclosureProps);
export const useCycles = () => useContext(CyclesDisclosure);

export const CyclesProvider = ({ children }: CyclesDisclosureProviderProps) => {
  const [cycles, dispatchCycles] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: "",
    },
    () => {
      const mostUsedTask = localStorage.getItem("@ignite-timer/tasks");
      if (mostUsedTask) {
        const savedCyles = JSON.parse(mostUsedTask) as CyclesState;
        if (savedCyles.cycles.length) {
          const allCycles = savedCyles.cycles.map((cycle) => {
            const didFinishedCycle =
              cycle.finishedDate || cycle.interrupetedDate;
            let interrupetedDate = cycle.interrupetedDate;
            if (
              !didFinishedCycle &&
              differenceInSeconds(
                new Date(),
                addMinutes(
                  parseISO(String(cycle.startDate)),
                  Number(cycle.minutes)
                )
              ) > 0
            ) {
              interrupetedDate = new Date();
            }

            return {
              ...cycle,
              startDate: parseISO(String(cycle.startDate)),
              interrupetedDate: interrupetedDate,
              minutes: Number(cycle.minutes),
              finishedDate:
                cycle.finishedDate && parseISO(String(cycle.finishedDate)),
            };
          });
          const activeCycle = allCycles.find(
            (cycle) => !cycle.finishedDate && !cycle.interrupetedDate
          );
          return {
            cycles: allCycles,
            activeCycleId: activeCycle ? activeCycle.id : "",
          };
        }

        return {
          cycles: [],
          activeCycleId: "",
        };
      }

      return {
        cycles: [],
        activeCycleId: "",
      };
    }
  );

  const activeCycle = cycles.cycles.find(
    (cycle) => cycle.id === cycles.activeCycleId
  );
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), activeCycle.startDate);
    }
    return 0;
  });

  const createNewCycle: SubmitHandler<NewTaskFormData> = useCallback((data) => {
    const newCycle: CycleProps = {
      id: new Date().getTime().toString(),
      task: data.task,
      minutes: data.minutes,
      startDate: new Date(),
    };

    dispatchCycles({
      type: ActionTypes.CREATE_NEW_CYCLE,
      payload: {
        newCycle,
      },
    });
    setAmountSecondsPassed(0);
  }, []);

  const handleInterruptCycle = useCallback(() => {
    dispatchCycles({
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
    });
    setAmountSecondsPassed(0);
  }, []);

  const markCurrentCycleAsFinished = useCallback(() => {
    dispatchCycles({
      type: ActionTypes.FINISH_CURRENT_CYCLE,
    });
  }, []);

  const changeSecondsPassed = useCallback((amount: number) => {
    setAmountSecondsPassed(amount);
  }, []);

  useEffect(() => {
    if (cycles.cycles.length > 0)
      localStorage.setItem("@ignite-timer/tasks", JSON.stringify(cycles));
  }, [cycles]);

  return (
    <CyclesDisclosure.Provider
      value={{
        activeCycleId: cycles.activeCycleId,
        cycles: cycles.cycles,
        activeCycle,
        markCurrentCycleAsFinished,
        createNewCycle,
        handleInterruptCycle,

        amountSecondsPassed,
        changeSecondsPassed,
      }}
    >
      {children}
    </CyclesDisclosure.Provider>
  );
};
