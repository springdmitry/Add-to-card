import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import catImgUrl from "/assets/cat.png"

const appSettings = {
    databaseURL: "https://realtime-database-65647-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
let kittyImg = document.getElementById("kity-img")

const clickedEl = []

inputFieldEl.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        addButtonEl.click()    
    }
    
})

addButtonEl.addEventListener("click", function() {
    if (inputFieldEl.value) {
        let inputValue = inputFieldEl.value
        
        push(shoppingListInDB, inputValue)
    
        clearInputFieldEl()
    }
    
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        
        kittyImg.src = catImgUrl
        
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        kittyImg.src = "https://media.tenor.com/dhrNy57Vag0AAAAi/bunny-cute.gif"
        shoppingListEl.innerHTML = `<li><strong>Список порожній...</strong></li>`
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    newEl.setAttribute("id", itemID)

    if (clickedEl.includes(newEl.id)) {
        newEl.setAttribute("class", "clicked")    
    }
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}

shoppingListEl.addEventListener("click", function(e){
    
    if (!clickedEl.includes(e.target.id)) {
        clickedEl.push(e.target.id)
    } else {
        const index = clickedEl.indexOf(e.target.id)
        if (index != -1) {
            clickedEl.splice(index, 1)
        }
    }
    
    document.getElementById(`${e.target.id}`).classList.toggle("clicked")
})
