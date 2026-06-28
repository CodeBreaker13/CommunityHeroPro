export const timeAgo = (timestamp) => {
  const diff = (Date.now() - new Date(timestamp)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
};
export const severityColor = (s) => ({ Critical:"badge-critical", High:"badge-high", Medium:"badge-medium", Low:"badge-low" }[s]||"badge-low");
export const statusColor   = (s) => ({ Open:"badge-open", "In Progress":"badge-inprogress", Resolved:"badge-resolved" }[s]||"badge-open");
export const categoryIcon  = (cat) => ({ "Roads & Potholes":"🛣️","Water & Sewage":"💧","Electricity":"⚡","Waste Management":"🗑️","Public Safety":"🚨","Other":"📋" }[cat]||"📋");
export const toBase64 = (file) => new Promise((res,rej) => { const r=new FileReader(); r.readAsDataURL(file); r.onload=()=>res(r.result); r.onerror=rej; });
