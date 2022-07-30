import { zodResolver } from "@hookform/resolvers/zod";
import { HandPalm, Play } from "phosphor-react";
import { useCallback } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useCycles } from "../../contexts/CyclesDisclosure";
import { Countdown } from "./components/Countdown";
import { NewCycleForm } from "./components/NewCycleForm";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";

const newTaskFormSchema = z.object({
  task: z.string().min(1, "Task must be at least 1 character long."),
  minutes: z
    .number()
    .min(1, "Minutes must be at least 1.")
    .max(60, "Minutes must be at most 60."),
});

export type NewTaskFormData = z.infer<typeof newTaskFormSchema>;

export function Home() {
  const { createNewCycle, activeCycle, handleInterruptCycle } = useCycles();
  const newCycleForm = useForm<NewTaskFormData>({
    resolver: zodResolver(newTaskFormSchema),
    mode: "onChange",
    defaultValues: {
      task: "",
      minutes: 5,
    },
  });
  const { handleSubmit, formState, reset } = newCycleForm;

  const handleSubmitNewCycle: SubmitHandler<NewTaskFormData> = useCallback(
    (data) => {
      createNewCycle(data);
      reset();
    },
    []
  );

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleSubmitNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

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
