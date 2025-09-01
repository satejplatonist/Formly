import { useQuery } from "@tanstack/react-query";

export function useGetSharedUrl(form_id: string) {
    const { data, error, isLoading } = useQuery({
        queryKey: ['shared-url', form_id],
        queryFn: async () => {
            const response = await fetch(`/api/getSharedUrl/?form-id=${form_id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch shared URL");
            }
            return response.json();
        },
        retry: 2
    });

    return {
        sharedUrldata: data, 
        sharedError: error, 
        sharedLoading: isLoading
    };
}
