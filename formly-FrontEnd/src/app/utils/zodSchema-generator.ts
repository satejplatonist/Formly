import z from "zod";
import { FIELD_TYPES } from "../Components/FormOpener/fieldtypes";

export function SchemaGenerator(fields: Array<any>) 
{
    const schemaShape: Record<string,z.ZodType<any>> = {};
    fields.forEach((field)=>{
        const {fieldType, columnId, sequenceNumber, data} = field;
        let fieldSchema;

        switch (fieldType) {
            case fieldType === "SHORT_ANSWER":
                fieldSchema = z.string()
                if (data.min) fieldSchema = fieldSchema.min(data.min,`data should be min ${data.min} characters`);
                if (data.max) fieldSchema = fieldSchema.max(data.max,`data should be max ${data.max} characters`);
                if (!data.required || data.required === false) fieldSchema = fieldSchema.optional();
                break;

            case fieldType === "LONG_ANSWER":
                fieldSchema = z.string()
                if (data.min) fieldSchema = fieldSchema.min(data.min,`data should be min ${data.min} characters`);
                if (data.max) fieldSchema = fieldSchema.max(data.max,`data should be max ${data.max} characters`);
                if (!data.required || data.required === false) fieldSchema = fieldSchema.optional();
                break;
        
            default:
                fieldSchema = z.any();
                break;
        }

        schemaShape[`field_${columnId}_${sequenceNumber}`] = fieldSchema
    }) 
    
    return z.object(schemaShape);
}