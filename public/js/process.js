/* js/process.js — "How I work": the line fills with scroll and each step lights up in turn. */
PF.initProcess = () => {
const $ = PF.$;
// process: the line fills with scroll and each step lights up in turn
const stepsEl = $("steps"), steps = [...stepsEl.children];
steps.forEach(s => s.classList.add("dim"));
const paintSteps = st => {
  stepsEl.style.setProperty("--p", st.progress);
  steps.forEach((s, i) => s.classList.toggle("on", st.progress >= i / steps.length));
};
ScrollTrigger.create({ trigger:stepsEl, start:"top 75%", end:"bottom 60%", onUpdate:paintSteps, onRefresh:paintSteps });
};
