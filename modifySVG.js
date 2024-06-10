let selectedElement = null;

function addClickEventToSVGElements() {
    const svgContainer = document.getElementById('svgContainer');
    const svgElements = getNonGroupSVGElements(svgContainer);

    svgElements.forEach(function(element) {
        element.addEventListener('click', function(event) {
            event.stopPropagation(); // Спиране на разпространението на събитието
            console.log("clicked");
            if (selectedElement !== null) {
                selectedElement.classList.remove('selected');
            }
            

            selectedElement = element;
            selectedElement.classList.add('selected');
            
            console.log("Selected element type: " + getSelectedElementType());
            // Показване на color picker само когато има избран елемент
            addAttributeModifierButtons();
            enableElementDrag();
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

function createLabeledSelect(labelText, options, selectedOption, changeHandler) {
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

function addAttributeModifierButtons() {
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = ''; // Изчистване на предишните бутони

    if (selectedElement === null) return;
    // Add type selector
    const types = ['rect', 'circle', 'ellipse', 'text', 'path'];
    const currentType = getSelectedElementType();
    buttonContainer.appendChild(createLabeledSelect('Element Type:', types, currentType, function(event) {
        changeElementType(event.target.value);
    }));

    // Бутони за промяна на атрибути
    buttonContainer.appendChild(createLabeledInput('Fill Color:', 'color', selectedElement.getAttribute('fill') || '#000000', function(event) {
        selectedElement.setAttribute('fill', event.target.value);
    }));

    buttonContainer.appendChild(createLabeledInput('Stroke Color:', 'color', selectedElement.getAttribute('stroke') || '#000000', function(event) {
        selectedElement.setAttribute('stroke', event.target.value);
    }));

    buttonContainer.appendChild(createLabeledInput('Stroke Width:', 'number', selectedElement.getAttribute('stroke-width') || 1, function(event) {
        selectedElement.setAttribute('stroke-width', event.target.value);
    }));

    // Специфични атрибути за различни типове елементи
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

        // Adding inputs for x and y coordinates
         buttonContainer.appendChild(createLabeledInput('X:', 'number', selectedElement.getAttribute('x') || 0, function(event) {
            selectedElement.setAttribute('x', event.target.value);
        }));

        buttonContainer.appendChild(createLabeledInput('Y:', 'number', selectedElement.getAttribute('y') || 0, function(event) {
            selectedElement.setAttribute('y', event.target.value);
        }));
    }

    if (type === 'path') {
        buttonContainer.appendChild(createLabeledInput('Translate X:', 'number', 0, function(event) {
            applyTranslation(event.target.value, 0);
        }));
    
        buttonContainer.appendChild(createLabeledInput('Translate Y:', 'number', 0, function(event) {
            applyTranslation(0, event.target.value);
        }));
    }

    buttonContainer.appendChild(createLabeledInput('Rotation (degrees):', 'number', selectedElement.getAttribute('transform') ? getRotation(selectedElement.getAttribute('transform')) : 0, function(event) {
        applyRotation(event.target.value);
    }));

    // Добавяне на бутоните за преместване напред и назад
    const moveForwardButton = document.createElement('button');
    moveForwardButton.innerText = 'Move Forward';
    moveForwardButton.addEventListener('click', moveElementForward);
    buttonContainer.appendChild(moveForwardButton);

    const moveBackwardButton = document.createElement('button');
    moveBackwardButton.innerText = 'Move Backward';
    moveBackwardButton.addEventListener('click', moveElementBackward);
    buttonContainer.appendChild(moveBackwardButton);

    const animationTypes = ['translate', 'scale', 'rotate', 'color'];
    animationTypes.forEach(type => {
        const animateButton = document.createElement('button');
        animateButton.innerText = `Animate ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        animateButton.addEventListener('click', () => showAnimationSettings(type));
        buttonContainer.appendChild(animateButton);
    });
}

function changeElementType(newType) {
    if (selectedElement === null) return;

    const newElement = document.createElementNS('http://www.w3.org/2000/svg', newType);

    // Copy common attributes
    const commonAttributes = ['fill', 'stroke', 'stroke-width'];
    commonAttributes.forEach(attr => {
        if (selectedElement.hasAttribute(attr)) {
            newElement.setAttribute(attr, selectedElement.getAttribute(attr));
        }
    });

    // Copy specific attributes based on new type
    if (newType === 'rect') {
        newElement.setAttribute('width', selectedElement.getAttribute('width') || 100);
        newElement.setAttribute('height', selectedElement.getAttribute('height') || 100);
        newElement.setAttribute('x', selectedElement.getAttribute('x') || 0);
        newElement.setAttribute('y', selectedElement.getAttribute('y') || 0);
    } else if (newType === 'circle') {
        newElement.setAttribute('cx', selectedElement.getAttribute('cx') || 50);
        newElement.setAttribute('cy', selectedElement.getAttribute('cy') || 50);
        newElement.setAttribute('r', selectedElement.getAttribute('r') || 50);
    } else if (newType === 'ellipse') {
        newElement.setAttribute('cx', selectedElement.getAttribute('cx') || 50);
        newElement.setAttribute('cy', selectedElement.getAttribute('cy') || 50);
        newElement.setAttribute('rx', selectedElement.getAttribute('rx') || 50);
        newElement.setAttribute('ry', selectedElement.getAttribute('ry') || 25);
    } else if (newType === 'text') {
        newElement.textContent = selectedElement.textContent || 'Sample Text';
        newElement.setAttribute('font-size', selectedElement.getAttribute('font-size') || 12);
        newElement.setAttribute('font-family', selectedElement.getAttribute('font-family') || 'Arial');
        newElement.setAttribute('fill', selectedElement.getAttribute('fill') || '#000000');
        newElement.setAttribute('x', selectedElement.getAttribute('x') || 0);
        newElement.setAttribute('y', selectedElement.getAttribute('y') || 0);
    } else if (newType === 'path') {
        newElement.setAttribute('d', selectedElement.getAttribute('d') || 'M10 10 H 90 V 90 H 10 Z');
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
}

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

function applyTranslation(dx, dy) {
    if (selectedElement === null) return;

    const currentTransform = selectedElement.getAttribute('transform') || '';
    const translateRegex = /translate\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/;
    const match = currentTransform.match(translateRegex);
    let currentDx = 0;
    let currentDy = 0;

    if (match) {
        currentDx = parseFloat(match[1]);
        currentDy = parseFloat(match[2]);
    }

    const newDx = currentDx + parseFloat(dx);
    const newDy = currentDy + parseFloat(dy);
    const newTransform = currentTransform.replace(translateRegex, '').trim();

    selectedElement.setAttribute('transform', `${newTransform} translate(${newDx}, ${newDy})`);
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
        animationSettingsContainer.appendChild(createLabeledSelect('Direction:', directions, 'Clockwise', function(event) {
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

function getSelectedElementType() {
    if (selectedElement !== null) {
        return selectedElement.tagName.toLowerCase();
    }
    return null;
}

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
    addColorPicker();
});

function addColorPicker() {
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'colorPicker';
    colorInput.style.display = 'none'; // Начално скриване на пикера за цвят

    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.appendChild(colorInput);

    colorInput.addEventListener('input', function() {
        if (selectedElement !== null) {
            selectedElement.style.fill = colorInput.value;
        }
    });
}
