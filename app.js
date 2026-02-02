
import { init, renderTodos } from './ui.js';


init();
renderTodos();


window.reInit = () => {
    init();
    renderTodos();
};
