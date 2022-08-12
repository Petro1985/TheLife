import {HubConnection} from "@microsoft/signalr";
import {makeSimulationTurn, SIMULATION_FIELD_BUFFER_SIZE} from "../../../redux/playGroundSlice";
import {store} from "../../../redux/Store";

export const intervalHandler = async (con: HubConnection, simulatedFieldId: string) =>
{
    store.dispatch(makeSimulationTurn());
    if (!con) return;
    try
    {
        const currentTurn = store.getState().playGround.currentTurn;
        const simulationFieldRequest = {Id: simulatedFieldId, toTurn: currentTurn + SIMULATION_FIELD_BUFFER_SIZE}
        await con.send('SendFields', simulationFieldRequest);
        console.log(`Request ro turn ${currentTurn + SIMULATION_FIELD_BUFFER_SIZE} sent`);
    } catch (e) {
        console.log(e);
    }
}