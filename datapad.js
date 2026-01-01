document.addEventListener('DOMContentLoaded', () => {
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const intrusionLevelEl = document.getElementById('intrusionLevel');
  const modulesUnlockedEl = document.getElementById('modulesUnlocked');
  const timestampEl = document.getElementById('timestamp');
  const panelContent = document.getElementById('panelContent');
  const countdownEl = document.getElementById('countdown');
  const countdownValueEl = document.getElementById('countdownValue');
  const timerSeparatorEl = document.getElementById('timerSeparator');
  const bootVideo = document.getElementById('bootVideo');
  const loadingVideoContainer = document.getElementById('loadingVideo');
  const bootSequence = document.getElementById('bootSequence');
  const videoOverlay = document.getElementById('videoOverlay');
  const overlayVideo = document.getElementById('overlayVideo');

  terminalInput.disabled = true;

  bootVideo.addEventListener('loadedmetadata', () => {
    bootVideo.playbackRate = 2.0;
  });

  bootVideo.addEventListener('canplay', () => {
    bootVideo.play().catch(err => {
      console.log('Autoplay prevented:', err);
      loadingVideoContainer.style.display = 'none';
      bootSequence.style.display = 'block';
      terminalInput.disabled = false;
      terminalInput.focus();
    });
  });

  bootVideo.addEventListener('ended', () => {
    loadingVideoContainer.style.display = 'none';
    bootSequence.style.display = 'block';
    terminalInput.disabled = false;
    terminalInput.focus();
  });

  function showVideoOverlay(videoPath, callback) {
    terminalInput.disabled = true;
    
    const videoContainer = document.createElement('div');
    videoContainer.className = 'loading-video-container';
    
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    
    const source = document.createElement('source');
    source.src = videoPath;
    source.type = videoPath.endsWith('.webm') ? 'video/webm' : 'video/mp4';
    
    video.appendChild(source);
    videoContainer.appendChild(video);
    terminalOutput.appendChild(videoContainer);
    
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    video.onended = () => {
      videoContainer.remove();
      terminalInput.disabled = false;
      terminalInput.focus();
      if (callback) callback();
    };
  }

  function generateRandomCode() {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    let code = '';
    for (let i = 0; i < 3; i++) {
      code += letters[Math.floor(Math.random() * letters.length)];
    }
    return code;
  }

  function generateRandomSequence() {
    const letters = ['A', 'B', 'C', 'D'];
    let sequence = '';
    for (let i = 0; i < 4; i++) {
      sequence += letters[Math.floor(Math.random() * letters.length)];
    }
    return sequence;
  }

  const randomIdentityCode = generateRandomCode();
  const randomContractsSequence = generateRandomSequence();

  const modules = {
    identity: { unlocked: false, code: randomIdentityCode, codeRevealed: false },
    location: { unlocked: false },
    contracts: { unlocked: false, sequence: randomContractsSequence, codeRevealed: false },
    classified: { unlocked: false }
  };

  let locationTarget = Math.floor(40 + Math.random() * 40);
  let locationAttempts = 0;
  let countdownInterval = null;
  let timeRemaining = 300;
  let timerStarted = false;

  function playSound(type) {
    let file;
    switch (type) {
      case 'input':
        file = 'Media/input_code.mp3';
        break;
      case 'success':
        file = 'Media/success_code.mp3';
        break;
      case 'delete':
        file = 'Media/suppr_code.mp3';
        break;
      case 'loading':
        file = 'Media/digital_loading.mp3';
        break;
      default:
        return;
    }
    const audio = new Audio(file);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  function startCountdown() {
    if (timerStarted) return;
    timerStarted = true;
    countdownEl.style.display = 'inline';
    timerSeparatorEl.style.display = 'inline';
    
    printToTerminal('');
    printToTerminal('═════════════════════════════════════════════════════');
    printToTerminal('> ALERTE SYSTÈME: Intrusion détectée!', false, true);
    printToTerminal('> Protocole de sécurité activé...', false, true);
    printToTerminal('> COMPTE À REBOURS INITIÉ: 5 minutes', false, true);
    printToTerminal('> Toutes les données seront effacées si intrusion non complétée.', false, true);
    printToTerminal('═════════════════════════════════════════════════════');
    printToTerminal('');
    
    countdownInterval = setInterval(() => {
      timeRemaining--;
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      countdownValueEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      
      if (timeRemaining <= 0) {
        clearInterval(countdownInterval);
        printToTerminal('');
        printToTerminal('╔═══════════════════════════════════════════════════╗');
        printToTerminal('║   ALERTE: TEMPS ÉCOULÉ - FAILSAFE ACTIVÉ            ║', false, true);
        printToTerminal('╚═══════════════════════════════════════════════════╝');
        printToTerminal('');
        printToTerminal('> Protocole de sécurité compromis!', false, true);
        printToTerminal('> Lancement du failsafe d\'urgence...', false, true);
        printToTerminal('> Reboot du système avant effacement des données...', false, true);
        printToTerminal('');
        printToTerminal('> [FAILSAFE] Sauvegarde de la session en cours...', false, true);
        printToTerminal('> [FAILSAFE] Redémarrage imminent...', false, true);
        printToTerminal('');
        
        let rebootProgress = 0;
        const rebootInterval = setInterval(() => {
          rebootProgress += 20;
          const bars = '█'.repeat(rebootProgress / 5);
          const empty = '░'.repeat(20 - rebootProgress / 5);
          printToTerminal(`> REBOOT: [${bars}${empty}] ${rebootProgress}%`, false, true);
          
          if (rebootProgress >= 100) {
            clearInterval(rebootInterval);
            setTimeout(() => {
              location.reload();
            }, 500);
          }
        }, 200);
      }
    }, 1000);
  }

  function stopCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  function updateStatus() {
    const unlockedCount = Object.values(modules).filter(m => m.unlocked).length;
    const percent = Math.round((unlockedCount / 4) * 100);
    intrusionLevelEl.textContent = percent + '%';
    modulesUnlockedEl.textContent = `${unlockedCount}/4`;
    
    if (unlockedCount === 1 && !timerStarted) {
      startCountdown();
    }
  }

  function addModuleToPanel(moduleName, dataId) {
    const emptyMsg = panelContent.querySelector('.empty-message');
    if (emptyMsg) emptyMsg.remove();

    const moduleCard = document.createElement('div');
    moduleCard.className = 'module-card';
    
    const title = document.createElement('h3');
    title.textContent = `MODULE: ${moduleName.toUpperCase()}`;
    moduleCard.appendChild(title);

    const data = document.getElementById(dataId).innerHTML;
    const lines = data.split('\n').map(l => l.replace(/<[^>]*>/g, '').trim()).filter(l => l);
    
    lines.forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      moduleCard.appendChild(p);
    });

    panelContent.appendChild(moduleCard);
  }

  function updateTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timestampEl.textContent = `${hours}:${minutes}:${seconds}`;
  }

  function printToTerminal(text, isCommand = false, isRed = false) {
    const p = document.createElement('p');
    if (isCommand) {
      p.innerHTML = `<span class="command-input">&gt; ${text}</span>`;
    } else if (isRed) {
      p.innerHTML = `<span class="red-text">${text}</span>`;
    } else {
      p.textContent = text;
    }
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function printMultiline(lines) {
    lines.forEach(line => {
      const p = document.createElement('p');
      p.textContent = line;
      terminalOutput.appendChild(p);
    });
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function handleCommand(cmd) {
    const command = cmd.trim().toLowerCase();
    printToTerminal(cmd, true);

    if (!command) return;

    const args = command.split(' ');
    const mainCmd = args[0];

    switch (mainCmd) {
      case 'help':
        printToTerminal('═════════════════════════════════════════════════════');
        printToTerminal('COMMANDES DISPONIBLES:');
        printToTerminal('  help              - Affiche cette aide');
        printToTerminal('  status            - Affiche le statut des modules');
        printToTerminal('  hint <module>     - Affiche un indice pour un module');
        printToTerminal('  hack <module>     - Lance un mini-hack pour révéler le code');
        printToTerminal('  clear             - Efface l\'écran');
        printToTerminal('');
        printToTerminal('MODULES & COMMANDES:');
        printToTerminal('  [01] IDENTITÉ     → decrypt <code>');
        printToTerminal('  [02] LOCALISATION → scan <valeur>');
        printToTerminal('  [03] CONTRATS     → sequence <code>');
        printToTerminal('  [04] CLASSIFIÉ    → intrude');
        printToTerminal('═════════════════════════════════════════════════════');
        break;

      case 'status':
        printToTerminal('═════════════════════════════════════════════════════');
        printToTerminal('STATUT DES MODULES:');
        printToTerminal(`  [01] IDENTITÉ        : ${modules.identity.unlocked ? '[UNLOCKED]' : '[LOCKED]'} → decrypt`);
        printToTerminal(`  [02] LOCALISATION    : ${modules.location.unlocked ? '[UNLOCKED]' : '[LOCKED]'} → scan`);
        printToTerminal(`  [03] CONTRATS        : ${modules.contracts.unlocked ? '[UNLOCKED]' : '[LOCKED]'} → sequence`);
        printToTerminal(`  [04] CLASSIFIÉ       : ${modules.classified.unlocked ? '[UNLOCKED]' : '[LOCKED]'} → intrude`);
        printToTerminal('═════════════════════════════════════════════════════');
        break;

      case 'hint':
        const hintModule = args[1] ? args[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
        if (!hintModule) {
          printToTerminal('> USAGE: hint <module>');
          printToTerminal('> Modules disponibles: identité, localisation, contrats, classifié');
        } else if (hintModule === 'identity' || hintModule === 'identite' || hintModule === 'identify') {
          if (modules.identity.unlocked) {
            printToTerminal('> Module IDENTITY déjà déverrouillé.');
          } else {
            printToTerminal('> INDICE IDENTITY:');
            printToTerminal('> Commande: decrypt <code>');
            printToTerminal('> Code de 3 lettres (A-E).');
            printToTerminal('> Utilisez "hack identity" pour révéler le code.');
          }
        } else if (hintModule === 'location' || hintModule === 'localisation') {
          if (!modules.identity.unlocked) {
            printToTerminal('> Déverrouillez d\'abord le module IDENTITY.');
          } else if (modules.location.unlocked) {
            printToTerminal('> Module LOCATION déjà déverrouillé.');
          } else {
            printToTerminal('> INDICE LOCATION:');
            printToTerminal('> Commande: scan <valeur>');
            printToTerminal('> Cherchez un nombre entre 40 et 80.');
            printToTerminal('> Essayez les multiples de 5.');
            printToTerminal('> La tolérance est de ±3.');
          }
        } else if (hintModule === 'contracts' || hintModule === 'contrats') {
          if (!modules.location.unlocked) {
            printToTerminal('> Déverrouillez d\'abord le module LOCATION.');
          } else if (modules.contracts.unlocked) {
            printToTerminal('> Module CONTRACTS déjà déverrouillé.');
          } else {
            printToTerminal('> INDICE CONTRACTS:');
            printToTerminal('> Commande: sequence <code>');
            printToTerminal('> Séquence de 4 lettres (A-D).');
            printToTerminal('> Utilisez "hack contracts" pour révéler la séquence.');
          }
        } else if (hintModule === 'classified' || hintModule === 'classifie') {
          if (!modules.contracts.unlocked) {
            printToTerminal('> Déverrouillez d\'abord le module CONTRACTS.');
          } else if (modules.classified.unlocked) {
            printToTerminal('> Module CLASSIFIÉ déjà déverrouillé.');
          } else {
            printToTerminal('> INDICE CLASSIFIÉ:');
            printToTerminal('> Commande: intrude');
            printToTerminal('> Pas de paramètre requis. Lancez l\'intrusion.');
          }
        } else {
          printToTerminal('> Module inconnu. Modules: identité, localisation, contrats, classifié');
        }
        break;

      case 'decrypt':
        if (modules.identity.unlocked) {
          printToTerminal('> ERROR: Module IDENTITY déjà déverrouillé.');
        } else if (!args[1]) {
          printToTerminal('> USAGE: decrypt <code>');
          printToTerminal('> Tapez "hint identity" pour obtenir un indice.');
        } else {
          const code = args[1].toLowerCase();
          if (code === 'failsafe') {
            playSound('success');
            modules.identity.unlocked = true;
            updateStatus();
            printToTerminal('> [FAILSAFE] Protocole de sécurité activé.');
            printToTerminal('> Module IDENTITY déverrouillé et affiché dans le panneau.');
            addModuleToPanel('IDENTITÉ', 'identityData');
          } else if (code.toUpperCase() === modules.identity.code) {
            playSound('success');
            modules.identity.unlocked = true;
            updateStatus();
            printToTerminal('> SUCCESS: Déchiffrement réussi!');
            printToTerminal('> Module IDENTITY déverrouillé et affiché dans le panneau.');
            addModuleToPanel('IDENTITÉ', 'identityData');
          } else {
            printToTerminal('> ERROR: Code incorrect. Accès refusé.');
          }
        }
        break;

      case 'scan':
        if (!modules.identity.unlocked) {
          printToTerminal('> ERROR: Module IDENTITY doit être déverrouillé d\'abord.');
        } else if (modules.location.unlocked) {
          printToTerminal('> ERROR: Module LOCATION déjà déverrouillé.');
        } else if (!args[1]) {
          printToTerminal('> USAGE: scan <valeur>');
          printToTerminal('> Tapez "hint location" pour obtenir un indice.');
        } else {
          const input = args[1].toLowerCase();
          if (input === 'failsafe') {
            playSound('success');
            modules.location.unlocked = true;
            updateStatus();
            printToTerminal('> [FAILSAFE] Protocole de sécurité activé.');
            printToTerminal('> Chargement des données de localisation...');
            
            setTimeout(() => {
              showVideoOverlay('Media/FootageCrate-4K_Modern_HUD_Enemy_Map_1-matte.mp4', () => {
                printToTerminal('> Module LOCATION déverrouillé et affiché dans le panneau.');
                addModuleToPanel('LOCALISATION', 'locationData');
              });
            }, 500);
          } else {
            const value = parseInt(args[1]);
            locationAttempts++;
            if (Math.abs(value - locationTarget) <= 3) {
              playSound('success');
              modules.location.unlocked = true;
              updateStatus();
              printToTerminal('> SUCCESS: Signal calibré. Triangulation réussie!');
              printToTerminal('> Chargement des données de localisation...');
              
              setTimeout(() => {
                showVideoOverlay('Media/FootageCrate-4K_Modern_HUD_Enemy_Map_1-matte.mp4', () => {
                  printToTerminal('> Module LOCATION déverrouillé et affiché dans le panneau.');
                  addModuleToPanel('LOCALISATION', 'locationData');
                });
              }, 500);
            } else {
              const hint = value < locationTarget ? 'Augmentez la valeur.' : 'Diminuez la valeur.';
              printToTerminal(`> ERROR: Calage hors fenêtre. ${hint}`);
            }
          }
        }
        break;

      case 'sequence':
        if (!modules.location.unlocked) {
          printToTerminal('> ERROR: Module LOCATION doit être déverrouillé d\'abord.');
        } else if (modules.contracts.unlocked) {
          printToTerminal('> ERROR: Module CONTRACTS déjà déverrouillé.');
        } else if (!args[1]) {
          printToTerminal('> USAGE: sequence <code>');
          printToTerminal('> Tapez "hint contracts" pour obtenir un indice.');
        } else {
          const seq = args[1].toLowerCase();
          if (seq === 'failsafe') {
            playSound('success');
            modules.contracts.unlocked = true;
            updateStatus();
            printToTerminal('> [FAILSAFE] Protocole de sécurité activé.');
            printToTerminal('> Chargement des données contractuelles...');
            
            setTimeout(() => {
              showVideoOverlay('Media/FootageCrate-4K_Modern_HUD_Node_Chart_1.webm', () => {
                printToTerminal('> Module CONTRACTS déverrouillé et affiché dans le panneau.');
                addModuleToPanel('CONTRATS', 'contractsData');
              });
            }, 500);
          } else if (seq.toUpperCase() === modules.contracts.sequence) {
            playSound('success');
            modules.contracts.unlocked = true;
            updateStatus();
            printToTerminal('> SUCCESS: Séquence compilée. Contrats déverrouillés!');
            printToTerminal('> Chargement des données contractuelles...');
            
            setTimeout(() => {
              showVideoOverlay('Media/FootageCrate-4K_Modern_HUD_Node_Chart_1.webm', () => {
                printToTerminal('> Module CONTRACTS déverrouillé et affiché dans le panneau.');
                addModuleToPanel('CONTRATS', 'contractsData');
              });
            }, 500);
          } else {
            printToTerminal('> ERROR: Séquence invalide. Compilation échouée.');
          }
        }
        break;

      case 'hack':
        const hackTarget = args[1] ? args[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
        if (!hackTarget) {
          printToTerminal('> USAGE: hack <module>');
          printToTerminal('> Modules disponibles: identité, contrats');
        } else if (hackTarget === 'identity' || hackTarget === 'identite' || hackTarget === 'identify') {
          if (modules.identity.unlocked) {
            printToTerminal('> Module IDENTITY déjà déverrouillé.');
          } else if (modules.identity.codeRevealed) {
            printToTerminal('> Hack déjà effectué. Utilisez les indices fournis.');
          } else {
            printToTerminal('> Initialisation du protocole de hack...');
            playSound('input');
            
            let progress = 0;
            const loadingInterval = setInterval(() => {
              progress += Math.floor(Math.random() * 15) + 10;
              if (progress > 100) progress = 100;
              const bars = '█'.repeat(Math.floor(progress / 5));
              const empty = '░'.repeat(20 - Math.floor(progress / 5));
              printToTerminal(`> Chargement: [${bars}${empty}] ${progress}%`);
              
              if (progress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                  printToTerminal('╬═══════════════════════════════════════════════════╗');
                  printToTerminal('║   HACK PROTOCOL: IDENTITY DECRYPTION             ║');
                  printToTerminal('╚═══════════════════════════════════════════════════╝');
                  printToTerminal('');
                  printToTerminal('> Connexion établie...', false, true);
                  printToTerminal('> [HeX] Infiltration du module IDENTITY...', false, true);
                  printToTerminal('> [HeX] Recherche des failles de sécurité...', false, true);
                  printToTerminal('');
                  printToTerminal('┌─────────────────────────────────────────────────┐');
                  printToTerminal('│  ANALYSE DU CHIFFREMENT EN COURS...             │');
                  printToTerminal('└─────────────────────────────────────────────────┘');
                  printToTerminal('');
              
              const code = modules.identity.code;
              const values = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5 };
              
              printToTerminal('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
              printToTerminal('┃  MATRICE DE DÉCRYPTAGE ALPHANUMÉRIQUE          ┃');
              printToTerminal('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');
              printToTerminal('');
              printToTerminal('    [A]═══1    [B]═══2    [C]═══3    [D]═══4    [E]═══5');
              printToTerminal('');
              
              code.split('').forEach((letter, i) => {
                const val = values[letter];
                const bars = '█'.repeat(val);
                const empty = '░'.repeat(5 - val);
                printToTerminal(`    Position ${i + 1}: │${bars}${empty}│ Valeur: ${val}`);
              });
              
              printToTerminal('');
              const sum = values[code[0]] + values[code[1]] + values[code[2]];
              printToTerminal(`    ╔═══════════════════════════════════════╗`);
              printToTerminal(`    ║  SOMME CRYPTOGRAPHIQUE = ${String(sum).padStart(2, ' ')}          ║`);
              printToTerminal(`    ╚═══════════════════════════════════════╝`);
              printToTerminal('');
              printToTerminal('> [HeX] Faille détectée! Extraction des données...', false, true);
              printToTerminal('');
              printToTerminal('┌─────────────────────────────────────────────────┐');
              printToTerminal('│  INDICE: Trouvez 3 lettres dont la somme = ' + sum + '   │');
              printToTerminal('└─────────────────────────────────────────────────┘');
                  printToTerminal('');
                  printToTerminal('> [HeX] Analyse terminée. Données extraites avec succès.', false, true);
                  printToTerminal('');
                  printToTerminal('╔═══════════════════════════════════════════════════╗');
                  printToTerminal('║   HACK TERMINÉ - Utilisez decrypt <code>         ║');
                  printToTerminal('╚═══════════════════════════════════════════════════╝');
                  
                  modules.identity.codeRevealed = true;
                  playSound('success');
                }, 500);
              }
            }, 300);
          }
        } else if (hackTarget === 'contracts' || hackTarget === 'contrats') {
          if (!modules.location.unlocked) {
            printToTerminal('> Déverrouillez d\'abord le module LOCATION.');
          } else if (modules.contracts.unlocked) {
            printToTerminal('> Module CONTRACTS déjà déverrouillé.');
          } else if (modules.contracts.codeRevealed) {
            printToTerminal('> Hack déjà effectué. Utilisez les indices fournis.');
          } else {
            printToTerminal('> Infiltration de la base de données CONTRACTS...');
            playSound('input');
            
            let progressC = 0;
            const loadingIntervalC = setInterval(() => {
              progressC += Math.floor(Math.random() * 15) + 10;
              if (progressC > 100) progressC = 100;
              const barsC = '█'.repeat(Math.floor(progressC / 5));
              const emptyC = '░'.repeat(20 - Math.floor(progressC / 5));
              printToTerminal(`> Chargement: [${barsC}${emptyC}] ${progressC}%`);
              
              if (progressC >= 100) {
                clearInterval(loadingIntervalC);
                setTimeout(() => {
                  printToTerminal('╬═══════════════════════════════════════════════════╗');
                  printToTerminal('║   HACK PROTOCOL: SEQUENCE RECONSTRUCTION         ║');
                  printToTerminal('╚═══════════════════════════════════════════════════╝');
                  printToTerminal('');
                  printToTerminal('> Connexion établie...', false, true);
                  printToTerminal('> [HeX] Pénétration de la base CONTRACTS...', false, true);
                  printToTerminal('> [HeX] Bypass des pare-feux... OK', false, true);
                  printToTerminal('');
                  printToTerminal('┌─────────────────────────────────────────────────┐');
                  printToTerminal('│  EXTRACTION DES FRAGMENTS DE SÉQUENCE...        │');
                  printToTerminal('└─────────────────────────────────────────────────┘');
                  printToTerminal('');
              
              const seq = modules.contracts.sequence;
              const counts = { 'A': 0, 'B': 0, 'C': 0, 'D': 0 };
              seq.split('').forEach(letter => counts[letter]++);
              
              printToTerminal('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
              printToTerminal('┃  MATRICE DE FRÉQUENCE DES CARACTÈRES           ┃');
              printToTerminal('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');
              printToTerminal('');
              
              Object.keys(counts).forEach(letter => {
                if (counts[letter] > 0) {
                  const bars = '█'.repeat(counts[letter]);
                  const empty = '░'.repeat(4 - counts[letter]);
                  printToTerminal(`    [${letter}] │${bars}${empty}│ Occurrences: ${counts[letter]}`);
                }
              });
              
              printToTerminal('');
              printToTerminal('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
              printToTerminal('┃  SÉQUENCE FRAGMENTÉE (4 POSITIONS)             ┃');
              printToTerminal('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');
              printToTerminal('');
              
              seq.split('').forEach((letter, i) => {
                const alphPos = letter.charCodeAt(0) - 64;
                const indicator = '►';
                printToTerminal(`    ${indicator} Slot ${i + 1}: Lettre #${alphPos} de l\'alphabet (A=1, B=2, C=3, D=4)`);
              });
              
              printToTerminal('');
              printToTerminal('    ┌───┬───┬───┬───┐');
              printToTerminal(`    │ ? │ ? │ ? │ ? │  ← Reconstituez la séquence`);
              printToTerminal('    └───┴───┴───┴───┘');
              printToTerminal('');
              printToTerminal('> [HeX] Décryptage des patterns de séquence...', false, true);
              printToTerminal('');
              printToTerminal('┌─────────────────────────────────────────────────┐');
              printToTerminal('│  INDICE: Utilisez la fréquence + positions     │');
              printToTerminal('└─────────────────────────────────────────────────┘');
                  printToTerminal('');
                  printToTerminal('> [HeX] Reconstruction complète. Data mined.', false, true);
                  printToTerminal('> [HeX] ≈≈≈ Access granted ≈≈≈', false, true);
                  printToTerminal('');
                  printToTerminal('╔═══════════════════════════════════════════════════╗');
                  printToTerminal('║   HACK TERMINÉ - Utilisez sequence <code>        ║');
                  printToTerminal('╚═══════════════════════════════════════════════════╝');
                  
                  modules.contracts.codeRevealed = true;
                  playSound('success');
                }, 500);
              }
            }, 300);
          }
        } else {
          printToTerminal('> Module inconnu ou ne nécessite pas de hack.');
          printToTerminal('> Modules disponibles: identité, contrats');
        }
        break;

      case 'intrude':
        if (!modules.contracts.unlocked) {
          printToTerminal('> ERROR: Module CONTRACTS doit être déverrouillé d\'abord.');
        } else if (modules.classified.unlocked) {
          printToTerminal('> ERROR: Module CLASSIFIÉ déjà déverrouillé.');
        } else if (args[1] && args[1].toLowerCase() === 'failsafe') {
          playSound('success');
          modules.classified.unlocked = true;
          stopCountdown();
          updateStatus();
          printToTerminal('> [FAILSAFE] Protocole de sécurité activé.');
          printToTerminal('> Module CLASSIFIÉ déverrouillé et affiché dans le panneau.');
          addModuleToPanel('CLASSIFIÉ', 'classifiedData');
          printToTerminal('═════════════════════════════════════════════════════');
          printToTerminal('> Tous les modules déverrouillés. Basculement en mode complet...');
          printToTerminal('> Compteur arrêté.');
          
          setTimeout(() => {
            const mainLayout = document.querySelector('.main-layout');
            const modulesPanel = document.getElementById('modulesPanel');
            mainLayout.classList.add('complete-view');
            modulesPanel.classList.add('full-view');
          }, 2000);
        } else {
          playSound('loading');
          printToTerminal('> Lancement de l\'intrusion profonde...');
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 20) + 10;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              playSound('success');
              modules.classified.unlocked = true;
              stopCountdown();
              updateStatus();
              printToTerminal('> SUCCESS: Intrusion complétée!');
              printToTerminal('> Module CLASSIFIÉ déverrouillé et affiché dans le panneau.');
              addModuleToPanel('CLASSIFIÉ', 'classifiedData');
              printToTerminal('═════════════════════════════════════════════════════');
              printToTerminal('> Tous les modules déverrouillés. Basculement en mode complet...');
              printToTerminal('> Compteur arrêté.');
              
              setTimeout(() => {
                const mainLayout = document.querySelector('.main-layout');
                const modulesPanel = document.getElementById('modulesPanel');
                mainLayout.classList.add('complete-view');
                modulesPanel.classList.add('complete');
                
                const panelHeader = document.querySelector('.panel-header h2');
                if (panelHeader) {
                  panelHeader.textContent = 'TOUS LES MODULES DÉVERROUILLÉS';
                }
              }, 1500);
            } else {
              printToTerminal(`> [${progress}%] Extraction en cours...`);
            }
          }, 500);
        }
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        printToTerminal('> Terminal cleared. Type \'help\' for commands.');
        break;

      case 'failsafe':
        playSound('success');
        modules.identity.unlocked = true;
        modules.location.unlocked = true;
        modules.contracts.unlocked = true;
        modules.classified.unlocked = true;
        stopCountdown();
        updateStatus();
        printToTerminal('> [FAILSAFE] Protocole de sécurité d\'urgence activé!');
        printToTerminal('> Déverrouillage de tous les modules...');
        printToTerminal('═════════════════════════════════════════════════════');
        
        addModuleToPanel('IDENTITÉ', 'identityData');
        addModuleToPanel('LOCALISATION', 'locationData');
        addModuleToPanel('CONTRATS', 'contractsData');
        addModuleToPanel('CLASSIFIÉ', 'classifiedData');
        
        printToTerminal('> Tous les modules déverrouillés. Basculement en mode complet...');
        printToTerminal('> Compteur arrêté.');
        
        setTimeout(() => {
          const mainLayout = document.querySelector('.main-layout');
          const modulesPanel = document.getElementById('modulesPanel');
          mainLayout.classList.add('complete-view');
          modulesPanel.classList.add('full-view');
        }, 2000);
        break;

      default:
        printToTerminal(`> ERROR: Commande inconnue '${mainCmd}'. Tapez 'help' pour l'aide.`);
        break;
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value;
      terminalInput.value = '';
      handleCommand(cmd);
    } else if (e.key === 'Backspace' && terminalInput.value.length > 0) {
      playSound('delete');
    } else if (e.key.length === 1) {
      playSound('input');
    }
  });

  terminalInput.addEventListener('click', () => {
    playSound('input');
  });

  setInterval(updateTimestamp, 1000);
  updateTimestamp();
  updateStatus();
});
