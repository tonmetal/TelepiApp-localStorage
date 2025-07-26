const resultado = document.getElementById("resultado")
const horasa = document.getElementById("horas")
const pedidosa = document.getElementById("pedidos")
const bara = document.getElementById("bar")
const vacacionesa = document.getElementById("vacaciones")
const guardar = document.getElementById("guardar")
const reiniciar = document.getElementById("reiniciar")
const borrar = document.getElementById("borrar")
const reseteo = document.getElementById("resetear")
const nomina = document.getElementById("nominas")
const ver = document.getElementById("btn-nom")
const cierre = document.getElementById("cierre")
const overlay = document.getElementById("overlay")
let historial = document.getElementById("historial")

let total = ""
let nominas = []

// Clave para localStorage
const STORAGE_KEY = "nominas_usuario"

// Cargar nóminas desde localStorage
function cargarNominas() {
    const datos = localStorage.getItem(STORAGE_KEY)
    if (datos) {
        try {
            nominas = JSON.parse(datos)
            if (!Array.isArray(nominas)) nominas = []
        } catch {
            nominas = []
        }
    } else {
        nominas = []
    }
    render()
}

// Guardar nóminas en localStorage
function guardarNominas() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nominas))
}

// Calcular total
function calcular() {
    let horas = Number(horasa.value)
    let pedidos = Number(pedidosa.value)
    let bar = Number(bara.value)
    let vacaciones = Number(vacacionesa.value)

    if (horas > 200 || pedidos > 400 || bar > 100 || !Number.isInteger(bar) || !Number.isInteger(pedidos)) {
        return
    }

    let suma = nominas.reduce((acc, val) => acc + Number(val), 0)
    let media = nominas.length ? suma / nominas.length : 0

    if (vacaciones > 0 && nominas.length === 0) {
        alert("Para calcular vacaciones debes guardar al menos una nómina.")
        vacacionesa.value = 0
        return
    }

    if (vacaciones === 0) {
        total = ((horas * 7.67) + (pedidos * 0.48) + (bar * 0.5)).toFixed(2)
    } else if (vacaciones > 0 && vacaciones <= 31) {
        total = ((horas * 7.67) + (pedidos * 0.48) + (bar * 0.5) + (vacaciones * (media / 30))).toFixed(2)
    }

    resultado.textContent = "Total: " + total + "€"
}

horasa.addEventListener("input", calcular)
pedidosa.addEventListener("input", calcular)
bara.addEventListener("input", calcular)
vacacionesa.addEventListener("input", calcular)
reseteo.addEventListener("click", resetear)

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", () => {
        if (input.value === "0") input.value = "";
    })
})

function resetear() {
    horasa.value = 0
    pedidosa.value = 0
    bara.value = 0
    vacacionesa.value = 0
    resultado.textContent = "Total: 0.00€"
}

function render() {
    historial.innerHTML = nominas.slice(0, 6).map(val => `<li>${val} €</li>`).join("")
}

// Guardar la nómina actual
guardar.addEventListener("click", function () {
    if (!total) return

    nominas.unshift(total)

    // Máximo 6 elementos
    if (nominas.length > 6) {
        nominas = nominas.slice(0, 6)
    }

    guardarNominas()
    total = ""
    resetear()
    render()
})

// Borrar la última nómina guardada (más reciente)
borrar.addEventListener("click", function () {
    const confirmado = confirm("¿Estás seguro de que quieres eliminar la última nómina guardada?")
    if (!confirmado) return

    nominas.shift()

    guardarNominas()
    resetear()
    render()
})

// Reiniciar todo
reiniciar.addEventListener("click", function () {
    const confirmado = confirm("¿Seguro que quieres borrar TODO?")
    if (!confirmado) return

    nominas = []
    localStorage.removeItem(STORAGE_KEY)
    resetear()
    render()
})

// Carga inicial
cargarNominas()


ver.addEventListener("click", function(){
    nomina.style.display = "block"
    overlay.style.display = "block"
})

cierre.addEventListener("click", function(){
    nomina.style.display = "none"
    overlay.style.display = "none"
})