let selectedElement = null;

// allows the user to choose a figure to modify
function addClickEventToSVGElements() {
    const svgContainer = document.getElementById('svgContainer');
    const svgElements = getNonGroupSVGElements(svgContainer);

    svgElements.forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.stopPropagation();
            console.log("clicked");
            if (selectedElement !== null) {
                selectedElement.classList.remove('selected');
            }
            
            selectedElement = element;
            selectedElement.classList.add('selected');
            
            console.log("Selected element type: " + getSelectedElementType());
            addAttributeModifierButtons();
            enableElementDrag();
            addCopyPasteDeleteEvents()
        });
    });
}

function getNonGroupSVGElements(container) {
    let elements = [];
    function traverse(element) {
        if (element.tagName.toLowerCase() !== 'g') {
            elements.push(element);
        } else {
            Array.from(element.children).forEach(child => traverse(child));
        }
    }
    Array.from(container.querySelectorAll('svg')).forEach(svg => {
        Array.from(svg.children).forEach(child => traverse(child));
    });
    return elements;
}

let copiedElement = null;
let selectedContainerId = 'svg1'; 

// Добавя копиране и поставяне на елементи
function addCopyPasteDeleteEvents() {
    const copyButton = document.createElement('button');
    copyButton.innerText = 'Copy Element';
    copyButton.addEventListener('click', copyElement);
    
    const pasteButton = document.createElement('button');
    pasteButton.innerText = 'Paste Element';
    pasteButton.addEventListener('click', pasteElement);
    
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(pasteButton);

    const svgContainers = Array.from(document.querySelectorAll('#svgContainer > div'));
    const selectContainer = createLabeledDropdown('Select SVG Container:', svgContainers.map((container, index) => `svg${index + 1}`), svgContainers[0].id, function(event) {
        selectedContainerId = event.target.value;
    });
    buttonContainer.appendChild(selectContainer);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete Element';
    deleteButton.addEventListener('click', deleteElement);
    buttonContainer.appendChild(deleteButton);
}

function copyElement() {
    if (selectedElement) {
        copiedElement = selectedElement.cloneNode(true);
        console.log('Element copied:', copiedElement);
    } else {
        alert('No element selected to copy.');
    }
}

function pasteElement() {
    if (copiedElement) {
        const targetContainer = document.getElementById(selectedContainerId);
        if (!targetContainer) {
            alert('Invalid SVG container selected.');
            return;
        }

        const newElement = copiedElement.cloneNode(true);
        newElement.classList.remove('selected');

        // Append the copied element to the selected SVG container
        targetContainer.appendChild(newElement);
        console.log('Element pasted:', newElement);

        // Update click events after pasting new elements
        addClickEventToSVGElements();
    } else {
        alert('No element copied.');
    }
}

function deleteElement() {
    if (selectedElement) {
        selectedElement.parentNode.removeChild(selectedElement);
        selectedElement = null; // Нулираме избрания елемент след изтриването
        const buttonContainer = document.getElementById('buttonContainer');
        buttonContainer.innerHTML = ''; // Изчистваме бутоните за модификация на атрибутите
    } else {
        alert('No element selected to delete.');
    }
}

function addAttributeModifierButtons() {
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = ''; // Изчистване на предишните бутони

    if (selectedElement === null) return;

    // Supported types of elements
    const types = ['rect', 'circle', 'ellipse', 'text', 'path'];

    const currentType = getSelectedElementType();
    // Change element type
    buttonContainer.appendChild(createLabeledDropdown('Element Type:', types, currentType, function(event) {
        changeElementType(event.target.value);
    }));

    // Buttons for common attributes in all figures
    buttonContainer.appendChild(createLabeledInput('Fill Color:', 'color', selectedElement.getAttribute('fill') || '#000000', function(event) {
        selectedElement.setAttribute('fill', event.target.value);
    }));

    buttonContainer.appendChild(createLabeledInput('Stroke Color:', 'color', selectedElement.getAttribute('stroke') || '#000000', function(event) {
        selectedElement.setAttribute('stroke', event.target.value);
    }));

    buttonContainer.appendChild(createLabeledInput('Stroke Width:', 'number', selectedElement.getAttribute('stroke-width') || 1, function(event) {
        selectedElement.setAttribute('stroke-width', event.target.value);
    }));

    // Specific attributes for Rectangle element
    const type = getSelectedElementType();
    if (type === 'rect') {
        buttonContainer.appendChild(createLabeledInput('Width:', 'number', selectedElement.getAttribute('width') || 0, function(event) {
            selectedElement.setAttribute('width', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('Height:', 'number', selectedElement.getAttribute('height') || 0, function(event) {
            selectedElement.setAttribute('height', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('X:', 'number', selectedElement.getAttribute('x') || 0, function(event) {
            selectedElement.setAttribute('x', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('Y:', 'number', selectedElement.getAttribute('y') || 0, function(event) {
            selectedElement.setAttribute('y', event.target.value);
        }));
    }


    // Specific attributes for Circle element
    if (type === 'circle') {
        buttonContainer.appendChild(createLabeledInput('Center X:', 'number', selectedElement.getAttribute('cx') || 0, function(event) {
            selectedElement.setAttribute('cx', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('Center Y:', 'number', selectedElement.getAttribute('cy') || 0, function(event) {
            selectedElement.setAttribute('cy', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('Radius:', 'number', selectedElement.getAttribute('r') || 0, function(event) {
            selectedElement.setAttribute('r', event.target.value);
        }));
    }


    // Specific attributes for Ellipse element
    if (type === 'ellipse') {
        buttonContainer.appendChild(createLabeledInput('Center X:', 'number', selectedElement.getAttribute('cx') || 0, function(event) {
            selectedElement.setAttribute('cx', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('Center Y:', 'number', selectedElement.getAttribute('cy') || 0, function(event) {
            selectedElement.setAttribute('cy', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('Radius X:', 'number', selectedElement.getAttribute('rx') || 0, function(event) {
            selectedElement.setAttribute('rx', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('Radius Y:', 'number', selectedElement.getAttribute('ry') || 0, function(event) {
            selectedElement.setAttribute('ry', event.target.value);
        }));
    }

    // Specific attributes for Text element
    if (type === 'text') {
        buttonContainer.appendChild(createLabeledInput('Text:', 'text', selectedElement.textContent, function(event) {
            selectedElement.textContent = event.target.value;
        }));

        buttonContainer.appendChild(createLabeledInput('Font Size:', 'number', selectedElement.getAttribute('font-size') || 12, function(event) {
            selectedElement.setAttribute('font-size', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('Font Family:', 'text', selectedElement.getAttribute('font-family') || 'Arial', function(event) {
            selectedElement.setAttribute('font-family', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('Text Color:', 'color', selectedElement.getAttribute('fill') || '#000000', function(event) {
            selectedElement.setAttribute('fill', event.target.value);
        }));

         buttonContainer.appendChild(createLabeledInput('X:', 'number', selectedElement.getAttribute('x') || 0, function(event) {
            selectedElement.setAttribute('x', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('Y:', 'number', selectedElement.getAttribute('y') || 0, function(event) {
            selectedElement.setAttribute('y', event.target.value);
        }));
    }

     // Specific attributes for Path element
    if (type === 'path') {
        buttonContainer.appendChild(createLabeledInput('Start point of path X:', 'number', 0, function(event) {
            applyTranslationX(event.target.value);
        }));
    
        buttonContainer.appendChild(createLabeledInput('Start point of path Y:', 'number', 0, function(event) {
            applyTranslationY(event.target.value);
        }));
    }

    buttonContainer.appendChild(createLabeledInput('Rotation (degrees):', 'number', selectedElement.getAttribute('transform') ? getRotation(selectedElement.getAttribute('transform')) : 0, function(event) {
        applyRotation(event.target.value);
    }));

    // Buttons for forward and backward movement
    /*const moveForwardButton = document.createElement('button');
    moveForwardButton.innerText = 'Move Forward';
    moveForwardButton.addEventListener('click', moveElementForward);
    buttonContainer.appendChild(moveForwardButton);

    const moveBackwardButton = document.createElement('button');
    moveBackwardButton.innerText = 'Move Backward';
    moveBackwardButton.addEventListener('click', moveElementBackward);
    buttonContainer.appendChild(moveBackwardButton);
    */

    const animationTypes = ['translate', 'scale', 'rotate', 'color'];
    animationTypes.forEach(type => {
        const animateButton = document.createElement('button');
        animateButton.innerText = `Animate ${type.charAt(0).toUpperCase() + type.slice(1)}`;

        animateButton.addEventListener('click', () => showAnimationSettings(type));
        buttonContainer.appendChild(animateButton);
    });
}

// return the type of figure
function getSelectedElementType() {
    if (selectedElement !== null) {
        return selectedElement.tagName.toLowerCase();
    }
    return null;
}

// Change the selected element's type
function changeElementType(newType) {ь
    if (selectedElement === null) return;

    const newElement = document.createElementNS('http://www.w3.org/2000/svg', newType);

    // Copy common attributes
    const commonAttributes = ['fill', 'stroke', 'stroke-width'];
    commonAttributes.forEach(attr => {
        if (selectedElement.hasAttribute(attr)) {
            newElement.setAttribute(attr, selectedElement.getAttribute(attr));
        }
    });

    const bbox = selectedElement.getBBox();
    const x = bbox.x;
    const y = bbox.y;
    const width = bbox.width;
    const height = bbox.height;

    // Copy specific attributes based on new type
    if (newType === 'rect') {
        newElement.setAttribute('width', width);
        newElement.setAttribute('height', height);
        newElement.setAttribute('x', x);
        newElement.setAttribute('y', y);
    } else if (newType === 'circle') {
        newElement.setAttribute('cx', x + width / 2);
        newElement.setAttribute('cy', y + height / 2);
        newElement.setAttribute('r', Math.min(width, height) / 2);
    } else if (newType === 'ellipse') {
        newElement.setAttribute('cx', x + width / 2);
        newElement.setAttribute('cy', y + height / 2);
        newElement.setAttribute('rx', width / 2);
        newElement.setAttribute('ry', height / 2);
    } else if (newType === 'text') {
        newElement.textContent = selectedElement.textContent || 'Sample Text';
        newElement.setAttribute('font-size', selectedElement.getAttribute('font-size') || 12);
        newElement.setAttribute('font-family', selectedElement.getAttribute('font-family') || 'Arial');
        newElement.setAttribute('fill', selectedElement.getAttribute('fill') || '#000000');
        newElement.setAttribute('x', x);
        newElement.setAttribute('y', y + height/2); // lets see without height
    } else if (newType === 'path') {
        const d = `M${x} ${y} H${x + width} V${y + height} H${x} Z`;
        newElement.setAttribute('d', selectedElement.getAttribute('d') || d);
    }

    // Replace the old element with the new one in the DOM
    selectedElement.parentNode.replaceChild(newElement, selectedElement);
    selectedElement = newElement;
    selectedElement.classList.add('selected');

    // Add the click event listener to the new element
    selectedElement.addEventListener('click', function(event) {
        event.stopPropagation(); // Stop the event from propagating
        console.log("clicked");
        if (selectedElement !== null) {
            selectedElement.classList.remove('selected');
        }

        selectedElement = event.target;
        selectedElement.classList.add('selected');
        
        console.log("Selected element type: " + getSelectedElementType());
        // Show attribute modifier buttons only when an element is selected
        addAttributeModifierButtons();
    });

    addAttributeModifierButtons(); // Update the attribute modifiers for the new element
    addCopyPasteDeleteEvents();
}

function createLabeledInput(labelText, inputType, inputValue, inputHandler) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.marginBottom = '10px';

    const label = document.createElement('label');
    label.innerText = labelText;

    const input = document.createElement('input');
    input.type = inputType;
    input.value = inputValue;
    input.addEventListener('input', inputHandler);

    container.appendChild(label);
    container.appendChild(input);

    return container;
}

function createLabeledDropdown(labelText, options, selectedOption, changeHandler) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.marginBottom = '10px';

    const label = document.createElement('label');
    label.innerText = labelText;

    const select = document.createElement('select');
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.innerText = option.charAt(0).toUpperCase() + option.slice(1);
        if (option === selectedOption) {
            optionElement.selected = true;
        }
        select.appendChild(optionElement);
    });
    select.addEventListener('change', changeHandler);

    container.appendChild(label);
    container.appendChild(select);

    return container;
}

// Add translation functionality to Path element
function applyTranslationX(dx) {
    if (selectedElement === null || dx === "") return;

    const d = selectedElement.getAttribute('d');
    const newD = translatePath(d, dx, true);
    selectedElement.setAttribute('d', newD);
}

function applyTranslationY(dy) {
    if (selectedElement === null || dy === "") return;

    const d = selectedElement.getAttribute('d');
    const newD = translatePath(d, dy, false);
    selectedElement.setAttribute('d', newD);
}

function translatePath(d, dc, isXTranslation) {
    // Регулярен израз, който търси числени стойности в дефиницията на пътя (d атрибута)
    let index = 0;
    let firstInstructionX = 0;
    let firstInstructionY = 0;

    // Първо преминаване през стринга, за да открием началната точка
    d.replace(/(-?\d+(\.\d+)?)/g, (match) => {
        const number = parseFloat(match);
        if(index === 0) {
            firstInstructionX = number;
            index++;
            console.log("I:", index);
        }
        else if(index === 1) {
            firstInstructionY = number;
            console.log("Y", firstInstructionY);
            index++;
        }
        else index++;
    });

    index = 0;

    return d.replace(/(-?\d+(\.\d+)?)/g, match => {
        const number = parseFloat(match); 

        if (isXTranslation && index % 2 === 0) { 
            index++; 
            return (number - firstInstructionX + parseFloat(dc));
        } else if (!isXTranslation && index % 2 !== 0){
            index++; 
            console.log(firstInstructionY);
            return (number - firstInstructionY + parseFloat(dc));
        }
        else {
            index++;
            console.log("End: ", index);
            return match;
        }
    });
}

// Finds the current rotation
function getRotation(transform) {
    const match = transform.match(/rotate\(([-]*\d+)\)/);
    return match ? parseInt(match[1]) : 0;
}

function applyRotation(degrees) {
    if (selectedElement === null) return;

    const bbox = selectedElement.getBBox();
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    const translateToCenter = `translate(${cx}, ${cy})`;
    const rotate = `rotate(${degrees})`;
    const translateBack = `translate(${-cx}, ${-cy})`;

    const transform = `${translateToCenter} ${rotate} ${translateBack}`;
    selectedElement.setAttribute('transform', transform);
}

function showAnimationSettings(type) {
    const animationSettingsContainer = document.getElementById('animationSettingsContainer') || document.createElement('div');
    animationSettingsContainer.id = 'animationSettingsContainer';
    animationSettingsContainer.innerHTML = ''; // Clear previous settings

    // Common animation settings
    animationSettingsContainer.appendChild(createLabeledInput('Duration (s):', 'number', 2, function(event) {
        animationSettings[type].duration = event.target.value;
    }));

    animationSettingsContainer.appendChild(createLabeledInput('Repeat Count:', 'text', 'indefinite', function(event) {
        animationSettings[type].repeatCount = event.target.value;
    }));

    // Specific settings based on animation type
    if (type === 'translate') {
        animationSettingsContainer.appendChild(createLabeledInput('Translate X:', 'number', 100, function(event) {
            animationSettings[type].dx = event.target.value;
        }));

        animationSettingsContainer.appendChild(createLabeledInput('Translate Y:', 'number', 100, function(event) {
            animationSettings[type].dy = event.target.value;
        }));
    } else if (type === 'scale') {
        animationSettingsContainer.appendChild(createLabeledInput('Scale X:', 'number', 2, function(event) {
            animationSettings[type].sx = event.target.value;
        }));

        animationSettingsContainer.appendChild(createLabeledInput('Scale Y:', 'number', 2, function(event) {
            animationSettings[type].sy = event.target.value;
        }));
    } else if (type === 'rotate') {
        animationSettingsContainer.appendChild(createLabeledInput('Rotation Angle:', 'number', 360, function(event) {
            animationSettings[type].angle = event.target.value;
        }));

        const directions = ['Clockwise', 'Counterclockwise'];
        animationSettingsContainer.appendChild(createLabeledDropdown('Direction:', directions, 'Clockwise', function(event) {
            animationSettings[type].direction = event.target.value;
        }));
    } else if (type === 'color') {
        animationSettingsContainer.appendChild(createLabeledInput('Color:', 'color', '#ff0000', function(event) {
            animationSettings[type].color = event.target.value;
        }));
    }

    // Apply button to start the animation
    const applyButton = document.createElement('button');
    applyButton.innerText = 'Apply Animation';
    applyButton.addEventListener('click', () => applyAnimation(type));
    animationSettingsContainer.appendChild(applyButton);

    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.appendChild(animationSettingsContainer);
}

const animationSettings = {
    translate: { dx: 100, dy: 100, duration: 2, repeatCount: 'indefinite' },
    scale: { sx: 2, sy: 2, duration: 2, repeatCount: 'indefinite' },
    rotate: { angle: 360, duration: 2, repeatCount: 'indefinite', direction: 'Clockwise'},
    color: { color: '#ff0000', duration: 2, repeatCount: 'indefinite' }
};

function applyAnimation(type) {
    const settings = animationSettings[type];
    let animation;

    selectedElement.innerHTML = '';
    
    if (type === 'translate') {
        animation = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
        animation.setAttribute('attributeName', 'transform');
        animation.setAttribute('type', 'translate');
        animation.setAttribute('from', '0 0');
        animation.setAttribute('to', `${settings.dx} ${settings.dy}`);
    } else if (type === 'scale') {
        animation = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
        animation.setAttribute('attributeName', 'transform');
        animation.setAttribute('type', 'scale');
        animation.setAttribute('from', '1 1');
        animation.setAttribute('to', `${settings.sx} ${settings.sy}`);
    } else if (type === 'rotate') {
        animation = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
        const bbox = selectedElement.getBBox();
        const cx = bbox.x + bbox.width / 2; // X coordinate of the center
        const cy = bbox.y + bbox.height / 2; // Y coordinate of the center
        animation.setAttribute('attributeName', 'transform');
        animation.setAttribute('type', 'rotate');
        const fromAngle = settings.direction === 'Clockwise' ? 0 : settings.angle;
        const toAngle = settings.direction === 'Clockwise' ? settings.angle : 0;
        animation.setAttribute('from', `${fromAngle} ${cx} ${cy}`);
        animation.setAttribute('to', `${toAngle} ${cx} ${cy}`);
    } else if (type === 'color') {
        animation = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animation.setAttribute('attributeName', 'fill');
        animation.setAttribute('from', selectedElement.getAttribute('fill'));
        animation.setAttribute('to', settings.color);
    }

    animation.setAttribute('dur', `${settings.duration}s`);
    animation.setAttribute('repeatCount', settings.repeatCount);

    selectedElement.appendChild(animation);
    animation.beginElement();
}

/*
function moveElementForward() {
    if (selectedElement === null) return;
    const parent = selectedElement.parentNode;
    const children = Array.from(parent.children);
    const index = children.indexOf(selectedElement);
    if (index < children.length - 1) {
        parent.insertBefore(selectedElement, children[index + 1]);
    }
}

function moveElementBackward() {
    if (selectedElement === null) return;
    const parent = selectedElement.parentNode;
    const children = Array.from(parent.children);
    const index = children.indexOf(selectedElement);
    if (index > 0) {
        parent.insertBefore(selectedElement, children[index - 1]);
    }
}
*/

function enableElementDrag() {
    if (selectedElement === null) return;

    let offsetX, offsetY;

    function dragStart(event) {
        const rect = selectedElement.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
    
        // Добавяне на слушатели за движение на мишката и освобождаване на бутона
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
    }

    function dragMove(event) {
        const newX = event.clientX - offsetX;
        const newY = event.clientY - offsetY;
    
        // Промяна на позицията на елемента
        selectedElement.setAttribute('x', newX);
        selectedElement.setAttribute('y', newY);
    }

    function dragEnd() {
        // Премахване на слушателите след като елементът бъде отпуснат
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
    }

    // Стартиране на преместването при натискане на елемента
    selectedElement.addEventListener('mousedown', dragStart);
}

document.addEventListener('svgLoaded', function() {
    addClickEventToSVGElements();
});