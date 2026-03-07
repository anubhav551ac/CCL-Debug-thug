/**
 * Generate initials from a name
 * @param name - Full name of the person (can be undefined)
 * @returns Two-letter initials
 */
export const getInitials = (name?: string | null): string => {
    const safe = (name ?? "").trim();
    if (!safe) return "??";
    const parts = safe.split(/\s+/);
    if (parts.length === 0) return "??";
    if (parts.length === 1) return parts[0]!.substring(0, 2).toUpperCase();
    return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
};

/**
 * Generate a random pastel color for avatar background
 * @param seed - String to seed the color generation (for consistency)
 * @returns Tailwind color class
 */
export const getAvatarColor = (seed: string): string => {
    const colors = [
        "bg-emerald-500",
        "bg-emerald-600",
        "bg-green-500",
        "bg-green-600",
        "bg-teal-500",
        "bg-teal-600",
        "bg-cyan-500",
        "bg-blue-500",
        "bg-violet-500",
        "bg-purple-500",
    ];

    // Simple hash of the seed string to pick a consistent color
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    return colors[Math.abs(hash) % colors.length];
};

/**
 * Generate avatar with initials if profile picture is missing
 * @param name - User's name
 * @param profilePic - URL of profile picture (optional)
 * @returns Object with either imageUrl or initials + bgColor
 */
export const generateAvatarContent = (
    name?: string | null,
    profilePic?: string | null
): { type: "image" | "initials"; imageUrl?: string; initials?: string; bgColor?: string } => {
    if (profilePic) {
        return { type: "image", imageUrl: profilePic };
    }
    const fallbackName = (name && name.trim()) || "User";
    return {
        type: "initials",
        initials: getInitials(fallbackName),
        bgColor: getAvatarColor(fallbackName),
    };
};
