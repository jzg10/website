// typewriter-effect.js
document.addEventListener('DOMContentLoaded', function() {
    // Find the intro paragraph in the "who" section
    const introSection = document.querySelector('.who p');
    
    if (!introSection) return;
    
    // Store the original text
    const originalText = introSection.innerHTML;
    
    // Clear the paragraph initially
    introSection.innerHTML = '';
    introSection.style.opacity = '1';
    
    // Typewriter configuration
    const typewriterConfig = {
        speed: 50, 
        pauseOnBreak: 800, 
        cursorChar: '|',
        showCursor: true
    };
    
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = typewriterConfig.cursorChar;
    cursor.style.cssText = `
        animation: blink 1s infinite;
        font-weight: normal;
        color: #2e8bc0;
    `;
    
    // Add cursor blinking animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        .typewriter-cursor {
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
    
    // Function to extract text content while preserving HTML structure
    function parseHTML(htmlString) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        
        const elements = [];
        
        function traverse(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                for (let i = 0; i < text.length; i++) {
                    elements.push({
                        type: 'char',
                        content: text[i]
                    });
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'BR') {
                    elements.push({
                        type: 'break',
                        content: '<br>'
                    });
                } else {
                    // For other HTML elements, add opening tag
                    elements.push({
                        type: 'html',
                        content: `<${node.tagName.toLowerCase()}${getAttributes(node)}>`
                    });
                    
                    // Process children
                    for (let child of node.childNodes) {
                        traverse(child);
                    }
                    
                    // Add closing tag
                    elements.push({
                        type: 'html',
                        content: `</${node.tagName.toLowerCase()}>`
                    });
                }
            }
        }
        
        function getAttributes(element) {
            let attrs = '';
            for (let attr of element.attributes) {
                attrs += ` ${attr.name}="${attr.value}"`;
            }
            return attrs;
        }
        
        for (let child of tempDiv.childNodes) {
            traverse(child);
        }
        
        return elements;
    }
    
    // Parse the original text
    const elements = parseHTML(originalText);
    
    // Add cursor to the paragraph
    if (typewriterConfig.showCursor) {
        introSection.appendChild(cursor);
    }
    
    // Typewriter animation function
    let currentIndex = 0;
    let currentHTML = '';
    
    function typeNextElement() {
        if (currentIndex >= elements.length) {
            // Animation complete - remove cursor after a delay
            setTimeout(() => {
                if (typewriterConfig.showCursor && cursor.parentNode) {
                    cursor.remove();
                }
            }, 2000);
            return;
        }
        
        const element = elements[currentIndex];
        
        if (element.type === 'char') {
            currentHTML += element.content;
            introSection.innerHTML = currentHTML;
            
            // Re-add cursor
            if (typewriterConfig.showCursor) {
                introSection.appendChild(cursor);
            }
            
            currentIndex++;
            setTimeout(typeNextElement, typewriterConfig.speed);
            
        } else if (element.type === 'break') {
            currentHTML += element.content;
            introSection.innerHTML = currentHTML;
            
            // Re-add cursor
            if (typewriterConfig.showCursor) {
                introSection.appendChild(cursor);
            }
            
            currentIndex++;
            setTimeout(typeNextElement, typewriterConfig.pauseOnBreak);
            
        } else if (element.type === 'html') {
            currentHTML += element.content;
            introSection.innerHTML = currentHTML;
            
            // Re-add cursor
            if (typewriterConfig.showCursor) {
                introSection.appendChild(cursor);
            }
            
            currentIndex++;
            setTimeout(typeNextElement, 10);
        }
    }
    
    // Start the typewriter effect with a small delay
    setTimeout(() => {
        typeNextElement();
    }, 500);
    
    // Add intersection observer to trigger only when section is visible
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const typewriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reset and start animation
                currentIndex = 0;
                currentHTML = '';
                introSection.innerHTML = '';
                if (typewriterConfig.showCursor) {
                    introSection.appendChild(cursor);
                }
                
                setTimeout(() => {
                    typeNextElement();
                }, 500);
                
                // Stop observing after first trigger
                typewriterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Start observing the who section
    const whoSection = document.querySelector('.who');
    if (whoSection) {
        typewriterObserver.observe(whoSection);
    }
});