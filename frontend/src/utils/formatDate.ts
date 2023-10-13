export function formatDate(dateString: string) : string {
    return new Date(dateString).toLocaleString("en-US",
    {
        weekday:"long",
        month:"short",
        day:"numeric",
        year:"numeric",
        hour:"numeric",
        minute:"2-digit"
         // "2019/7/3
    });
}