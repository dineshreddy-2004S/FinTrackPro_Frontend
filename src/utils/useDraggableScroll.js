import { useRef, useEffect } from 'react';

export function useDraggableScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleMouseDown = (e) => {
      // Don't drag if clicking buttons, inputs, or selects
      if (['BUTTON', 'INPUT', 'SELECT', 'A', 'SVG', 'PATH'].includes(e.target.tagName)) return;
      isDown = true;
      el.classList.add('cursor-grabbing');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      el.classList.remove('cursor-grabbing');
    };

    const handleMouseUp = () => {
      isDown = false;
      el.classList.remove('cursor-grabbing');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // Drag speed multiplier
      el.scrollLeft = scrollLeft - walk;
    };

    // Also support native Shift + Mouse Wheel or regular wheel horizontal tilt
    const handleWheel = (e) => {
      if (e.deltaY !== 0 && !e.shiftKey && el.scrollWidth > el.clientWidth) {
        // If the table can be scrolled horizontally and cursor is over it
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
          el.scrollLeft += e.deltaY;
        }
      }
    };

    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return ref;
}