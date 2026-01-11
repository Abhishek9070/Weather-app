const API_KEY="88d4c87f38d38d1c63dfe2ada5f8cc2e"
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const message = document.getElementById("message");
const loadMsg=document.getElementById("loading")
loadMsg.style.color="blue"
loadMsg.style.display="none"
message.style.color="red"
message.style.display="none"
async function getWeather(city){
    loadMsg.textContent="Loading..."
    loadMsg.style.display="block"
    
    try{
        message.textContent=""
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    if(!response.ok){
        throw new Error("City not found . Please try again");
    }

    const data=await response.json();
    cityName.textContent=data.name;
    const tempCelsius=(data.main.temp - 273.15).toFixed(1)
    temperature.textContent=`${tempCelsius} °C`
    description.textContent=data.weather[0].description;
    localStorage.setItem("lastCity",data.name)
    
    }
    catch(error){
        cityInput.value=""
        cityName.textContent = "";
        temperature.textContent = "";
        description.textContent = "";
        message.textContent=`${error}`
        message.style.display="block";
        setTimeout(()=>{
            message.style.display="none"
        },2000)  
        
    } finally{
        loadMsg.style.display="none"
        }
    
}

searchBtn.addEventListener("click",()=>{
    const city=cityInput.value.trim();
    if(!city){
        message.textContent=`Please enter a city name`;
        message.style.display="block";
        setTimeout(()=>{
            message.style.display="none"
        },2000)  
        return;
    };
    getWeather(city)
})

const savedCity = localStorage.getItem("lastCity");
if(savedCity){
    getWeather(savedCity)
}

cityInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        searchBtn.click();
    }
})