import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInSeconds } from "date-fns";
import { HandPalm, Play } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from "./styles";

const newTaskFormSchema = z.object({
  task: z.string().min(1, "Task must be at least 1 character long."),
  minutes: z
    .number()
    .min(1, "Minutes must be at least 1.")
    .max(60, "Minutes must be at most 60."),
});

type NewTaskFormData = z.infer<typeof newTaskFormSchema>;

interface CycleProps {
  id: string;
  task: string;
  minutes: number;
  startDate: Date;
  interrupetedDate?: Date;
  finishedDate?: Date;
}

let currentCycleInterval: NodeJS.Timeout;

export function Home() {
  const [cycles, setCycles] = useState<CycleProps[]>([]);
  const [activeCycleId, setActiveCycleId] = useState("");
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const totalSeconds = activeCycle ? activeCycle.minutes * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmountLeft = Math.floor(currentSeconds / 60);
  const secondsAmountLeft = currentSeconds % 60;

  const minutes = String(minutesAmountLeft).padStart(2, "0");
  const seconds = String(secondsAmountLeft).padStart(2, "0");

  const { formState, handleSubmit, register, reset } = useForm<NewTaskFormData>(
    {
      resolver: zodResolver(newTaskFormSchema),
      mode: "onChange",
      defaultValues: {
        task: "",
        minutes: 5,
      },
    }
  );

  const onTaskSubmit: SubmitHandler<NewTaskFormData> = useCallback((data) => {
    const newCycle: CycleProps = {
      id: new Date().getTime().toString(),
      task: data.task,
      minutes: data.minutes,
      startDate: new Date(),
    };

    setCycles((oldCycles) => {
      const newCycles = [...oldCycles, newCycle];

      if (!oldCycles.includes(newCycle)) {
        localStorage.setItem(data.task, JSON.stringify(newCycles));
      }

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
    if (activeCycle) {
      currentCycleInterval = setInterval(() => {
        const secondsPassed = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate)
        );
        if (secondsPassed >= totalSeconds) {
          setCycles((oldCycles) => {
            return oldCycles.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() };
              }

              return cycle;
            });
          });
          setActiveCycleId("");
          setAmountSecondsPassed(0);
          clearInterval(currentCycleInterval);
          document.title = `Ignite Timer - Current cycle finished`;
        } else {
          setAmountSecondsPassed(secondsPassed);
        }
      }, 1000);
    }

    return () => {
      clearInterval(currentCycleInterval);
    };
  }, [activeCycle, totalSeconds, activeCycleId]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `Ignite Timer - ${minutes}:${seconds}`;
    }
  }, [activeCycle, minutes, seconds]);

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(onTaskSubmit)}>
        <FormContainer>
          <label htmlFor="task-name">I'll work on</label>
          <TaskInput
            id="task-name"
            type="text"
            placeholder="type the project name here"
            list="task-suggestions"
            disabled={!!activeCycle}
            {...register("task")}
          />
          <datalist id="task-suggestions">
            {cycles.map((cycle) => (
              <option key={cycle.id} value={cycle.task} />
            ))}
          </datalist>

          <label htmlFor="task-time">for</label>
          <MinutesAmountInput
            id="task-time"
            type="number"
            min={5}
            max={60}
            step={5}
            defaultValue={20}
            disabled={!!activeCycle}
            {...register("minutes", {
              valueAsNumber: true,
            })}
          />
          <span>minutes.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

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
