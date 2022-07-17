import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInSeconds } from "date-fns";
import { HandPalm, Play } from "phosphor-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleForm";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";

interface CycleProps {
  id: string;
  task: string;
  minutes: number;
  startDate: Date;
  interrupetedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextProps {
  activeCycle?: CycleProps;
  cycles: CycleProps[];
  activeCycleId: string;
  markCurrentCycleAsFinished: () => void;

  amountSecondsPassed: number;
  changeSecondsPassed: (amount: number) => void;
}

const newTaskFormSchema = z.object({
  task: z.string().min(1, "Task must be at least 1 character long."),
  minutes: z
    .number()
    .min(1, "Minutes must be at least 1.")
    .max(60, "Minutes must be at most 60."),
});

export type NewTaskFormData = z.infer<typeof newTaskFormSchema>;

const CyclesContext = createContext({} as CyclesContextProps);
export const useCycles = () => useContext(CyclesContext);

export function Home() {
  const [cycles, setCycles] = useState<CycleProps[]>([]);
  const [activeCycleId, setActiveCycleId] = useState("");
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
  const newCycleForm = useForm<NewTaskFormData>({
    resolver: zodResolver(newTaskFormSchema),
    mode: "onChange",
    defaultValues: {
      task: "",
      minutes: 5,
    },
  });
  const { handleSubmit, formState, reset } = newCycleForm;

  const onTaskSubmit: SubmitHandler<NewTaskFormData> = useCallback((data) => {
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

    reset();
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
    <HomeContainer>
      <form onSubmit={handleSubmit(onTaskSubmit)}>
        <CyclesContext.Provider
          value={{
            activeCycleId,
            cycles,
            activeCycle,
            markCurrentCycleAsFinished,

            amountSecondsPassed,
            changeSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Stop
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={!formState.isValid} type="submit">
            <Play size={24} />
            Start
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
