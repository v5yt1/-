// توليد خلفية النجوم
function generateStars() {
    const container = document.getElementById('stars-container');
    for (let i = 0; i < 65; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(star);
    }
}
generateStars();

// توليد الحروف والكلمات المطشرة بالخلفية
function spawnFloatingItems(letter, lyrics) {
    const container = document.getElementById('floating-elements');
    const wordsArray = lyrics ? lyrics.trim().split(' ') : [];
    const items = [letter, ...wordsArray, '❤️', '✨', '💜'];
    
    setInterval(() => {
        const el = document.createElement('div');
        el.classList.add('floating-item');
        el.innerText = items[Math.floor(Math.random() * items.length)];
        el.style.left = Math.random() * 90 + 'vw';
        el.style.fontSize = (Math.random() * 1.1 + 0.8) + 'rem';
        el.style.animationDuration = (Math.random() * 3 + 5) + 's';
        container.appendChild(el);

        setTimeout(() => el.remove(), 7000);
    }, 350);
}

// إضافة الأسئلة ديناميكياً في صانع الهدية
let qCount = 0;
function addQuestionField(qText = '', resText = '') {
    qCount++;
    const container = document.getElementById('questionsContainer');
    const div = document.createElement('div');
    div.className = 'q-block';
    div.id = `qBlock_${qCount}`;
    div.innerHTML = `
        <input type="text" class="q-input" placeholder="السؤال ${qCount}..." value="${qText}" required>
        <input type="text" class="r-input" placeholder="الرد في حال الإجابة بـ (نعم)..." value="${resText}" required>
    `;
    container.appendChild(div);
}

// إضافة أول 3 أسئلة افتراضية
addQuestionField('هل تحبني مثل ما أحبك؟', 'أعرف بيك تحبني! ❤️🥰');
addQuestionField('راح تظل وياي للأبد؟', 'ووعد شرف للموت! 💍✨');
addQuestionField('تعتبرني أغلى شي بحياتك؟', 'أنت كل حياتي ومكتفي بيك! 💜');

// قراءة بيانات الرابط عند الفتح
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('name')) {
        document.getElementById('builderView').classList.add('hidden');
        document.getElementById('giftView').classList.remove('hidden');

        const nameVal = urlParams.get('name');
        const lyricsVal = urlParams.get('lyrics') || '';
        const audioVal = urlParams.get('audio') || 'song1.mp3';
        const firstLetter = nameVal.charAt(0).toUpperCase();

        document.getElementById('displayName').innerText = nameVal;
        document.getElementById('letterDisplay').innerText = firstLetter;
        document.getElementById('displayMessage').innerText = urlParams.get('msg');
        
        // ضبط تشغيل الملف المحلي Selected Audio
        const audioElement = document.getElementById('mainAudio');
        document.getElementById('audioSource').src = audioVal;
        audioElement.load();

        // تشغيل الأغنية عند اللمس لتجاوز حظر المتصفح
        const startAudioOnInteraction = () => {
            audioElement.play().catch(e => console.log('Autoplay policy block:', e));
            document.removeEventListener('click', startAudioOnInteraction);
            document.removeEventListener('touchstart', startAudioOnInteraction);
        };
        document.addEventListener('click', startAudioOnInteraction);
        document.addEventListener('touchstart', startAudioOnInteraction);

        // بناء الأسئلة التفاعلية والردود
        try {
            const questionsData = JSON.parse(decodeURIComponent(urlParams.get('qs')));
            const qBox = document.getElementById('displayQuestionsBox');
            qBox.innerHTML = '';

            questionsData.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'single-quiz-card';
                card.innerHTML = `
                    <h3>${item.q}</h3>
                    <div class="interactive-btns">
                        <button class="yes-btn" onclick="showResponse(${index}, '${item.r}')">أكيد! ❤️</button>
                        <button class="no-btn" onmouseover="dodgeBtn(this)" onclick="dodgeBtn(this)">لا 😜</button>
                    </div>
                    <p id="res_${index}" class="response-text"></p>
                `;
                qBox.appendChild(card);
            });
        } catch (e) {
            console.error('Error loading questions:', e);
        }

        spawnFloatingItems(firstLetter, lyricsVal);
    }
};

// إنشاء الرابط السحري
function generateLink(e) {
    e.preventDefault();

    const name = encodeURIComponent(document.getElementById('inputName').value);
    const msg = encodeURIComponent(document.getElementById('inputMessage').value);
    const lyrics = encodeURIComponent(document.getElementById('inputLyrics').value);
    const audio = encodeURIComponent(document.getElementById('audioSelect').value);

    // تجميع الأسئلة والردود
    const qInputs = document.querySelectorAll('.q-input');
    const rInputs = document.querySelectorAll('.r-input');
    const questionsList = [];

    qInputs.forEach((qEl, i) => {
        questionsList.push({
            q: qEl.value,
            r: rInputs[i].value
        });
    });

    const qsJson = encodeURIComponent(JSON.stringify(questionsList));
    const baseUrl = window.location.href.split('?')[0];
    const finalUrl = `${baseUrl}?name=${name}&msg=${msg}&lyrics=${lyrics}&audio=${audio}&qs=${qsJson}`;

    document.getElementById('generatedLink').value = finalUrl;
    document.getElementById('resultArea').classList.remove('hidden');
}

// نسخ الرابط
function copyLink() {
    const linkInput = document.getElementById('generatedLink');
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value);
    alert("تم نسخ الرابط بنجاح! 🚀");
}

// عرض الرد عند الضغط على نعم
function showResponse(idx, responseText) {
    document.getElementById(`res_${idx}`).innerText = responseText;
}

// حركة هروب زر (لا)
function dodgeBtn(btn) {
    const x = (Math.random() - 0.5) * 140;
    const y = (Math.random() - 0.5) * 60;
    btn.style.transform = `translate(${x}px, ${y}px)`;
}