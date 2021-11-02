


// Variables............................
var uid = new ShortUniqueId()
let color = ["pink", "blue", "green", "black"];
let cFilter = "";
let deleteMode = false;
let addmode = false;
let defaultColor = "black";



// ................................Add Containers.......................
let mainContainer = document.querySelector(".main_container");
let addContainer = document.querySelector(".add_container");
let modal = document.querySelector(".Input_container");

addContainer.addEventListener("click", function(){
    
    addContainer.classList.add("active");
    removeContainer.classList.remove("active");
    modal.style.display = "flex";
    
    addmode = true;
    
    if( addmode == true){

        let input = document.querySelector(".Input_text_container");
        input.addEventListener("keydown", function(e){
            
            if(e.code == "Enter" && input.value){
                let id = uid();
                // console.log("Value Input: ", input.value);
                creatTask(id, input.value, true, defaultColor);
                modal.style.display = "none";
                addContainer.classList.remove("active");
                input.value = "";
            }
            
        });

        addmode = false;
    }
    
   
    deleteMode = false;
    
});

let allColorElements = document.querySelectorAll(".color_picker");
let colorChooser = document.querySelector(".Input_Color_container");

colorChooser.addEventListener("click", function(e){
    let ele = e.target;
    // console.log(ele);
    if( ele.classList[0] != "Input_Color_container"){
        console.log(ele);
        let ChoosenColor = ele.classList[1];
        defaultColor = ChoosenColor;
        for( let i = 0; i < allColorElements.length; i++){
            allColorElements[i].classList.remove("selected");
        }
        ele.classList.add("selected");
    }

});



function creatTask(id, text, flag, defaultColor){
    
    //  <div class="task-container"></div>
    
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class" , "task_container");
    mainContainer.appendChild(taskContainer);
    
    taskContainer.innerHTML = 
    `<div class="task_header ${defaultColor}"></div>
    <div class="task-main_container">
    <h3 class="task_id">#${id}</h3>
    <div class="task_text" contenteditable="true">${text}</div>
    </div>`
    
    // Change the Color of task_header................................
    let taskHeader = taskContainer.querySelector(".task_header");
    
    taskHeader.addEventListener("click", function(){
        
        // By using classlist, get all classes in the header.
        
        let cColor = taskHeader.classList[1];
        let cColorIdx = color.indexOf(cColor);
        // console.log("cColor: ", cColor);
        
        let NextColorIdx = (cColorIdx + 1) % 4;
        let NextColor = color[NextColorIdx];
        // console.log("NextColor: ", NextColor);
        
        taskHeader.classList.remove(cColor);
        taskHeader.classList.add(NextColor);

        let Idtext = taskHeader.parentNode.children[1].children[0].textContent;
        let Id = Idtext.split("#")[1];
        
        let textString = localStorage.getItem("text");
        let textArr = JSON.parse(textString);
            
        for( let i = 0; i < textArr.length; i++){
            let {id} = textArr[i];
            if(id == Id){
                textArr[i].color = NextColor;
                break;
            }
        }
        localStorage.setItem("text", JSON.stringify(textArr));

        defaultColor = "black"
        
    })
    
    // Adding to local Storage.
    if( flag == true){

        let textString = localStorage.getItem("text");
        let textArr = JSON.parse(textString) || [];
        let textObject = {
            id: id,
            text: text,
            color: defaultColor
        }
        
        textArr.push(textObject);
        localStorage.setItem("text", JSON.stringify(textArr));
        
    }

    //Editing the content in the task_text
    let textcontainer = taskContainer.querySelector(".task-main_container>div");
    textcontainer.addEventListener("blur", function(){
        
        let Idtext = taskHeader.parentNode.children[1].children[0].textContent;
        let Id = Idtext.split("#")[1];
        
        let textString = localStorage.getItem("text");
        let textArr = JSON.parse(textString);
            
        for( let i = 0; i < textArr.length; i++){
            let {id} = textArr[i];
            if(id == Id){
                textArr[i].text = textcontainer.textContent;
                break;
            }
        }
        localStorage.setItem("text", JSON.stringify(textArr));
    })

}   



// ...............................filtering by colors........................
let ColorContainer = document.querySelector(".color-group_container");
ColorContainer.addEventListener("click", function(e){
    let element  = e.target;
    console.log("elementcolor: ", element);
    if( element != ColorContainer){
        let filteredCardColor = element.classList[1];
        filterCards(filteredCardColor);

    }
})

function filterCards(filteredCardColor){
    
    let allTaskCards = document.querySelectorAll(".task_container");
    // console.log(allTaskCards)
    
    if( cFilter != filteredCardColor){
        
        for(let i = 0; i < allTaskCards.length; i++){
            
            let taskHeader = allTaskCards[i].querySelector(".task_header");
            // console.log(taskHeader);
            let taskColor = taskHeader.classList[1];
            
            if(taskColor == filteredCardColor){
                allTaskCards[i].style.display = "block";
            }else{
                allTaskCards[i].style.display = "none";
            }
            
        }
        cFilter = filteredCardColor;
    }else{
        
        for(let i = 0; i < allTaskCards.length; i++){
            allTaskCards[i].style.display = "block";
        }
        cFilter = "";
    }
    
}






//...........................Remove Containers........................................
let removeContainer = document.querySelector(".remove_container");
removeContainer.addEventListener("click", function(){
    
    removeContainer.classList.add("active");
    addContainer.classList.remove("active");
    
    deleteMode = true;
    
    let mainContainer = document.querySelector(".main_container");
    
    mainContainer.addEventListener("click", function(e){
        
        let e1 = e.target;
        console.log("e1: ", e1);
        
        if( deleteMode == true && e1 != mainContainer ){

            let Id = e1.textContent.split("\n")[1].split("#")[1];
            console.log("Id: ", Id);
            
            let textString = localStorage.getItem("text");
            let textArr = JSON.parse(textString);
            
            for( let i = 0; i < textArr.length; i++){
                let {id} = textArr[i];
                if(id == Id){
                    textArr.splice(i, 1);
                    // location.reload();
                }
            }

            localStorage.setItem("text", JSON.stringify(textArr));

            removeContainer.classList.remove("active");
            deleteMode = false;
            
        }else if(e1 == mainContainer){
            removeContainer.classList.remove("active");
            deleteMode = false;
        }
        
    })

    modal.style.display = "none";
    
});



// ..............................Creating the whole task containers after reloading by using local Storage....................
(function (){
    let taskArr = JSON.parse(localStorage.getItem("text")) || [];
    for( let i = 0; i < taskArr.length; i++){
        let {id, text, color} = taskArr[i];
        creatTask(id, text, false, color);
    }
    modal.style.display = "none";
})();

