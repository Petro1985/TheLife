import {store} from "../../redux/Store";
import {SERVER_ADDRESS} from "../../Utilities/serverAddress";


export const updateFieldOnServer = async () => {
    try {
        const field = store.getState().field.field;
        const bodyContent = JSON.stringify({"survivors": field.survivors, "name": field.name});

        await fetch(SERVER_ADDRESS + '/Map/' + field.id,
            {
                mode: "cors",
                credentials: "include",
                headers: {'Content-Type': 'application/json'},
                method: "PUT",
                body: bodyContent
            });
    } catch (e) {
        console.log(e);
    }
}