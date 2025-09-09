
const backendUrl = import.meta.env.VITE_PUBLIC_API_URL
export const getImageUrl = (imageKey: string) => {
    // If imageKey already starts with http, return as-is
    if (imageKey?.startsWith("http")) return imageKey;

    // Otherwise, prepend backend URL
    const path = imageKey?.startsWith("/") ? imageKey?.slice(1) : imageKey;
    return `${backendUrl}/${path}`;
};
