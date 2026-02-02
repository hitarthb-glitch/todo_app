const routes = {
    'weather': async () => {
        const response = await fetch('weather.html');
        const html = await response.text();
        document.documentElement.innerHTML = html;
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src && !script.src.includes('router.js')) {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.type = script.type || 'text/javascript';
                document.head.appendChild(newScript);
            } else if (!script.src) {
                eval(script.textContent);
            }
        });

        if (typeof initWeather === 'function') {
            initWeather();
        }
    },
    '': async () => {
        const response = await fetch('index.html');
        const html = await response.text();
        document.documentElement.innerHTML = html;
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src && !script.src.includes('router.js')) {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.type = script.type || 'text/javascript';
                document.head.appendChild(newScript);
            } else if (!script.src) {
                eval(script.textContent);
            }
        });
        if (window.reInit) {
            window.reInit();
        }
    },
};

const router = () => {
    const hash = window.location.hash.substring(1);
    const route = routes[hash];
    if (route) {
        route();
    }
};


document.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
        e.preventDefault();
        window.location.hash = e.target.getAttribute('href').substring(1);
    }
});

window.addEventListener('hashchange', router);

document.addEventListener('DOMContentLoaded', router);
