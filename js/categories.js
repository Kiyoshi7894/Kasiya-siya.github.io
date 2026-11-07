 // Select all grid container divs inside category sections
  const categoryGrids = document.querySelectorAll(".category-section > div:nth-child(2)");

  categoryGrids.forEach((grid) => {
    // Add the CSS class for horizontal scrolling
    grid.classList.add("horizontal-scroll-container");

    // Enable mouse wheel horizontal scrolling
    grid.addEventListener("wheel", (evt) => {
      if (evt.deltaY !== 0) {
        evt.preventDefault();
        grid.scrollLeft += evt.deltaY * 1.5;
      }
    }, { passive: false });

    // Enable drag-to-scroll with mouse
    let isDown = false;
    let startX;
    let scrollLeft;

    grid.addEventListener("mousedown", (e) => {
      isDown = true;
      grid.classList.add("active");
      startX = e.pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
    });

    grid.addEventListener("mouseleave", () => {
      isDown = false;
    });

    grid.addEventListener("mouseup", () => {
      isDown = false;
    });

    grid.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - grid.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed factor
      grid.scrollLeft = scrollLeft - walk;
    });
  });
