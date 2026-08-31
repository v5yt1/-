// إنشاء الرابط السحري واختصاره تلقائياً
async function generateLink(e) {
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
    const longUrl = `${baseUrl}?name=${name}&msg=${msg}&lyrics=${lyrics}&audio=${audio}&qs=${qsJson}`;

    // إظهار نص جاري الاختصار
    const linkInput = document.getElementById('generatedLink');
    document.getElementById('resultArea').classList.remove('hidden');
    linkInput.value = "جاري اختصار الرابط... ⏳";

    // طلب اختصار الرابط عن طريق API مجاني
    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        if (response.ok) {
            const shortUrl = await response.text();
            linkInput.value = shortUrl;
        } else {
            linkInput.value = longUrl; // في حال فشل API يرجع للرابط الطويل
        }
    } catch (err) {
        linkInput.value = longUrl;
    }
}