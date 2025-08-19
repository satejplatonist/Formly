import { Equal, Text } from "lucide-react";

export const FIELD_TYPES=[
    {
        id: "short-answer",
        name: "Short answer",
        icon: <Equal/>,
        description:"Use this to insert a question combined with a short text answer. Add an answer label or placeholder text for guidance.",
    },
    {
        id: "long-answer",
        name: "Long answer",
        icon: <Text />,
        description: "Use this for longer text responses and detailed answers.",
    },
]