// export function formatMessageTime(date){
//     return new Date(date).toLocaleTimeString("en-US",{
//         hour:"2-digit",
//         minute:"2-digit",
//         hour12:false,
//     });
// }


// export function formatMessageTime(date) {
//   const d = new Date(date);
//   if (!date || isNaN(d)) return ""; // Avoid crash
//   return d.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });
// }


export function formatMessageTime(date) {
  if (!date) return "…"; // fallback for missing date
  const d = new Date(date);
  if (isNaN(d)) return "…";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
