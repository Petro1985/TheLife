import {FieldWithoutId} from "../Types/SimulationFieldResponse";


export const convertImportedFileToField: (text: string) => FieldWithoutId = (text) =>
{
    const input = text.replace('\n', '');

    let lastNumber = 0;
    let currentY = 0;
    let currentX = 0;

    console.log(text)
    const field: FieldWithoutId = {survivors: []};
    
    for (let i = 0; i < input.length; i++)
    {
        if (input[i] === 'o')
        {
            lastNumber = Math.max(1, lastNumber);
            for (let j = 0; j < lastNumber; j++)
            {
                field.survivors.push({x:currentX + j, y:currentY});
            }

            currentX += lastNumber;
            lastNumber = 0;
        }
        else if (input[i] === 'b')
        {
            currentX += lastNumber == 0? 1 : lastNumber;
            lastNumber = 0;
        }
        else if (input[i] === '$')
        {
            lastNumber = 0;
            currentX = 0;
            currentY++;
        }
        else if (input[i] >= '0' && input[i] <= '9')
        {
            lastNumber = lastNumber * 10 + parseInt(input[i], 10);
        }
        // else
        // {
        //     return {survivors: []};
        // }
    }

    return field; 
}