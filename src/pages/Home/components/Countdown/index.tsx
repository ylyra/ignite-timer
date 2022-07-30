import { differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";
import { useCycles } from "../../../../contexts/CyclesDisclosure";
import { CountdownContainer, Separator } from "./styles";

let currentCycleInterval: NodeJS.Timeout;

export function Countdown() {
  const {
    activeCycleId,
    activeCycle,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    changeSecondsPassed,
  } = useCycles();

  const totalSeconds = activeCycle ? activeCycle.minutes * 60 : 0;
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmountLeft = Math.floor(currentSeconds / 60);
  const secondsAmountLeft = currentSeconds % 60;

  const minutes = String(minutesAmountLeft).padStart(2, "0");
  const seconds = String(secondsAmountLeft).padStart(2, "0");

  useEffect(() => {
    if (activeCycle) {
      currentCycleInterval = setInterval(() => {
        const secondsPassed = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate)
        );
        if (secondsPassed > totalSeconds) {
          markCurrentCycleAsFinished();
          changeSecondsPassed(0);
          clearInterval(currentCycleInterval);
          document.title = `Ignite Timer - Current cycle finished`;
        } else {
          changeSecondsPassed(secondsPassed);
        }
      }, 1000);
    }

    return () => {
      clearInterval(currentCycleInterval);
    };
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `Ignite Timer - ${minutes}:${seconds}`;
    }
  }, [activeCycle, minutes, seconds]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}
