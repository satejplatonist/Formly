import { InputElement } from "../elements/Input";
import { TextAreaElement } from "../elements/TextArea";

interface FieldsProps{
    fieldType: string
}

export default function FieldRenderer({fieldType}:FieldsProps) 
{
    switch (fieldType) {
        case "SHORT_ANSWER":
            return(
                <InputElement/>
            );  
        case "LONG_ANSWER":
            return(
                <TextAreaElement/>
            );   
        default:
            <div>Add Columns to start</div>;
    }
};
