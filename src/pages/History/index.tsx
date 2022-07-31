import { formatDistanceToNow } from "date-fns";
import { useCycles } from "../../contexts/CyclesDisclosure";
import { HistoryContainer, HistoryList, Status } from "./styles";

export function History() {
  const { cycles } = useCycles();

  return (
    <HistoryContainer>
      <h1>My History</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Duration</th>
              <th>Start</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => (
              <tr key={cycle.id}>
                <td>{cycle.task}</td>
                <td>{cycle.minutes} minutes</td>
                <td>
                  {formatDistanceToNow(cycle.startDate, {
                    addSuffix: true,
                  })}
                </td>
                <td>
                  {cycle.finishedDate && (
                    <Status statusColor="green">Finished</Status>
                  )}
                  {cycle.interrupetedDate && (
                    <Status statusColor="red">Interrupted</Status>
                  )}
                  {!cycle.finishedDate && !cycle.interrupetedDate && (
                    <Status statusColor="yellow">In Progress</Status>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
