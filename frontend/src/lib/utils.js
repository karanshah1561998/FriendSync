export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateSeparator(date) {
  const messageDate = new Date(date);
  const today = new Date();

  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  const diffDays = Math.floor((today - messageDate) / oneDay);

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return messageDate.toLocaleDateString("en-US", { weekday: "long" }); // "Last Saturday"
  } else {
    return messageDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }); // "17 March 2025"
  }
};