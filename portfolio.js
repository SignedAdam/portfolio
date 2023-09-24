window.onload = async function() {
    try {
        const resumeData = await fetchResumeData();
        const layoutHtml = await fetchRandomLayout();
        injectLayout(layoutHtml);
        populateResume(resumeData);
    } catch (err) {
        console.error('Failed to load and populate resume:', err);
    }
};

async function fetchResumeData() {
    const response = await fetch("resume.json");
    return await response.json();
}

async function fetchRandomLayout() {
    const layoutNumber = Math.floor(Math.random() * 1) + 1; // fixed to 1 for now since there's only 1 layout
    const response = await fetch(`layouts/layout${layoutNumber}.html`);
    return await response.text();
}

function injectLayout(html) {
    document.getElementById("canvas").innerHTML = html;
}

function populatePersonalDetails(resumeData) {
  document.getElementById("name").textContent = resumeData.name;
  document.getElementById("location").textContent = resumeData.location;
  document.getElementById("email").textContent = resumeData.email;
  document.getElementById("phone").textContent = resumeData.phone;
  document.getElementById("website").textContent = resumeData.website;
  document.getElementById("summary").textContent = resumeData.summary;
}

function populateCoreSkills(coreSkills) {
  let coreSkillsList = document.getElementById("coreSkillsList");
  let coreSkillsNode = coreSkillsList.cloneNode(true); // Deep clone
  let coreSkillSampleNode = coreSkillsNode.querySelector("li");
  coreSkillsList.innerHTML = ""; // Clear the list

  // Create a new document fragment, which is a minimal document object that can hold nodes.
  let fragment = document.createDocumentFragment();

  let tasks = [];

  failedImages = [];
  for (let coreSkill of coreSkills) {
    tasks.push(
      new Promise(async (resolve, reject) => {
        let newCoreSkillNode = coreSkillSampleNode.cloneNode(true);

        newCoreSkillNode.querySelector("span").textContent = coreSkill;
        newCoreSkillNode.querySelector("img").src = "./assets/" + coreSkill.replace(" ", "_").toLowerCase() + ".svg";

        let imgEl = new Image();

        imgEl.onload = function () {
          let colors = getAverageColor(imgEl);
          newCoreSkillNode.style.backgroundColor = colors.backgroundColor;
          newCoreSkillNode.style.color = colors.textColor;

          // if the image is dark and the background is light, invert the image
          if (colors.invert) {
            newCoreSkillNode.querySelector("img").style.filter = "invert(1)";
          }
          resolve(newCoreSkillNode);
        };
        imgEl.onerror = function () {
          failedImages.push(coreSkill);
          newCoreSkillNode.style.backgroundColor = "grey"; // Fallback color if image load fails
          resolve(newCoreSkillNode);
        };
        imgEl.src = "./assets/" + coreSkill.replace(/ /g, "_").toLowerCase() + ".svg";
      })
    );
  }
  console.log("failed to load the following images: ", failedImages);

  Promise.all(tasks).then((nodes) => {
    nodes.forEach((newCoreSkillNode) => {
      fragment.appendChild(newCoreSkillNode);
    });

    // Append the fragment to the DOM
    coreSkillsList.appendChild(fragment.cloneNode(true));
    // Clone the whole fragment and append it again to create the infinite loop
    coreSkillsList.appendChild(fragment);
  });
}

function populateLanguages(languages) {
  let languagesContainer = document.getElementById("languages");
  let languagesSampleNode = languagesContainer.querySelector("li");
  languagesContainer.innerHTML = ""; // Clear the container
  languages.forEach((language) => {
    let newNode = languagesSampleNode.cloneNode();
    newNode.textContent = language;
    languagesContainer.appendChild(newNode);
  });
}

function populateExperience(experience) {
  let experienceContainer = document.getElementById("experience");
  let experienceSampleNode = experienceContainer.querySelector("div");
  experienceContainer.innerHTML = ""; // Clear the container
  experience.forEach((job) => {
    console.log(job);
    let newNode = experienceSampleNode.cloneNode(true); // Deep clone
    newNode.querySelector("#companyLogo").src = job.iconPath;
    newNode.querySelector("#companyName").textContent = job.company;
    newNode.querySelector("#jobTitle").textContent = job.title;
    newNode.querySelector("#jobLocation").textContent = job.location;
    newNode.querySelector("#jobDate").textContent =
      job.startDate + " - " + job.endDate;
    newNode.querySelector("#jobDescription").textContent = job.description;

    let jobTechStackList = newNode.querySelector("#jobTechStack");
    let jobTechStackSampleNode = jobTechStackList.querySelector("li");
    jobTechStackList.innerHTML = ""; // Clear the list

    // Create a new document fragment, which is a minimal document object that can hold nodes.
    let fragment = document.createDocumentFragment();

    let tasks = [];

    for (let stackItem of job.techStack) {
      tasks.push(
        new Promise(async (resolve, reject) => {
          let techStackNode = jobTechStackSampleNode.cloneNode(true);

          techStackNode.querySelector("span").textContent = stackItem;
          techStackNode.querySelector("img").src = "./assets/" + stackItem.replace(" ", "_").toLowerCase() + ".svg";

          let imgEl = new Image();

          imgEl.onload = function () {
            let colors = getAverageColor(imgEl);
            techStackNode.style.backgroundColor = colors.backgroundColor;
            techStackNode.style.color = colors.textColor;

            // if the image is dark and the background is light, invert the image
            if (colors.invert) { 
              console.log("inverting")
              techStackNode.querySelector("img").style.filter = "invert(1)";
            }
            resolve(techStackNode);
          };
          imgEl.onerror = function () {
            console.log("Failed to load image for " + stackItem);
            techStackNode.style.backgroundColor = "grey"; // Fallback color if image load fails
            resolve(techStackNode);
          };
          imgEl.src = "./assets/" + stackItem.replace(/ /g, "_").toLowerCase() + ".svg";
        })
      );
    }

    Promise.all(tasks).then((nodes) => {
      nodes.forEach((techStackNode) => {
        fragment.appendChild(techStackNode);
      });

      // Append the fragment to the DOM
      jobTechStackList.appendChild(fragment.cloneNode(true));
      // Clone the whole fragment and append it again to create the infinite loop
      jobTechStackList.appendChild(fragment);
    });

    let responsibilitiesList = newNode.querySelector("#jobResponsibilities");
    let responsibilitiesSampleNode = responsibilitiesList.querySelector("li");
    responsibilitiesList.innerHTML = ""; // Clear the list
    job.responsibilities.forEach((responsibility) => {
      let responsibilityNode = responsibilitiesSampleNode.cloneNode();
      responsibilityNode.textContent = responsibility;
      responsibilitiesList.appendChild(responsibilityNode);
    });

    let achievementsList = newNode.querySelector("#jobAchievements");
    // if there are no achievements, hide the section
    if (job.achievements.length === 0) {
      newNode.querySelector("#achievements").style.display = "none";
    }
    let achievementsSampleNode = achievementsList.querySelector("li");
    achievementsList.innerHTML = ""; // Clear the list
    job.achievements.forEach((achievement) => {
      let achievementNode = achievementsSampleNode.cloneNode();
      achievementNode.textContent = achievement;
      achievementsList.appendChild(achievementNode);
    });

    experienceContainer.appendChild(newNode);
  });
}

// Assuming resumeData is the fetched JSON resume data
function populateResume(resumeData) {
  populatePersonalDetails(resumeData);

  // Handle Core Skills
  populateCoreSkills(resumeData.coreSkills);

  // Handle Languages
  populateLanguages(resumeData.languages);

  // Handle Experience
  populateExperience(resumeData.experience);
}

function getAverageColor(imgEl) {
  let canvas = document.createElement('canvas');
  canvas.width = imgEl.naturalWidth;
  canvas.height = imgEl.naturalHeight;

  let ctx = canvas.getContext('2d');
  ctx.drawImage(imgEl, 0, 0, imgEl.naturalWidth, imgEl.naturalHeight);

  let imageData = ctx.getImageData(0, 0, imgEl.naturalWidth, imgEl.naturalHeight);
  let data = imageData.data;
  let r = 0;
  let g = 0;
  let b = 0;

  for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
  }

  let offset = 25;
  r = Math.min(255, r / (data.length / 4) + offset);
  g = Math.min(255, g / (data.length / 4) + offset);
  b = Math.min(255, b / (data.length / 4) + offset);

  let brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
  let textColor = brightness > 125 ? 'black' : 'white';
  let invert = false
  if (brightness < 55 && withinRange(r, g, b, 10)) {
      invert = true;
  }
  return {
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
      textColor: textColor,
      invert: invert
  };
}

// returns true if the 3 given numbers are within a given range of each other
function withinRange(num1, num2, num3, range) {
  let max = Math.max(num1, num2, num3);
  let min = Math.min(num1, num2, num3);
  return max - min <= range;
}