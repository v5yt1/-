// إنشاء الرابط بطريقة ضغط البيانات (Base64) ليكون ألقصر وبنفس اسم موقعك
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

    // 1. تجميع البيانات في كائن واحد
    const payload = {
        n: name,
        m: msg,
        l: lyrics,
        a: audio,
        q: questionsList
    };

    // 2. تحويل البيانات إلى نص مشفر وقصير (Base64)
    const jsonString = JSON.stringify(payload);
    const encodedData = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonString))));

    const baseUrl = window.location.href.split('?')[0];
    const finalUrl = `${baseUrl}?data=${encodedData}`;

    document.getElementById('generatedLink').value = finalUrl;
    document.getElementById('resultArea').classList.remove('hidden');
}

// قراءة بيانات الرابط عند فتح الصفحة من قبل المستلم
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('data')) {
        document.getElementById('builderView').classList.add('hidden');
        document.getElementById('giftView').classList.remove('hidden');

        try {
            // فك تشفير البيانات
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
            
            // ضبط تشغيل الأغنية المحلية
            const audioElement = document.getElementById('mainAudio');
            document.getElementById('audioSource').src = audioVal;
            audioElement.load();

            // تشغيل الأغنية عند لمس الشاشة
            const startAudioOnInteraction = () => {
                audioElement.play().catch(e => console.log('Autoplay block:', e));
                document.removeEventListener('click', startAudioOnInteraction);
                document.removeEventListener('touchstart', startAudioOnInteraction);
            };
            document.addEventListener('click', startAudioOnInteraction);
            document.addEventListener('touchstart', startAudioOnInteraction);

            // عرض الأسئلة والردود
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