const inputText = document.getElementById("inputText");
const translateBtn = document.getElementById("translateBtn");
const resultP = document.getElementById("results");
const recordBtn = document.getElementById("recordBtn");
const languageSelect = document.getElementById("language");

// 🎤 Call backend speech recognition
recordBtn.addEventListener("click", async () => {
  try {
    const res = await fetch("http://127.0.0.1:5000/speech");
    const data = await res.json();

    if (data.text) {
      inputText.value = data.text;
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    alert("Could not connect to speech recognition server");
  }
});

// 🌍 Translate on click
translateBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  const lang = languageSelect.value;

  if (!text) {
    alert("Enter some text or record first");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, target_lang: lang }),
    });

    const data = await res.json();

    if (data.translated) {
      resultP.innerText = data.translated;
    } else {
      resultP.innerText = "Error: " + data.error;
    }
  } catch (err) {
    resultP.innerText = "Could not connect to translation server.";
  }
});
