export function formatTimeForDisplay(date, mode = "time") {
  if (!date) return "";

  const messageDate = new Date(date);
  const today = new Date();

  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((today - messageDate) / oneDay);

  const timeString = messageDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (mode === "time") {
    // Used for chat messages → Only returns "2:14 PM"
    return timeString;
  }

  if (mode === "separator") {
    // Used for message date separators
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return messageDate.toLocaleDateString("en-US", { weekday: "long" }); // "Thursday"
    return messageDate.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }); // "14 March 2025"
  }

  if (mode === "lastSeen") {
    // Used for last seen in chat header
    if (diffDays === 0) return `Today, ${timeString}`; // "Today, 2:14 PM"
    if (diffDays === 1) return `Yesterday, ${timeString}`; // "Yesterday, 2:14 PM"
    if (diffDays < 7) return `${messageDate.toLocaleDateString("en-US", { weekday: "long" })}, ${timeString}`; // "Thursday, 2:14 PM"
    return `${messageDate.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}, ${timeString}`; // "Thursday, 14 March, 2:14 PM"
  }

  return timeString;
}