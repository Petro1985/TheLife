import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {SERVER_ADDRESS} from "../Utilities/serverAddress";

export class SimulationHubConnectionService
{
    #connection: HubConnection | null = null

    constructor()
    {
        this.#createConnection();
    }
    
    #createConnection()
    {
        this.#connection = new HubConnectionBuilder()
            .withUrl(SERVER_ADDRESS + "/SimulationHub")
            .withAutomaticReconnect()
            .build();
    }

    setMessageHandler(methodName: string, handler: (...args:any[]) => void) {
        if (this.#connection) 
        {
            this.#connection.on(methodName, handler);
        }
    }
    
    clearMessageHandler(methodName: string)
    {
        if (this.#connection)
        {
            this.#connection.off(methodName);
        }
    }
    
    getConnection = () =>
    {
        try
        {
            if (!this.#connection)
            {
                this.#createConnection();
            }
            return this.#connection;
        }
        catch (e)
        {
            console.log(e);
        }
    }

    startConnection = async () =>
    {
        try {
            if (this.#connection) {
                await this.#connection.start()
            }
        } catch (e) {
            console.log(e);
        }
    }

    stopConnection = async () =>
    {
        try {
            if (this.#connection) {
                await this.#connection.stop()
            }
        } catch (e) {
            console.log(e);
        }
    }
}