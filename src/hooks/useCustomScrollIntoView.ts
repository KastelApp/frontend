const useCustomScrollIntoView = (options = { duration: 1000, smooth: true }) => {
  const scrollIntoView = (id: string, containerId: string, overrides?: { duration?: number; smooth?: boolean; }) => {
    const element = document.getElementById(id);
    const containerElement = document.getElementById(containerId);

    if (!element || !containerElement) return;

    const start = window.scrollY;
    const end = element.getBoundingClientRect().top + start;
    const duration = overrides?.duration || options.duration;
    const smooth = overrides?.smooth ?? options.smooth;
    const startTime = performance.now();

    const easeInOutQuad = (time: number, startValue: number, changeInValue: number, duration: number) => {
      time /= duration / 2;
      if (time < 1) return (changeInValue / 2) * time * time + startValue;
      time--;
      return (-changeInValue / 2) * (time * (time - 2) - 1) + startValue;
    };

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const nextScrollPosition = easeInOutQuad(
        elapsedTime,
        start,
        end - start,
        duration
      );

      console.log(-nextScrollPosition);

      containerElement.scrollTop = (-nextScrollPosition) - element.offsetHeight * 3;

      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    if (smooth) {
      requestAnimationFrame(animateScroll);
    } else {
      containerElement.scrollTop = -end;
    }
  };

  return scrollIntoView;
};

export default useCustomScrollIntoView;