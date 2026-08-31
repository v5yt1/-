// توليد خلفية النجوم
function generateStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;
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
    if (!container) return;
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
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'q-block';
    div.id = `qBlock_${qCount}`;
    div.innerHTML = `
        <input type="text" class="q-input" placeholder="السؤال ${qCount}..." value="${qText}" required>
        <input type="text" class="r-input" placeholder="الرد في حال الإجابة بـ (نعم)..." value="${resText}" required>
    `;
    container.appendChild(div);
}

// إضافة 3 أسئلة افتراضية عند التحميل
addQuestionField('هل تحبني مثل ما أحبك؟', 'أعرف بيك تحبني! ❤️🥰');
addQuestionField('راح تظل وياي للأبد؟', 'ووعد شرف للموت! 💍✨');
addQuestionField('تعتبرني أغلى شي بحياتك؟', 'أنت كل حياتي ومكتفي بيك! 💜');

// إنشاء الرابط بطريقة ضغط البيانات (Base64)
function generateLink(e) {
    e.preventDefault();

    const name = document.getElementById('inputName').value;
    const msg = document.getElementById('inputMessage').value;
    const lyrics = document.getElementById('inputLyrics').value;
    const audio = document.getElementById('audioSelect').value;

    const qInputs = document.querySelectorAll('.q-input');
    const rInputs = document.querySelectorAll('.r-input');
    const questionsList = [];

    qInputs.forEach((qEl, i) => {
        questionsList.push({
            q: qEl.value,
            r: rInputs[i].value
        });
    });

    const payload = {
        n: name,
        m: msg,
        l: lyrics,
        a: audio,
        q: questionsList
    };

    const jsonString = JSON.stringify(payload);
    const encodedData = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonString))));

    const baseUrl = window.location.href.split('?')[0];
    const finalUrl = `${baseUrl}?data=${encodedData}`;

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

// قراءة بيانات الرابط عند فتح الصفحة من قبل المستلم
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('data')) {
        document.getElementById('builderView').classList.add('hidden');
        document.getElementById('giftView').classList.remove('hidden');

        try {
            const rawData = urlParams.get('data');
            const decodedJson = decodeURIComponent(escape(atob(decodeURIComponent(rawData))));
            const data = JSON.parse(decodedJson);

            const nameVal = data.n;
            const lyricsVal = data.l || '';
            const audioVal = data.a || 'song1.mp3';
            const firstLetter = nameVal.charAt(0).toUpperCase();

            document.getElementById('displayName').innerText = nameVal;
            document.getElementById('letterDisplay').innerText = firstLetter;
            document.getElementById('displayMessage').innerText = data.m;
            
            const audioElement = document.getElementById('mainAudio');
            document.getElementById('audioSource').src = audioVal;
            audioElement.load();

            const startAudioOnInteraction = () => {
                audioElement.play().catch(e => console.log('Autoplay block:', e));
                document.removeEventListener('click', startAudioOnInteraction);
                document.removeEventListener('touchstart', startAudioOnInteraction);
            };
            document.addEventListener('click', startAudioOnInteraction);
            document.addEventListener('touchstart', startAudioOnInteraction);

            const qBox = document.getElementById('displayQuestionsBox');
            qBox.innerHTML = '';

            if (data.q) {
                data.q.forEach((item, index) => {
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
            }

            spawnFloatingItems(firstLetter, lyricsVal);
        } catch (e) {
            console.error('Error parsing gift data:', e);
        }
    }
};