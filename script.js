let filters = {
    brightness: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    contrast: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    saturation: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    hueRotation: {
        value: 0,
        min: 0,
        max: 360,
        unit: "deg"
    },
    blur: {
        value: 0,
        min: 0,
        max: 20,
        unit: "px"
    },
    grayscale: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    sepia: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    opacity: {
        value: 100,
        min: 0,
        max: 100,
        unit: "%"
    },
    invert: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
}

const imageCanvas = document.querySelector("#image-canvas")
const imageInput = document.querySelector("#image-input")
const canvasCtx = imageCanvas.getContext("2d")
const resetButton = document.querySelector("#reset-btn")
const downloadButton = document.querySelector("#download-btn")
const presetsContainer = document.querySelector(".presets")


let file = null
let image = null

const filtersContainer = document.querySelector(".filters");

function createFilterElement(name, unit="%", value, min, max) {
    const div = document.createElement("div")
    div.classList.add("filter")

    const input = document.createElement("input")
    input.type = "range"
    input.min = min
    input.max = max
    input.value = value
    input.id = name
    
    const p = document.createElement("p")
    p.innerText = name

    div.appendChild(p)
    div.appendChild(input)

    input.addEventListener("input", (event) => {
        filters[name].value = event.target.value
        applyFilters()
    })

    return div
};

function createFilters() {
    Object.keys(filters).forEach(key => {
    const filterElement = createFilterElement(
        key, 
        filters[key].unit,
        filters[key].value,
        filters[key].min,
        filters[key].max,
    )
    console.log(filterElement);

    filtersContainer.appendChild(filterElement);
});
}
createFilters()

imageInput.addEventListener("change", (event) => {
    file = event.target.files[0]
    const imagePlaceholder = document.querySelector(".placeholder")
    imageCanvas.style.display = "block"
    imagePlaceholder.style.display = "none"
    
    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
        image = img

        imageCanvas.width = img.width
        imageCanvas.height = img.height
        canvasCtx.drawImage(img, 0, 0)
    }
})

function applyFilters() {
    canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height)
    canvasCtx.filter = `
    brightness(${filters.brightness.value}${filters.brightness.unit})
    contrast(${filters.contrast.value}${filters.contrast.unit})
    saturate(${filters.saturation.value}${filters.saturation.unit})
    hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
    blur(${filters.blur.value}${filters.blur.unit})
    grayscale(${filters.grayscale.value}${filters.grayscale.unit})
    sepia(${filters.sepia.value}${filters.sepia.unit})
    opacity(${filters.opacity.value}${filters.opacity.unit})
    invert(${filters.invert.value}${filters.invert.unit})
    `
    canvasCtx.drawImage(image, 0, 0)
}

resetButton.addEventListener("click", () => {
    // Object.keys(filters).forEach(key => {
    //     filters[key].value =  key === "hueRotation" ? 0 : 100
    //     const input = document.getElementById(key)
    //     input.value = filters[key].value
    // })
    filters = {
    brightness: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    contrast: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    saturation: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    hueRotation: {
        value: 0,
        min: 0,
        max: 360,
        unit: "deg"
    },
    blur: {
        value: 0,
        min: 0,
        max: 20,
        unit: "px"
    },
    grayscale: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    sepia: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
    opacity: {
        value: 100,
        min: 0,
        max: 100,
        unit: "%"
    },
    invert: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    },
}
    applyFilters()

    filtersContainer.innerHTML = ""
    createFilters()
})

downloadButton.addEventListener("click", () => {
    const link = document.createElement("a")
    link.download = "edited-image.png"
    link.href = imageCanvas.toDataURL()
    link.click()
})

const presets = {
    vintage: {
        brightness: { value: 110, min: 0, max: 200, unit: "%" },
        contrast: { value: 95, min: 0, max: 200, unit: "%" },
        saturation: { value: 85, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 10, min: 0, max: 360, unit: "deg" },
        blur: { value: 0, min: 0, max: 20, unit: "px" },
        grayscale: { value: 15, min: 0, max: 100, unit: "%" },
        sepia: { value: 40, min: 0, max: 100, unit: "%" },
        opacity: { value: 100, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    },
    
    drama: {
        brightness: { value: 90, min: 0, max: 200, unit: "%" },
        contrast: { value: 140, min: 0, max: 200, unit: "%" },
        saturation: { value: 110, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
        blur: { value: 0, min: 0, max: 20, unit: "px" },
        grayscale: { value: 20, min: 0, max: 100, unit: "%" },
        sepia: { value: 0, min: 0, max: 100, unit: "%" },
        opacity: { value: 100, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    },
    
    oldSchool: {
        brightness: { value: 105, min: 0, max: 200, unit: "%" },
        contrast: { value: 110, min: 0, max: 200, unit: "%" },
        saturation: { value: 70, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 15, min: 0, max: 360, unit: "deg" },
        blur: { value: 0.5, min: 0, max: 20, unit: "px" },
        grayscale: { value: 30, min: 0, max: 100, unit: "%" },
        sepia: { value: 60, min: 0, max: 100, unit: "%" },
        opacity: { value: 100, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    },
    
    noir: {
        brightness: { value: 90, min: 0, max: 200, unit: "%" },
        contrast: { value: 150, min: 0, max: 200, unit: "%" },
        saturation: { value: 0, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
        blur: { value: 0, min: 0, max: 20, unit: "px" },
        grayscale: { value: 100, min: 0, max: 100, unit: "%" },
        sepia: { value: 0, min: 0, max: 100, unit: "%" },
        opacity: { value: 100, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    },
    
    dreamy: {
        brightness: { value: 115, min: 0, max: 200, unit: "%" },
        contrast: { value: 85, min: 0, max: 200, unit: "%" },
        saturation: { value: 80, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 5, min: 0, max: 360, unit: "deg" },
        blur: { value: 1.5, min: 0, max: 20, unit: "px" },
        grayscale: { value: 10, min: 0, max: 100, unit: "%" },
        sepia: { value: 5, min: 0, max: 100, unit: "%" },
        opacity: { value: 95, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    },
    
    vibrant: {
        brightness: { value: 105, min: 0, max: 200, unit: "%" },
        contrast: { value: 110, min: 0, max: 200, unit: "%" },
        saturation: { value: 150, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
        blur: { value: 0, min: 0, max: 20, unit: "px" },
        grayscale: { value: 0, min: 0, max: 100, unit: "%" },
        sepia: { value: 0, min: 0, max: 100, unit: "%" },
        opacity: { value: 100, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    },
    
    faded: {
        brightness: { value: 105, min: 0, max: 200, unit: "%" },
        contrast: { value: 85, min: 0, max: 200, unit: "%" },
        saturation: { value: 70, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
        blur: { value: 0, min: 0, max: 20, unit: "px" },
        grayscale: { value: 20, min: 0, max: 100, unit: "%" },
        sepia: { value: 15, min: 0, max: 100, unit: "%" },
        opacity: { value: 90, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    },
    
    cool: {
        brightness: { value: 100, min: 0, max: 200, unit: "%" },
        contrast: { value: 100, min: 0, max: 200, unit: "%" },
        saturation: { value: 110, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 20, min: 0, max: 360, unit: "deg" },
        blur: { value: 0, min: 0, max: 20, unit: "px" },
        grayscale: { value: 0, min: 0, max: 100, unit: "%" },
        sepia: { value: 0, min: 0, max: 100, unit: "%" },
        opacity: { value: 100, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    },
    
    warm: {
        brightness: { value: 105, min: 0, max: 200, unit: "%" },
        contrast: { value: 100, min: 0, max: 200, unit: "%" },
        saturation: { value: 110, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 340, min: 0, max: 360, unit: "deg" },
        blur: { value: 0, min: 0, max: 20, unit: "px" },
        grayscale: { value: 0, min: 0, max: 100, unit: "%" },
        sepia: { value: 10, min: 0, max: 100, unit: "%" },
        opacity: { value: 100, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    },
    
    soft: {
        brightness: { value: 105, min: 0, max: 200, unit: "%" },
        contrast: { value: 90, min: 0, max: 200, unit: "%" },
        saturation: { value: 90, min: 0, max: 200, unit: "%" },
        hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
        blur: { value: 1, min: 0, max: 20, unit: "px" },
        grayscale: { value: 5, min: 0, max: 100, unit: "%" },
        sepia: { value: 5, min: 0, max: 100, unit: "%" },
        opacity: { value: 100, min: 0, max: 100, unit: "%" },
        invert: { value: 0, min: 0, max: 100, unit: "%" }
    }
};

Object.keys(presets).forEach(presetName => {
    const presetButton = document.createElement("button");
    presetButton.classList.add("btn");
    presetButton.innerText = presetName;
    presetsContainer.appendChild(presetButton);

    presetButton.addEventListener("click", () => {
        const preset = presets[presetName]
        
        Object.keys(preset).forEach(filterName => {
            filters[filterName].value = preset[filterName].value
        })

        applyFilters()

        filtersContainer.innerHTML = ""
        createFilters()
    })
});