const scrollToMainEvent = () => {
  const element = document.getElementById("target-scroll");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default scrollToMainEvent;
