import {Pattern} from "../../Types/Pattern";
import {SERVER_ADDRESS} from "../../Utilities/serverAddress";


export const AddNewPattern: (pattern: Pattern) => void = async (pattern) => {
    try {
        const bodyContent = JSON.stringify(pattern);

        const result = await fetch(SERVER_ADDRESS + '/Pattern/',
            {
                mode: "cors",
                credentials: "include",
                headers: {'Content-Type': 'application/json'},
                method: "POST",
                body: bodyContent,
            }
        );

    } catch (e) {
        console.error("func createNewFieldOnServer error: ", e);
        throw e;
    }
}    