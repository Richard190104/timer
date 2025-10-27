
function displayWeatherIcon(message) {
    const icon = document.createElement('img');
    icon.src = "https:" + message.current.condition.icon;
    icon.style.width = '50px';
    icon.style.height = '50px';
    const weatherInfoDiv = document.querySelector('.weather-info');
    weatherInfoDiv.appendChild(icon);
}

let weatherInfo = {};

fetch("https://timer-backend-24n3.vercel.app/api/getWeather").then(res => res.json()).then(data => {
    if (data.message) {
        weatherInfo = data.weather;
        displayWeatherIcon(weatherInfo);
    }
});

const weatherInfoDiv = document.querySelector('.weather-info');

function displayAlert(data){
    const existing = document.querySelector('.weather-alert');
    if (existing) existing.remove();

    const alertDiv = document.createElement('div');
    alertDiv.className = 'weather-alert';
    Object.assign(alertDiv.style, {
        position: 'fixed',
        background: '#222',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        zIndex: 10000,
        maxWidth: '500px',
        fontSize: '20px',
        lineHeight: '1.2'
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '6px',
        right: '8px',
        background: 'transparent',
        border: 'none',
        color: '#fff',
        fontSize: '18px',
        cursor: 'pointer',
        padding: '0',
        lineHeight: '1'
    });
    closeBtn.setAttribute('aria-label', 'Close weather alert');
    closeBtn.addEventListener('click', () => alertDiv.remove());

    const content = document.createElement('div');
    content.style.paddingRight = '22px';

    const parts = [];
    parts.push('Keby si nahodou nemal okno tak tu mas pocasie jake je teraz.');
    if (data?.location?.name) parts.push(data.location.name);
    if (data?.current?.temp_c != null) parts.push(`${data.current.temp_c}°C`);
    else if (data?.current?.temp_f != null) parts.push(`${data.current.temp_f}°F`);
    if (data?.current?.condition?.text) parts.push(data.current.condition.text);
    let weathericon = document.createElement('img');
    weathericon.src = "https:" + data.current.condition.icon;
    weathericon.style.width = '50px';
    weathericon.style.height = '50px';
    parts.forEach((part, index) => {
        let partDiv = document.createElement('p');
        content.appendChild(partDiv);
        partDiv.textContent = part;
    });
        content.appendChild(weathericon);

    alertDiv.appendChild(content);
    alertDiv.appendChild(closeBtn);

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        if (alertDiv.parentNode) alertDiv.remove();
    }, 8000);
}

weatherInfoDiv.addEventListener('click', () => {
    displayAlert(weatherInfo);
});
