const API_KEY="88d4c87f38d38d1c63dfe2ada5f8cc2e"
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const message = document.getElementById("message");
const loadMsg=document.getElementById("loading");
const weatherIcon = document.getElementById("weatherIcon");
const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const weatherBox = document.getElementById("weatherBox");

loadMsg.style.display="none";
message.style.display="none";
weatherBox.style.display="none";

// Weather icon mapping
function getWeatherIcon(weatherMain) {
    const iconMap = {
        'Clear': 'fa-sun',
        'Clouds': 'fa-cloud',
        'Rain': 'fa-cloud-rain',
        'Drizzle': 'fa-cloud-rain',
        'Thunderstorm': 'fa-cloud-bolt',
        'Snow': 'fa-snowflake',
        'Mist': 'fa-smog',
        'Smoke': 'fa-smog',
        'Haze': 'fa-smog',
        'Fog': 'fa-smog'
    };
    return iconMap[weatherMain] || 'fa-cloud';
}
async function getWeather(city){
    loadMsg.style.display="block";
    weatherBox.style.display="none";
    
    try{
        message.style.display="none";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        
        if(!response.ok){
            throw new Error("City not found. Please try again");
        }

        const data=await response.json();
        
        // Update main weather info
        cityName.textContent=data.name;
        const tempCelsius=(data.main.temp - 273.15).toFixed(1);
        temperature.textContent=`${tempCelsius}\u00b0C`;
        description.textContent=data.weather[0].description;
        
        // Update weather icon
        weatherIcon.className = `fas ${getWeatherIcon(data.weather[0].main)}`;
        
        // Update additional details
        windSpeed.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
        humidity.textContent = `${data.main.humidity}%`;
        const feelsLikeCelsius = (data.main.feels_like - 273.15).toFixed(1);
        feelsLike.textContent = `${feelsLikeCelsius}\u00b0C`;
        
        // Show weather box
        weatherBox.style.display="block";
        
        localStorage.setItem("lastCity",data.name);
    }
    catch(error){
        cityInput.value="";
        weatherBox.style.display="none";
        message.textContent=`${error.message}`;
        message.style.display="block";
        setTimeout(()=>{
            message.style.display="none";
        },3000);
    } 
    finally{
        loadMsg.style.display="none";
    }
}

searchBtn.addEventListener("click",()=>{
    const city=cityInput.value.trim();
    if(!city){
        message.textContent=`Please enter a city name`;
        message.style.display="block";
        setTimeout(()=>{
            message.style.display="none";
        },3000);
        return;
    }
    getWeather(city);
});

const savedCity = localStorage.getItem("lastCity");
if(savedCity){
    getWeather(savedCity)
}

cityInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        searchBtn.click();
    }
})