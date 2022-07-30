import { useFormContext } from "react-hook-form";

import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

import { NewTaskFormData } from "../..";
import { useCycles } from "../../../../contexts/CyclesDisclosure";

export function NewCycleForm() {
  const { activeCycle, cycles } = useCycles();
  const { register } = useFormContext<NewTaskFormData>();

  return (
    <FormContainer>
      <label htmlFor="task-name">I'll work on</label>
      <TaskInput
        id="task-name"
        type="text"
        placeholder="type the project name here"
        list="task-suggestions"
        autoComplete="off"
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
  );
}
