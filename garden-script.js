// Phase tracking system
let currentPhase = 1;
let phases = document.querySelectorAll('.phase');
let phase1Unlocked = false;
let phase2FleeClicked = false;
let phase2ButtonClicked = false;
let phase3WordsRevealed = false;
let phase3Locked = false;
let phase3OutClicked = false;
let phase4Locked = false;
let phase4CircumstancesClicked = false;
let phase5Locked = false;
let scrollLocked = false;
let lockPosition = 0;
let phase2BottomLocked = false;

// Initialize - hide all paragraphs
document.addEventListener('DOMContentLoaded', () => {
    phases.forEach(phase => {
        const paragraphs = phase.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.classList.add('hidden');
        });
    });
    
    // Setup Phase 1 "missing" trigger word click
    const triggerWord = document.querySelector('[data-trigger="phase1-unlock"]');
    if (triggerWord) {
        triggerWord.addEventListener('click', () => {
            console.log('✅ Missing clicked - unlocking');
            phase1Unlocked = true;
            scrollLocked = false;
            triggerWord.classList.add('clicked');
            
            // Start fading out Phase 1
            const phase1 = document.querySelector('.phase-1');
            if (phase1) {
                phase1.classList.add('fade-out');
            }
            
            // Show Phase 2
            const phase2 = document.querySelector('.phase-2');
            if (phase2) {
                phase2.style.opacity = '1';
                phase2.classList.add('fade-in');
            }
        });
    }
    
    // Setup Phase 2 "flee" trigger word click
    const phase2Trigger = document.querySelector('[data-trigger="phase2-flee"]');
    const phase2Choice = document.getElementById('phase2Choice');
    
    if (phase2Trigger && phase2Choice) {
        phase2Trigger.addEventListener('click', () => {
            console.log('✅ Flee clicked - showing choice');
            phase2FleeClicked = true;
            phase2Trigger.classList.add('clicked');
            phase2Choice.classList.add('active');
        });
        
        // Setup yes/no button clicks - ONLY for Phase 2
        const choiceButtons = phase2Choice.querySelectorAll('.choice-btn');
        const phase2 = document.querySelector('.phase-2');
        
        choiceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Prevent multiple clicks
                if (phase2ButtonClicked) return;
                
                const choice = btn.dataset.choice;
                console.log('Choice selected:', choice);
                
                // Mark button as clicked and disable all buttons
                phase2ButtonClicked = true;
                choiceButtons.forEach(b => {
                    b.style.pointerEvents = 'none';
                });
                
                console.log('✅✅✅ FADING OUT PHASE 2 PARAGRAPHS');
                
                // Fade out all paragraphs in Phase 2
                if (phase2) {
                    const paragraphs = phase2.querySelectorAll('p');
                    paragraphs.forEach(p => {
                        p.style.transition = 'opacity 2s ease, transform 2s ease';
                        p.style.opacity = '0';
                        p.style.transform = 'translateY(-50px)';
                    });
                    console.log('Phase 2 paragraphs fading out');
                }
                
                // Also fade out the choice buttons
                phase2Choice.style.transition = 'opacity 2s ease';
                phase2Choice.style.opacity = '0';
                
                // Unlock scrolling after fade
                setTimeout(() => {
                    phase2BottomLocked = false;
                    scrollLocked = false;
                    console.log('✅ Scroll unlocked - can continue to Phase 3');
                    
                    // Show Phase 3
                    const phase3 = document.querySelector('.phase-3');
                    if (phase3) {
                        phase3.style.opacity = '1';
                        phase3.classList.add('fade-in');
                    }
                }, 2000);
            });
        });
    }
    
    // Setup Phase 3 interactions
    setupPhase3();
    
    // Setup Phase 4 interactions
    setupPhase4();
    
    // Setup Phase 5 interactions
    setupPhase5();
});

// Prevent upward scrolling
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // If Phase 1 is locked, stay at lock position
    if (scrollLocked && !phase1Unlocked) {
        window.scrollTo(0, lockPosition);
        return;
    }
    
    // If Phase 2 bottom is locked, allow scrolling up within Phase 2 until button is clicked
    if (phase2BottomLocked && !phase2ButtonClicked) {
        const phase2 = document.querySelector('.phase-2');
        if (phase2) {
            const rect = phase2.getBoundingClientRect();
            const scrollPos = window.pageYOffset;
            const phase2Top = rect.top + scrollPos;
            const phase1 = document.querySelector('.phase-1');
            const phase1Bottom = phase1 ? (phase1.getBoundingClientRect().top + scrollPos + phase1.getBoundingClientRect().height) : 0;
            
            // Don't allow scrolling above Phase 2 start (prevent going to Phase 1)
            if (currentScroll < phase2Top) {
                window.scrollTo(0, phase2Top);
                return;
            }
            // Don't allow scrolling past lock position
            if (currentScroll > lockPosition) {
                window.scrollTo(0, lockPosition);
                return;
            }
            
            // Allow free scrolling within Phase 2
            lastScroll = currentScroll;
            updatePhases();
            return;
        }
    }
    
    // If Phase 3 is locked, allow scrolling up to first paragraph but not down
    if (phase3Locked && !phase3OutClicked) {
        const phase3 = document.querySelector('.phase-3');
        if (phase3) {
            const rect = phase3.getBoundingClientRect();
            const scrollPos = window.pageYOffset;
            const phase3Top = rect.top + scrollPos;
            
            // Get first paragraph position
            const firstParagraph = phase3.querySelector('p:first-child');
            let minScroll = phase3Top;
            if (firstParagraph) {
                const firstParaRect = firstParagraph.getBoundingClientRect();
                const firstParaTop = firstParaRect.top + scrollPos;
                // Allow scrolling so first paragraph is at top of viewport
                minScroll = firstParaTop;
            }
            
            // Don't allow scrolling above first paragraph
            if (currentScroll < minScroll) {
                window.scrollTo(0, minScroll);
                return;
            }
            // Don't allow scrolling past lock position (can't go down)
            if (currentScroll > lockPosition) {
                window.scrollTo(0, lockPosition);
                return;
            }
            
            // Allow free scrolling within Phase 3
            lastScroll = currentScroll;
            updatePhases();
            return;
        }
    }
    
    // If Phase 3 words revealed but not locked yet, allow scrolling up within Phase 3 only
    if (phase3WordsRevealed && currentScroll < lastScroll && !phase3Locked && !phase3OutClicked) {
        const phase3 = document.querySelector('.phase-3');
        if (phase3) {
            const rect = phase3.getBoundingClientRect();
            const scrollPos = window.pageYOffset;
            const phase3Top = rect.top + scrollPos;
            
            // Get first paragraph position
            const firstParagraph = phase3.querySelector('p:first-child');
            let minScroll = phase3Top;
            if (firstParagraph) {
                const firstParaRect = firstParagraph.getBoundingClientRect();
                const firstParaTop = firstParaRect.top + scrollPos;
                minScroll = firstParaTop;
            }
            
            // Don't allow scrolling above first paragraph
            if (currentScroll < minScroll) {
                window.scrollTo(0, minScroll);
                return;
            }
        }
    }
    
    // If Phase 4 is locked, allow scrolling up within Phase 4 but not down
    if (phase4Locked && !phase4CircumstancesClicked) {
        const phase4 = document.querySelector('.phase-4');
        if (phase4) {
            const phase4Rect = phase4.getBoundingClientRect();
            const phase4TopAbsolute = phase4Rect.top + window.pageYOffset;
            const minScroll = phase4TopAbsolute - 500;
            
            // Don't allow scrolling above Phase 4 start
            if (currentScroll < minScroll) {
                window.scrollTo(0, minScroll);
                return;
            }
            // Don't allow scrolling past lock position
            if (currentScroll > lockPosition) {
                window.scrollTo(0, lockPosition);
                return;
            }
            
            // Allow free scrolling within Phase 4
            lastScroll = currentScroll;
            updatePhases();
            return;
        }
    }
    
    // If Phase 5 is locked, allow scrolling up within Phase 5 but not down
    if (phase5Locked) {
        const phase5 = document.querySelector('.phase-5');
        if (phase5) {
            const phase5Rect = phase5.getBoundingClientRect();
            const phase5TopAbsolute = phase5Rect.top + window.pageYOffset;
            const minScroll = phase5TopAbsolute - 500;
            
            // Don't allow scrolling above Phase 5 start
            if (currentScroll < minScroll) {
                window.scrollTo(0, minScroll);
                return;
            }
            // Don't allow scrolling past lock position
            if (currentScroll > lockPosition) {
                window.scrollTo(0, lockPosition);
                return;
            }
            
            // Allow free scrolling within Phase 5
            lastScroll = currentScroll;
            updatePhases();
            return;
        }
    }
    
    // Phase 4: Allow scrolling up within Phase 4, stop before Phase 3
    if (phase3OutClicked && currentScroll < lastScroll) {
        const phase4 = document.querySelector('.phase-4');
        if (phase4) {
            const phase4Rect = phase4.getBoundingClientRect();
            const phase4TopAbsolute = phase4Rect.top + window.pageYOffset;
            
            // Allow scrolling up until first paragraph is fully visible - large buffer
            const minScroll = phase4TopAbsolute - 500; // 500px buffer to see full first paragraph
            
            // Don't allow scrolling above Phase 4 start (with buffer)
            if (currentScroll < minScroll) {
                window.scrollTo(0, minScroll);
                lastScroll = minScroll;
                return;
            }
        }
    }
    
    // Normal upward scroll prevention (only when NOT in Phase 2 locked state, Phase 3 not complete, and Phase 4 not active)
    if (currentScroll < lastScroll && !phase2BottomLocked && !phase3WordsRevealed && !phase3OutClicked) {
        window.scrollTo(0, lastScroll);
        return;
    }
    
    lastScroll = currentScroll;
    
    // Track phase visibility and trigger fades
    updatePhases();
}, { passive: false });

function updatePhases() {
    const scrollPos = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    phases.forEach((phase, index) => {
        const phaseNumber = parseInt(phase.dataset.phase);
        const rect = phase.getBoundingClientRect();
        const phaseTop = rect.top + scrollPos;
        
        // Progressive reveal of paragraphs
        const paragraphs = phase.querySelectorAll('p');
        
        paragraphs.forEach((p, pIndex) => {
            const pRect = p.getBoundingClientRect();
            const pTop = pRect.top + scrollPos;
            
            // Phase 1: Always reveal as you scroll
            if (phaseNumber === 1) {
                if (scrollPos + viewportHeight * 0.7 > pTop) {
                    p.classList.remove('hidden');
                    p.classList.add('reveal');
                }
            }
            
            // Phase 2: Only reveal if Phase 1 is unlocked
            if (phaseNumber === 2 && phase1Unlocked) {
                if (scrollPos + viewportHeight * 0.7 > pTop) {
                    p.classList.remove('hidden');
                    p.classList.add('reveal');
                }
            }
            
            // Phase 3: Only reveal if Phase 2 button is clicked
            if (phaseNumber === 3 && phase2ButtonClicked) {
                if (scrollPos + viewportHeight * 0.7 > pTop) {
                    p.classList.remove('hidden');
                    p.classList.add('reveal');
                    
                    // Check for word-by-word paragraph
                    if (p.classList.contains('word-by-word') && !p.dataset.wordsRevealed) {
                        p.dataset.wordsRevealed = 'true';
                        revealWordsOneByOne(p);
                    }
                }
            }
            
            // Phase 4: Only reveal if Phase 3 out is clicked
            if (phaseNumber === 4 && phase3OutClicked) {
                if (scrollPos + viewportHeight * 0.7 > pTop) {
                    p.classList.remove('hidden');
                    p.classList.add('reveal');
                }
            }
            
            // Phase 5: Only reveal if Phase 4 circumstances clicked
            if (phaseNumber === 5 && phase4CircumstancesClicked) {
                if (scrollPos + viewportHeight * 0.7 > pTop) {
                    p.classList.remove('hidden');
                    p.classList.add('reveal');
                }
            }
        });
        
        // Phase 3: Lock when word-by-word paragraph is centered (even while words are appearing)
        if (phaseNumber === 3 && phase2ButtonClicked && !phase3Locked && !phase3OutClicked) {
            const wordByWordPara = phase.querySelector('.word-by-word');
            if (wordByWordPara && wordByWordPara.classList.contains('reveal')) {
                const paraRect = wordByWordPara.getBoundingClientRect();
                const paraCenter = paraRect.top + paraRect.height / 2;
                const screenCenter = viewportHeight / 2;
                
                // Lock when paragraph center is at screen center
                if (Math.abs(paraCenter - screenCenter) < 100) {
                    phase3Locked = true;
                    lockPosition = scrollPos;
                    console.log('🔒 Phase 3 locked - last sentence centered (words still appearing)');
                }
            }
        }
        
        // Phase 4: Lock when "Two circumstances" sentence is centered
        if (phaseNumber === 4 && phase3OutClicked && !phase4Locked && !phase4CircumstancesClicked) {
            const lockTriggerPara = phase.querySelector('.lock-trigger');
            if (lockTriggerPara && lockTriggerPara.classList.contains('reveal')) {
                const paraRect = lockTriggerPara.getBoundingClientRect();
                const paraCenter = paraRect.top + paraRect.height / 2;
                const screenCenter = viewportHeight / 2;
                
                // Lock when paragraph center is at screen center
                if (Math.abs(paraCenter - screenCenter) < 100) {
                    phase4Locked = true;
                    lockPosition = scrollPos;
                    console.log('🔒 Phase 4 locked - two circumstances centered');
                }
            }
        }
        
        // Phase 5: Lock when last sentence is centered
        if (phaseNumber === 5 && phase4CircumstancesClicked && !phase5Locked) {
            const lastSentence = phase.querySelector('.last-sentence');
            if (lastSentence && lastSentence.classList.contains('reveal')) {
                const paraRect = lastSentence.getBoundingClientRect();
                const paraCenter = paraRect.top + paraRect.height / 2;
                const screenCenter = viewportHeight / 2;
                
                // Lock when paragraph center is at screen center
                if (Math.abs(paraCenter - screenCenter) < 100) {
                    phase5Locked = true;
                    lockPosition = scrollPos;
                    console.log('🔒 Phase 5 locked - last sentence centered');
                }
            }
        }
        
        // Phase 1: Lock when text is centered on screen (and not yet unlocked)
        if (phaseNumber === 1 && !phase1Unlocked && !scrollLocked) {
            const phaseCenterY = rect.top + rect.height / 2;
            const lockPointY = viewportHeight * 0.4; // 40% from top
            
            // Check if phase center is near lock point
            if (Math.abs(phaseCenterY - lockPointY) < 100) {
                scrollLocked = true;
                lockPosition = scrollPos;
                console.log('🔒 Scroll locked - Phase 1 at upper position');
            }
        }
        
        // Phase 2: Lock when last paragraph is centered at upper-middle position
        if (phaseNumber === 2 && phase1Unlocked && !phase2ButtonClicked && !phase2BottomLocked) {
            // Get the last actual paragraph (not the choice div)
            const allParagraphs = Array.from(paragraphs);
            const lastParagraph = allParagraphs[allParagraphs.length - 1]; // Last <p> element with "flee"
            
            if (lastParagraph && lastParagraph.classList.contains('reveal')) {
                const lastPRect = lastParagraph.getBoundingClientRect();
                const paragraphCenter = lastPRect.top + lastPRect.height / 2;
                const lockPointY = viewportHeight * 0.4; // 40% from top, same as Phase 1
                
                // Lock when paragraph center is at lock point (within 100px tolerance)
                if (Math.abs(paragraphCenter - lockPointY) < 100) {
                    phase2BottomLocked = true;
                    lockPosition = scrollPos;
                    console.log('🔒 Phase 2 locked - last paragraph (flee) at 40% position');
                }
            }
        }
    });
}

// Prevent browser back button
history.pushState(null, null, location.href);
window.addEventListener('popstate', () => {
    history.pushState(null, null, location.href);
});

// Phase 3 setup function
function setupPhase3() {
    const timorousTrigger = document.getElementById('timorousTrigger');
    const collapsibleText = document.getElementById('collapsibleText');
    
    if (timorousTrigger && collapsibleText) {
        timorousTrigger.addEventListener('click', () => {
            collapsibleText.classList.toggle('expanded');
            console.log('Collapsible text toggled');
        });
    }
}

// Phase 4 setup function
// Word by word reveal function
function setupPhase4() {
    // "A man" trigger - cross out and reveal Captain Richard Madden
    const aManTrigger = document.getElementById('aManTrigger');
    const aManReveal = document.getElementById('aManReveal');
    
    if (aManTrigger && aManReveal) {
        aManTrigger.addEventListener('click', () => {
            // Toggle cross out and reveal text
            aManTrigger.classList.toggle('crossed');
            aManReveal.classList.toggle('show');
            console.log('A man toggled');
        });
    }
    
    // "Dr. Stephen Albert's house" trigger
    const drAlbertTrigger = document.getElementById('drAlbertTrigger');
    const drAlbertReveal = document.getElementById('drAlbertReveal');
    
    if (drAlbertTrigger && drAlbertReveal) {
        drAlbertTrigger.addEventListener('click', () => {
            drAlbertReveal.classList.toggle('show');
            console.log('Dr. Albert trigger clicked');
        });
    }
    
    // "Ts'ui Pen" trigger - typewriter effect
    const tsuiPenTrigger = document.getElementById('tsuiPenTrigger');
    const tsuiPenReveal = document.getElementById('tsuiPenReveal');
    let typewriterActive = false;
    let typewriterInterval = null;
    
    if (tsuiPenTrigger && tsuiPenReveal) {
        const fullText = "Governor of Yunnan and gave up temporal power to write a novel with more characters than there are in the Hung Lou Meng, and to create a maze in which all men would lose themselves. He spent thirteen years on these oddly assorted tasks before he was assassinated by a stranger. His novel had no sense to it and nobody ever found his labyrinth.";
        
        tsuiPenTrigger.addEventListener('click', () => {
            if (typewriterActive) {
                // Stop typewriter and hide text
                clearInterval(typewriterInterval);
                typewriterActive = false;
                tsuiPenReveal.classList.remove('typing');
                tsuiPenReveal.textContent = '';
                console.log('Typewriter stopped');
            } else {
                // Start typewriter effect
                typewriterActive = true;
                tsuiPenReveal.classList.add('typing');
                tsuiPenReveal.textContent = '';
                
                let charIndex = 0;
                typewriterInterval = setInterval(() => {
                    if (charIndex < fullText.length) {
                        tsuiPenReveal.textContent += fullText[charIndex];
                        charIndex++;
                    } else {
                        clearInterval(typewriterInterval);
                        console.log('Typewriter complete');
                    }
                }, 30); // 30ms per character
            }
        });
    }
    
    // "garden" trigger
    const gardenTrigger = document.getElementById('gardenTrigger');
    const gardenReveal = document.getElementById('gardenReveal');
    
    if (gardenTrigger && gardenReveal) {
        gardenTrigger.addEventListener('click', () => {
            gardenReveal.classList.toggle('show');
            console.log('Garden trigger clicked');
        });
    }
    
    // "Two circumstances" trigger
    const circumstancesTrigger = document.getElementById('circumstancesTrigger');
    const circumstancesChoice = document.getElementById('circumstancesChoice');
    const option1Reveal = document.getElementById('option1Reveal');
    const option2Reveal = document.getElementById('option2Reveal');
    
    if (circumstancesTrigger) {
        circumstancesTrigger.addEventListener('click', () => {
            if (circumstancesChoice) {
                circumstancesChoice.classList.add('active');
                console.log('✅ Two circumstances clicked - buttons should appear');
            }
        });
    }
    
    // Direct button handlers - NO RESTRICTIONS
    const option1Btn = document.querySelector('[data-choice="option1"]');
    const option2Btn = document.querySelector('[data-choice="option2"]');
    
    console.log('Button setup:', {
        option1Btn: !!option1Btn,
        option2Btn: !!option2Btn
    });
    
    if (option1Btn) {
        option1Btn.addEventListener('click', function(e) {
            console.log('✅✅✅ OPTION 1 BUTTON CLICKED!');
            e.stopPropagation();
            
            // Only allow one choice
            if (phase4CircumstancesClicked) return;
            
            phase4CircumstancesClicked = true;
            
            if (option1Reveal) {
                option1Reveal.classList.add('show');
                console.log('Showing option 1 text');
            }
            
            // Disable both buttons
            if (option1Btn) option1Btn.style.pointerEvents = 'none';
            if (option2Btn) option2Btn.style.pointerEvents = 'none';
            
            // Keep buttons visible - don't fade them out
            
            // Unlock and show Phase 5
            setTimeout(() => {
                phase4Locked = false;
                console.log('✅ Phase 4 unlocked - moving to Phase 5');
                
                // Show Phase 5
                const phase5 = document.querySelector('.phase-5');
                if (phase5) {
                    phase5.style.opacity = '1';
                    phase5.classList.add('fade-in');
                }
            }, 500);
        }, false);
        
        console.log('Option 1 button handler attached');
    }
    
    if (option2Btn) {
        option2Btn.addEventListener('click', function(e) {
            console.log('✅✅✅ OPTION 2 BUTTON CLICKED!');
            e.stopPropagation();
            
            // Only allow one choice
            if (phase4CircumstancesClicked) return;
            
            phase4CircumstancesClicked = true;
            
            if (option2Reveal) {
                option2Reveal.classList.add('show');
                console.log('Showing option 2 text');
            }
            
            // Disable both buttons
            if (option1Btn) option1Btn.style.pointerEvents = 'none';
            if (option2Btn) option2Btn.style.pointerEvents = 'none';
            
            // Keep buttons visible - don't fade them out
            
            // Unlock and show Phase 5
            setTimeout(() => {
                phase4Locked = false;
                console.log('✅ Phase 4 unlocked - moving to Phase 5');
                
                // Show Phase 5
                const phase5 = document.querySelector('.phase-5');
                if (phase5) {
                    phase5.style.opacity = '1';
                    phase5.classList.add('fade-in');
                }
            }, 500);
        }, false);
        
        console.log('Option 2 button handler attached');
    }
}

// Word by word reveal function
function revealWordsOneByOne(paragraph) {
    const text = paragraph.textContent;
    const words = text.split(' ');
    paragraph.textContent = '';
    
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        span.style.animationDelay = `${index * 0.5}s`; // Slower: 500ms between words
        paragraph.appendChild(span);
        
        // Make last word "out." clickable
        if (index === words.length - 1) {
            span.classList.add('trigger-word');
            span.style.cursor = 'pointer';
            span.addEventListener('click', () => {
                console.log('✅ "out" clicked - SLAM!');
                
                // Add slam animation
                span.classList.add('slam');
                
                // Fade out all paragraphs in Phase 3
                const phase3 = document.querySelector('.phase-3');
                if (phase3) {
                    const paragraphs = phase3.querySelectorAll('p, .collapsible-text');
                    paragraphs.forEach(p => {
                        p.style.transition = 'opacity 2s ease, transform 2s ease';
                        p.style.opacity = '0';
                        p.style.transform = 'translateY(-50px)';
                    });
                }
                
                // Unlock after animation and show Phase 4
                setTimeout(() => {
                    phase3OutClicked = true;
                    phase3Locked = false;
                    // Don't add 'clicked' class to keep "out" visible
                    console.log('✅ Phase 3 unlocked - showing Phase 4');
                    
                    // Show Phase 4
                    const phase4 = document.querySelector('.phase-4');
                    if (phase4) {
                        phase4.style.opacity = '1';
                        phase4.classList.add('fade-in');
                    }
                }, 2000); // Increased to match fade duration
            });
        }
        
        // Add space after each word except the last
        if (index < words.length - 1) {
            paragraph.appendChild(document.createTextNode(' '));
        }
        
        // Set flag when last word animation completes
        if (index === words.length - 1) {
            const totalDelay = (index * 0.5 + 0.6) * 1000; // delay + animation duration
            setTimeout(() => {
                phase3WordsRevealed = true;
                console.log('✅ Phase 3 words complete - can scroll within Phase 3');
            }, totalDelay);
        }
    });
}

// Phase 5 setup function
function setupPhase5() {
    // "possible solutions" trigger - toggle text
    const possibleSolutionsTrigger = document.getElementById('possibleSolutionsTrigger');
    const possibleSolutionsReveal = document.getElementById('possibleSolutionsReveal');
    
    if (possibleSolutionsTrigger && possibleSolutionsReveal) {
        possibleSolutionsTrigger.addEventListener('click', () => {
            possibleSolutionsReveal.classList.toggle('show');
            console.log('Possible solutions toggled');
        });
    }
    
    // "two versions" trigger - show buttons on click
    const twoVersionsTrigger = document.getElementById('twoVersionsTrigger');
    const versionsChoice = document.getElementById('versionsChoice');
    
    if (twoVersionsTrigger && versionsChoice) {
        twoVersionsTrigger.addEventListener('click', () => {
            versionsChoice.classList.add('active');
            console.log('Two versions clicked - showing version buttons');
        });
    }
    
    // Version button handlers - toggle text
    const version1Btn = document.querySelector('[data-choice="version1"]');
    const version2Btn = document.querySelector('[data-choice="version2"]');
    const version1Reveal = document.getElementById('version1Reveal');
    const version2Reveal = document.getElementById('version2Reveal');
    
    if (version1Btn && version1Reveal) {
        version1Btn.addEventListener('click', () => {
            version1Reveal.classList.toggle('show');
            console.log('Version 1 toggled');
        });
    }
    
    if (version2Btn && version2Reveal) {
        version2Btn.addEventListener('click', () => {
            version2Reveal.classList.toggle('show');
            console.log('Version 2 toggled');
        });
    }
    
    // Chess question - typewriter effect
    const chessQuestion = document.getElementById('chessQuestion');
    const chessAnswerReveal = document.getElementById('chessAnswerReveal');
    let chessTypewriterActive = false;
    let chessTypewriterInterval = null;
    
    if (chessQuestion && chessAnswerReveal) {
        const chessAnswerText = '"The word is chess." "Precisely," said Albert.';
        
        chessQuestion.addEventListener('click', () => {
            if (chessTypewriterActive) {
                // Stop typewriter and hide text
                clearInterval(chessTypewriterInterval);
                chessTypewriterActive = false;
                chessAnswerReveal.classList.remove('typing');
                chessAnswerReveal.textContent = '';
                console.log('Chess typewriter stopped');
            } else {
                // Start typewriter effect
                chessTypewriterActive = true;
                chessAnswerReveal.classList.add('typing');
                chessAnswerReveal.textContent = '';
                
                let charIndex = 0;
                chessTypewriterInterval = setInterval(() => {
                    if (charIndex < chessAnswerText.length) {
                        chessAnswerReveal.textContent += chessAnswerText[charIndex];
                        charIndex++;
                    } else {
                        clearInterval(chessTypewriterInterval);
                        console.log('Chess typewriter complete');
                    }
                }, 30); // 30ms per character
            }
        });
    }
    
    // Garden title trigger - cross out and reveal text
    const gardenTitleTrigger = document.getElementById('gardenTitleTrigger');
    const gardenTitleReveal = document.getElementById('gardenTitleReveal');
    
    if (gardenTitleTrigger && gardenTitleReveal) {
        gardenTitleTrigger.addEventListener('click', () => {
            // Toggle cross out and reveal text
            gardenTitleTrigger.classList.toggle('crossed');
            gardenTitleReveal.classList.toggle('show');
            console.log('Garden title toggled');
        });
    }
}

console.log('Phase system initialized - Phase 1 active');