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

// DOM Elements
const imageCanvas = document.querySelector("#image-canvas")
const imageInput = document.querySelector("#image-input")
const canvasCtx = imageCanvas.getContext("2d")
const resetButton = document.querySelector("#reset-btn")
const downloadButton = document.querySelector("#download-btn")
const presetsContainer = document.querySelector("#presets-container")
const filtersContainer = document.querySelector("#filters-container")
const imagePlaceholder = document.querySelector(".placeholder")
const imageInfo = document.querySelector("#image-info")
const imageNameSpan = document.querySelector("#image-name")
const imageDimensionsSpan = document.querySelector("#image-dimensions")
const imageSizeSpan = document.querySelector("#image-size")
const scrollTopBtn = document.querySelector("#scroll-top")
const collapseFiltersBtn = document.querySelector("#collapse-filters")
const rotateLeftBtn = document.querySelector("#rotate-left-btn")
const rotateRightBtn = document.querySelector("#rotate-right-btn")
const flipHorizontalBtn = document.querySelector("#flip-horizontal-btn")
const flipVerticalBtn = document.querySelector("#flip-vertical-btn")
const resetAllBtn = document.querySelector("#reset-all-btn")

// State
let file = null
let image = null
let rotation = 0
let flippedH = false
let flippedV = false

// Initialize filters
createFilters()

// Scroll to top button visibility
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add("show")
    } else {
        scrollTopBtn.classList.remove("show")
    }
})

// Scroll to top functionality
scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
})

// Collapse filters (toggle)
let filtersCollapsed = false
collapseFiltersBtn.addEventListener("click", () => {
    filtersCollapsed = !filtersCollapsed
    filtersContainer.style.display = filtersCollapsed ? "none" : "flex"
    collapseFiltersBtn.innerHTML = filtersCollapsed ? 
        '<i class="ri-add-line"></i>' : 
        '<i class="ri-subtract-line"></i>'
})

// Create filter element
function createFilterElement(name, unit = "%", value, min, max) {
    const div = document.createElement("div")
    div.classList.add("filter")

    const input = document.createElement("input")
    input.type = "range"
    input.min = min
    input.max = max
    input.value = value
    input.id = name
    
    const p = document.createElement("p")
    p.innerText = name.replace(/([A-Z])/g, ' $1').trim() // Add space before capital letters

    div.appendChild(p)
    div.appendChild(input)

    input.addEventListener("input", (event) => {
        filters[name].value = event.target.value
        applyFilters()
    })

    return div
}

// Create all filters
function createFilters() {
    filtersContainer.innerHTML = ""
    Object.keys(filters).forEach(key => {
        const filterElement = createFilterElement(
            key, 
            filters[key].unit,
            filters[key].value,
            filters[key].min,
            filters[key].max,
        )
        filtersContainer.appendChild(filterElement)
    })
}

// Image input handler
imageInput.addEventListener("change", (event) => {
    file = event.target.files[0]
    if (!file) return
    
    imageCanvas.style.display = "block"
    imagePlaceholder.style.display = "none"
    imageInfo.style.display = "flex"
    
    // Update image info
    imageNameSpan.textContent = file.name
    imageSizeSpan.textContent = formatFileSize(file.size)
    
    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
        image = img
        imageDimensionsSpan.textContent = `${img.width} x ${img.height}`
        
        imageCanvas.width = img.width
        imageCanvas.height = img.height
        canvasCtx.drawImage(img, 0, 0)
        
        // Reset transformations
        rotation = 0
        flippedH = false
        flippedV = false
    }
})

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Apply filters to canvas
function applyFilters() {
    if (!image) return
    
    canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height)
    
    // Apply transformations
    canvasCtx.save()
    
    // Translate to center for rotation
    canvasCtx.translate(imageCanvas.width / 2, imageCanvas.height / 2)
    
    // Apply rotation
    canvasCtx.rotate(rotation * Math.PI / 180)
    
    // Apply flips
    let scaleX = flippedH ? -1 : 1
    let scaleY = flippedV ? -1 : 1
    canvasCtx.scale(scaleX, scaleY)
    
    // Draw image
    canvasCtx.drawImage(image, -imageCanvas.width / 2, -imageCanvas.height / 2)
    canvasCtx.restore()
    
    // Apply filters
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
    
    // Redraw with filters
    canvasCtx.drawImage(imageCanvas, 0, 0)
}

// Reset filters to default
resetButton.addEventListener("click", () => {
    // Reset values
    Object.keys(filters).forEach(key => {
        if (key === "hueRotation" || key === "blur" || key === "grayscale" || 
            key === "sepia" || key === "invert") {
            filters[key].value = 0
        } else {
            filters[key].value = 100
        }
    })
    
    applyFilters()
    createFilters() // Update input elements
})

// Reset all (including transformations)
resetAllBtn.addEventListener("click", () => {
    rotation = 0
    flippedH = false
    flippedV = false
    resetButton.click() // Trigger filter reset
})

// Download image
downloadButton.addEventListener("click", () => {
    if (!image) {
        alert("Please select an image first")
        return
    }
    
    const link = document.createElement("a")
    link.download = "edited-image.png"
    link.href = imageCanvas.toDataURL("image/png")
    link.click()
})

// Rotation handlers
rotateLeftBtn.addEventListener("click", () => {
    rotation = (rotation - 90) % 360
    applyFilters()
})

rotateRightBtn.addEventListener("click", () => {
    rotation = (rotation + 90) % 360
    applyFilters()
})

// Flip handlers
flipHorizontalBtn.addEventListener("click", () => {
    flippedH = !flippedH
    applyFilters()
})

flipVerticalBtn.addEventListener("click", () => {
    flippedV = !flippedV
    applyFilters()
})

// Presets
const presets = {
    vintage: {
        brightness: { value: 110 },
        contrast: { value: 95 },
        saturation: { value: 85 },
        hueRotation: { value: 10 },
        blur: { value: 0 },
        grayscale: { value: 15 },
        sepia: { value: 40 },
        opacity: { value: 100 },
        invert: { value: 0 }
    },
    
    drama: {
        brightness: { value: 90 },
        contrast: { value: 140 },
        saturation: { value: 110 },
        hueRotation: { value: 0 },
        blur: { value: 0 },
        grayscale: { value: 20 },
        sepia: { value: 0 },
        opacity: { value: 100 },
        invert: { value: 0 }
    },
    
    oldSchool: {
        brightness: { value: 105 },
        contrast: { value: 110 },
        saturation: { value: 70 },
        hueRotation: { value: 15 },
        blur: { value: 0.5 },
        grayscale: { value: 30 },
        sepia: { value: 60 },
        opacity: { value: 100 },
        invert: { value: 0 }
    },
    
    noir: {
        brightness: { value: 90 },
        contrast: { value: 150 },
        saturation: { value: 0 },
        hueRotation: { value: 0 },
        blur: { value: 0 },
        grayscale: { value: 100 },
        sepia: { value: 0 },
        opacity: { value: 100 },
        invert: { value: 0 }
    },
    
    dreamy: {
        brightness: { value: 115 },
        contrast: { value: 85 },
        saturation: { value: 80 },
        hueRotation: { value: 5 },
        blur: { value: 1.5 },
        grayscale: { value: 10 },
        sepia: { value: 5 },
        opacity: { value: 95 },
        invert: { value: 0 }
    },
    
    vibrant: {
        brightness: { value: 105 },
        contrast: { value: 110 },
        saturation: { value: 150 },
        hueRotation: { value: 0 },
        blur: { value: 0 },
        grayscale: { value: 0 },
        sepia: { value: 0 },
        opacity: { value: 100 },
        invert: { value: 0 }
    },
    
    faded: {
        brightness: { value: 105 },
        contrast: { value: 85 },
        saturation: { value: 70 },
        hueRotation: { value: 0 },
        blur: { value: 0 },
        grayscale: { value: 20 },
        sepia: { value: 15 },
        opacity: { value: 90 },
        invert: { value: 0 }
    },
    
    cool: {
        brightness: { value: 100 },
        contrast: { value: 100 },
        saturation: { value: 110 },
        hueRotation: { value: 20 },
        blur: { value: 0 },
        grayscale: { value: 0 },
        sepia: { value: 0 },
        opacity: { value: 100 },
        invert: { value: 0 }
    },
    
    warm: {
        brightness: { value: 105 },
        contrast: { value: 100 },
        saturation: { value: 110 },
        hueRotation: { value: 340 },
        blur: { value: 0 },
        grayscale: { value: 0 },
        sepia: { value: 10 },
        opacity: { value: 100 },
        invert: { value: 0 }
    },
    
    soft: {
        brightness: { value: 105 },
        contrast: { value: 90 },
        saturation: { value: 90 },
        hueRotation: { value: 0 },
        blur: { value: 1 },
        grayscale: { value: 5 },
        sepia: { value: 5 },
        opacity: { value: 100 },
        invert: { value: 0 }
    }
}

// Create preset buttons
Object.keys(presets).forEach(presetName => {
    const presetButton = document.createElement("button")
    presetButton.classList.add("btn")
    presetButton.innerText = presetName.replace(/([A-Z])/g, ' $1').trim()
    presetsContainer.appendChild(presetButton)

    presetButton.addEventListener("click", () => {
        const preset = presets[presetName]
        
        Object.keys(preset).forEach(filterName => {
            if (filters[filterName]) {
                filters[filterName].value = preset[filterName].value
            }
        })

        applyFilters()
        createFilters() // Update input elements
    })
})

// Newsletter form (prevent submission)
document.querySelector(".newsletter-form")?.addEventListener("submit", (e) => {
    e.preventDefault()
    const input = e.target.querySelector("input")
    if (input.value) {
        alert("Thank you for subscribing! (Demo feature)")
        input.value = ""
    }
})