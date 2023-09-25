export const draggable = (node) => {
    let x;
    let y;

    function handleMousedown(event) {
        if (event.button !== 0) return;

        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(
            new CustomEvent('dragstart', {
                detail: { x, y }
            })
        );

        window.addEventListener('mousemove', handleMousemove);
        window.addEventListener('mouseup', handleMouseup);
    }

    function handleMousemove(event) {
        const dx = event.clientX - x;
        const dy = event.clientY - y;

        node.dispatchEvent(
            new CustomEvent('dragmove', {
                detail: { x: event.clientX, y: event.clientY, dx, dy }
            })
        );

        x = event.clientX;
        y = event.clientY;
    }

    function handleMouseup(event) {
        x = event.clientX;
        y = event.clientY;

        node.dispatchEvent(
            new CustomEvent('dragend', {
                detail: { x, y }
            })
        );

        window.removeEventListener('mousemove', handleMousemove);
        window.removeEventListener('mouseup', handleMouseup);
    }

    node.addEventListener('mousedown', handleMousedown);

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMousedown);
        }
    };
}