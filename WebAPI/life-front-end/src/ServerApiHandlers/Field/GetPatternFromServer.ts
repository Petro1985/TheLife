import {SERVER_ADDRESS} from "../../Utilities/serverAddress";
import {FieldWithoutId} from "../../Types/SimulationFieldResponse";


const getPatternFromServer: (patternId:number) => Promise<FieldWithoutId> = async (patternId) => 
{
    const result = await fetch(SERVER_ADDRESS + '/Pattern/' + patternId, {mode: "cors", credentials: "include"});
    return await result.json();
}