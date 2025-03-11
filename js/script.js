const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("avatar");
const messageElement = document.getElementById("uploadMessage");
const avatarIcon = document.getElementById("avatarIcon");
const avatarWrapper = document.getElementById("avatarWrapper");
const avatarImg = document.getElementById("avatarImg");
const avatarButtonWrapper = document.getElementById("avatarButtonWrapper");
const avatarP = document.getElementById("avatarP");
const removeImageButton = document.getElementById('removeImageButton');
const changeImageButton = document.getElementById('changeImageButton');
const defaultUploadMessage = "Upload your photo (JPG or PNG, max size: 500KB).";
const ticketForm = document.getElementById("form");
let isFileValid = false; // Flag to track valid file
const fullNameWrapper = document.getElementById("full-name-wrapper");
const emailWrapper = document.getElementById("email-wrapper");
const githubWrapper = document.getElementById("github-wrapper");
const emailMessage = document.getElementById('email-message');
const formButton = document.getElementById('form-button');
const avatarLabel = document.getElementById("avatar-label");
const svgavatar = document.getElementById("svg-avatar-wrapper");
const ticketContainer = document.getElementById("ticket-container");
const successContainer = document.getElementById("success-container");
const userName = document.getElementById("success-name");
const userEmail = document.getElementById("success-email");
const ticketName = document.getElementById("svg-name");
const ticketGithub = document.getElementById("svg-github");
const date = document.getElementById("date");

// Open file dialog when clicking the drop area
dropArea.addEventListener("click", () => {
  console.log("drop area click");
  if(isFileValid) {
    return;
  }
  fileInput.click()
});

// Open file dialog when user clicks on change image button
changeImageButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    fileInput.value = "";
    fileInput.click();
});

removeImageButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    fileInput.value = "";
    resetAvatarDefault();
});

// Handle file selection
fileInput.addEventListener("change", (event) => {
    console.log("change dialog");
    const file = event.target.files[0];
    if (file) {
      validateFile(file);
    }
});

// Handle drag & drop events
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    if(isFileValid) {
      return;
    }
    dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
  if(isFileValid) {
    return;
  }
  dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    if(isFileValid) {
      return;
    }
    dropArea.classList.remove("dragover");
    const file = event.dataTransfer.files[0];
    if (file) {
      validateFile(file);
    }
});

avatarLabel.addEventListener("click", (event) => {
  if (isFileValid) {
      event.preventDefault();
  }
});

function resetAvatarDefault() {
    avatarIcon.classList.remove("red");
    avatarIcon.classList.remove("green");
    avatarImg.classList.remove("hidden");
    avatarP.classList.remove("hidden");
    avatarWrapper.style.backgroundImage = `none`;
    avatarButtonWrapper.classList.add("hidden");
    dropArea.classList.remove("file-accepted");
    avatarLabel.classList.remove("file-accepted");
    messageElement.textContent = defaultUploadMessage;
    messageElement.style.color = "hsl(252, 6%, 83%)";
    isFileValid = false;
}

// Validate file type and size
function validateFile(file) {
    const maxSize = 500 * 1024; // 500KB in bytes
    const validTypes = ["image/jpeg", "image/png"];

    resetAvatarDefault();

    if (!validTypes.includes(file.type)) {
      // Show an error message in the UI
      messageElement.textContent = "Please upload a JPG or PNG image.";
      messageElement.style.color = "red";
      avatarIcon.classList.add("red");
      return;
    }

    if (file.size > maxSize) {
      // Show an error message in the UI
      messageElement.textContent = "File size exceeds 500KB. Please upload a smaller image.";
      messageElement.style.color = "red";
      avatarIcon.classList.add("red");
      return;
    }

    // If validation passes, show success message or proceed with file handling
    messageElement.textContent = "File selected: " + file.name;
    messageElement.style.color = "green";
    avatarIcon.classList.add("green");
    avatarImg.classList.add("hidden");
    avatarP.classList.add("hidden");
    avatarButtonWrapper.classList.remove("hidden");
    dropArea.classList.add("file-accepted");
    avatarLabel.classList.add("file-accepted");

    // load img as background
    const reader = new FileReader();
    reader.onload = function (e) {
      // Set the background image of the avatarWrapper
      console.log("background image", e.target.result);
      avatarWrapper.style.backgroundImage = `url(${e.target.result})`;
      avatarWrapper.style.backgroundSize = 'cover'; // Make the image cover the div
      avatarWrapper.style.backgroundPosition = 'center'; // Center the image in the div
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);

    isFileValid = true;
    
}

// form submit and validate email

function handleSubmit(e) {

  e.preventDefault();

  let allMandatoryFieldsComplete = true;
  let allFieldsNotBlank = true;

  console.log("handle submit");

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  const emailInput = data["email"];
  const fullName = data["fullname"];
  const github = data["github"];

  // Object.fromEntries(formData) converts the FormData object into a plain object.
  // However, file inputs (<input type="file">) are not properly handled in this conversion!
  // The avatar key will only contain the file name as a string, not the actual File object.
  // To fix this, Instead of converting FormData to an object with Object.fromEntries(), directly get the file from formData:

  const avatar = formData.get("avatar");

  // Log all form fields
  // for (let [key, value] of formData.entries()) {
  //   console.log(`${key}:`, value);
  // }

  dropArea.classList.remove("highlight");
  fullNameWrapper.classList.remove("highlight");
  emailWrapper.classList.remove("highlight");
  githubWrapper.classList.remove("highlight");
  emailMessage.classList.add("hidden");
  formButton.classList.remove("highlight");

  if(!isFileValid) {
    console.log("file not valid");
    allMandatoryFieldsComplete = false;
  }

  console.log("avatar file", avatar);

  if(!avatar || avatar.size === 0) {
    console.log("file blank", avatar);
    allMandatoryFieldsComplete = false;
    allFieldsNotBlank = false;
    dropArea.classList.add("highlight");
  }

  if (fullName.trim() === "") {
    allMandatoryFieldsComplete = false;
    allFieldsNotBlank = false;
    fullNameWrapper.classList.add("highlight");
  }

  if (emailInput.trim() === "") {
    allMandatoryFieldsComplete = false;
    allFieldsNotBlank = false;
    emailWrapper.classList.add("highlight");
  } else if(!validateEmail(emailInput)) {
    emailMessage.classList.remove("hidden");
    allMandatoryFieldsComplete = false;
  }

  if (github.trim() === "") {
    allMandatoryFieldsComplete = false;
    allFieldsNotBlank = false;
    githubWrapper.classList.add("highlight");
  }

  if (!allFieldsNotBlank) {
    formButton.classList.add("highlight");
  }

  if(allFieldsNotBlank && allMandatoryFieldsComplete) {
    createTicket(avatar, fullName, emailInput, github);
  }
}

function createTicket(avatar, name, email, github) {
  ticketContainer.classList.add("fade-out");

  if (avatar) {
    const reader = new FileReader();
    reader.onload = function (e) {
      svgavatar.style.backgroundImage = `url(${e.target.result})`;
    };
    reader.readAsDataURL(avatar); // Convert file to data URL
  }

  if (name) {
    userName.textContent = name;
    ticketName.textContent = name;
  }

  if (email) {
    userEmail.textContent = email;
  }

  if (github) {
    ticketGithub.textContent = github;
  }

  const today = new Date();
  const day = today.getDate();
  const year = today.getFullYear();
  const monthAbbrev = today.toLocaleString('en-US', { month: 'short' });

  date.textContent = `${monthAbbrev} ${day}, ${year}`;
}

ticketContainer.addEventListener("transitionend", function (event) {
  if (event.propertyName === "opacity" && window.getComputedStyle(ticketContainer).opacity === "0") {
    
    ticketContainer.classList.add("hidden");
    successContainer.classList.remove("hidden");
    void successContainer.offsetHeight;
    successContainer.classList.add("fade-in");
  }
});

function validateEmail(email) {
  const emailRegex = /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
  return emailRegex.test(email);
}

ticketForm.addEventListener('submit', handleSubmit);