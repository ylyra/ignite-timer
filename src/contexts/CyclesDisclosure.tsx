import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SubmitHandler } from "react-hook-form";

type NewTaskFormData = {
  task: string;
  minutes: number;
};

interface CycleProps {
  id: string;
  task: string;
  minutes: number;
  startDate: Date;
  interrupetedDate?: Date;
  finishedDate?: Date;
}

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
  const [cycles, setCycles] = useState<CycleProps[]>([]);
  const [activeCycleId, setActiveCycleId] = useState("");
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const createNewCycle: SubmitHandler<NewTaskFormData> = useCallback((data) => {
    const newCycle: CycleProps = {
      id: new Date().getTime().toString(),
      task: data.task,
      minutes: data.minutes,
      startDate: new Date(),
    };

    setCycles((oldCycles) => {
      const newCycles = [...oldCycles, newCycle];

      return newCycles;
    });
    setActiveCycleId(newCycle.id);
    setAmountSecondsPassed(0);
  }, []);

  function handleInterruptCycle() {
    setCycles((oldCycles) => {
      return oldCycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interrupetedDate: new Date() };
        }

        return cycle;
      });
    });
    setActiveCycleId("");
    setAmountSecondsPassed(0);
  }

  useEffect(() => {
    const mostUsedTask = localStorage.getItem("@ignite-timer/tasks");
    if (mostUsedTask) {
      setCycles(JSON.parse(mostUsedTask));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("@ignite-timer/tasks", JSON.stringify(cycles));
  }, [cycles]);

  const markCurrentCycleAsFinished = useCallback(() => {
    setCycles((oldCycles) => {
      return oldCycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() };
        }

        return cycle;
      });
    });
    setActiveCycleId("");
  }, []);

  const changeSecondsPassed = useCallback((amount: number) => {
    setAmountSecondsPassed(amount);
  }, []);

  return (
    <CyclesDisclosure.Provider
      value={{
        activeCycleId,
        cycles,
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
