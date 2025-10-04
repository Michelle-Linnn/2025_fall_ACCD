let cbox = document.getElementById("colorBox");
let colorBtn = document.getElementById("changecolor")
let imgBox = document.getElementById("Rainboaimage")
let ImageBtn =document.getElementById("toggleImage")

let assignRandomColor = function()
{
    let rCopm = 255 * Math.random()
    let gComp = 255 * Math.random()
    let bComp = 255 * Math.random()
    cbox.style.backgroundColor ="rgb("+ rCopm +","+gComp+","+bComp+")"
}

const toggleRainboaImage = ()=>
{
    console.log(imgBox.src)
    if(imgBox.src.includes("Rainboa"))
    {
        imgBox.src = "images/abc.png"
    }
    else
    {
        imgBox.src="images/Rainboa.webp"
    }
}
ImageBtn.addEventListener("click", toggleRainboaImage)
colorBtn.addEventListener("click", assignRandomColor)