const registerBtn = document.getElementById("registerBtn");
const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const registerForm = document.getElementById("registerForm");
const phoneInput = document.getElementById("phone");
const fullNameInput = document.getElementById("fullName");
const subscribeModalOverlay = document.getElementById("subscribeModalOverlay");
const subscribeBtn = document.getElementById("subscribeBtn");
const fullNameError = document.getElementById("fullNameError");
const phoneError = document.getElementById("phoneError");

closeModal.addEventListener("click", () => {
  hideError(fullNameInput, fullNameError);
  hideError(phoneInput, phoneError);
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    hideError(fullNameInput, fullNameError);
    hideError(phoneInput, phoneError);
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
});

phoneInput.addEventListener("focus", () => {
  if (!phoneInput.value || !phoneInput.value.startsWith("+998")) {
    phoneInput.value = "+998 ";
  }
});

phoneInput.addEventListener("input", (e) => {
  let value = e.target.value;

  let digits = value.replace(/[^\d+]/g, "");

  if (!digits.startsWith("+998")) {
    digits = "+998" + digits.replace(/\+998/, "").replace(/\D/g, "");
  }

  let phoneNumber = digits.replace("+998", "").replace(/\D/g, "");

  if (phoneNumber.length > 9) {
    phoneNumber = phoneNumber.substring(0, 9);
  }

  let formatted = "+998 ";
  if (phoneNumber.length > 0) {
    formatted += phoneNumber.substring(0, 2);
  }
  if (phoneNumber.length > 2) {
    formatted += " " + phoneNumber.substring(2, 5);
  }
  if (phoneNumber.length > 5) {
    formatted += "-" + phoneNumber.substring(5, 7);
  }
  if (phoneNumber.length > 7) {
    formatted += "-" + phoneNumber.substring(7, 9);
  }

  phoneInput.value = formatted;

  const cursorPosition = phoneInput.selectionStart;
  if (cursorPosition < 5) {
    setTimeout(() => {
      phoneInput.setSelectionRange(5, 5);
    }, 0);
  }
});

phoneInput.addEventListener("keydown", (e) => {
  const cursorPosition = phoneInput.selectionStart;

  if ((e.key === "Backspace" || e.key === "Delete") && cursorPosition <= 5) {
    e.preventDefault();
    return false;
  }

  if (
    !/[0-9]/.test(e.key) &&
    ![
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ].includes(e.key)
  ) {
    e.preventDefault();
    return false;
  }
});

phoneInput.addEventListener("paste", (e) => {
  e.preventDefault();
  const pastedText = (e.clipboardData || window.clipboardData).getData("text");
  const digits = pastedText.replace(/\D/g, "");

  if (digits.length > 0) {
    let phoneNumber = digits;
    if (phoneNumber.length > 9) {
      phoneNumber = phoneNumber.substring(0, 9);
    }

    let formatted = "+998 ";
    if (phoneNumber.length > 0) {
      formatted += phoneNumber.substring(0, 2);
    }
    if (phoneNumber.length > 2) {
      formatted += " " + phoneNumber.substring(2, 5);
    }
    if (phoneNumber.length > 5) {
      formatted += "-" + phoneNumber.substring(5, 7);
    }
    if (phoneNumber.length > 7) {
      formatted += "-" + phoneNumber.substring(7, 9);
    }

    phoneInput.value = formatted;
    phoneInput.setSelectionRange(formatted.length, formatted.length);
  }
});

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";

  hideError(fullNameInput, fullNameError);
  hideError(phoneInput, phoneError);
  fullNameInput.value = "";

  setTimeout(() => {
    phoneInput.value = "+998 ";
    phoneInput.setSelectionRange(5, 5);
  }, 100);
});

function validateFullName() {
  const value = fullNameInput.value.trim();
  if (value.length === 0) {
    showError(fullNameInput, fullNameError, "Ism va familya kiritilishi shart");
    return false;
  }
  if (value.length < 2) {
    showError(
      fullNameInput,
      fullNameError,
      "Ism va familya kamida 2 belgidan iborat bo'lishi kerak"
    );
    return false;
  }
  hideError(fullNameInput, fullNameError);
  return true;
}

function validatePhone() {
  const value = phoneInput.value;
  const phoneNumber = value.replace(/\+998[\s-]/g, "").replace(/\D/g, "");

  if (phoneNumber.length === 0) {
    showError(phoneInput, phoneError, "Telefon raqam kiritilishi shart");
    return false;
  }

  if (phoneNumber.length !== 9) {
    showError(
      phoneInput,
      phoneError,
      "Telefon raqam to'liq bo'lishi kerak (+998 XX XXX-XX-XX)"
    );
    return false;
  }

  hideError(phoneInput, phoneError);
  return true;
}

function showError(input, errorElement, message) {
  input.classList.add("modal__input--error");
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function hideError(input, errorElement) {
  input.classList.remove("modal__input--error");
  errorElement.textContent = "";
  errorElement.style.display = "none";
}

fullNameInput.addEventListener("blur", validateFullName);
fullNameInput.addEventListener("input", () => {
  if (fullNameInput.classList.contains("modal__input--error")) {
    validateFullName();
  }
});

phoneInput.addEventListener("blur", validatePhone);
phoneInput.addEventListener("input", () => {
  if (phoneInput.classList.contains("modal__input--error")) {
    validatePhone();
  }
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const isFullNameValid = validateFullName();
  const isPhoneValid = validatePhone();

  if (!isFullNameValid || !isPhoneValid) {
    if (!isFullNameValid) {
      fullNameInput.focus();
      fullNameInput.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (!isPhoneValid) {
      phoneInput.focus();
      phoneInput.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    return;
  }

  const fullName = fullNameInput.value.trim();
  const phone = phoneInput.value;

  // Darhol keyingi bosqichga o'tkazamiz
  modalOverlay.classList.remove("active");
  subscribeModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";

  // POST so'rovini orqa fonda yuboramiz (fire-and-forget)
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbw4tfLjjNZ6za3TQX28RkSZCbLz8-vNyQH-QtYyKJ3OWu0vLvLrBEU8Bvi18Kha0_A5/exec";

  const payload = JSON.stringify({
    fullName: fullName,
    phone: phone,
    timestamp: new Date().toISOString(),
  });

  // Orqa fonda yuborish, natijani kutmagan holda
  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  }).catch((error) => {
    console.error("Error sending form data:", error);
    // Xato bo'lsa ham foydalanuvchi ko'rgan modal o'zgarmaydi
  });
});

subscribeModalOverlay.addEventListener("click", (e) => {
  if (e.target !== subscribeModalOverlay) {
    e.stopPropagation();
  }
});

const timerNumber = document.querySelector(".link__timer-number");

function startTimer() {
  let totalSeconds = 120;

  function updateTimer() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    if (timerNumber) {
      timerNumber.textContent = `${formattedMinutes}:${formattedSeconds}`;
    }

    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      clearInterval(timerInterval);
    }
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
}

if (timerNumber) {
  startTimer();
}
