window.onload = function () {
  console.log("Hello World!");
  // load the resume data from the JSON file
  fetch("resume.json")
    .then((response) => response.json())
    .then((data) => {
      // randomly choose a layout
      let layoutNumber = Math.floor(Math.random() * 1) + 1;
      // load the selected layout
      fetch(`layouts/layout${layoutNumber}.html`)
        .then((response) => response.text())
        .then((html) => {
          // inject the layout HTML into the page
          document.getElementById("canvas").innerHTML = html;
          // inject the resume data into the layout
          populateResume(data);
        });
    });
};

function injectResumeData(data) {
  // find the elements in the layout that will hold the resume data
  let nameElement = document.getElementById("name");
  let locationElement = document.getElementById("location");
  let experienceDiv = document.getElementById("experience");

  // inject the resume data into the elements
  nameElement.textContent = data.name;
  locationElement.textContent = data.location;

  console.log(data.experience);
  for (let i = 0; i < data.experience.length; i++) {
    let experience = data.experience[i];
    let experienceElement = createExperienceElement(experience);
    experienceDiv.appendChild(experienceElement);
    // add horizontal lines between experiences
    if (i < data.experience.length - 1) {
      let horizontalLine = document.createElement("hr");
      experienceDiv.appendChild(horizontalLine);
      document.cloneNode(false);
    }
  }
}

function createExperienceElement(experience) {
  // create the elements that will hold the experience data
  let experienceElement = document.createElement("div");
  let titleElement = document.createElement("h3");
  let dateElement = document.createElement("p");
  let descriptionElement = document.createElement("p");
  let responsibilitiesElement = document.createElement("ul");

  // inject the experience data into the elements
  titleElement.textContent = experience.title;
  dateElement.textContent = experience.startDate + " - " + experience.endDate;
  descriptionElement.textContent = experience.description;
  for (let i = 0; i < experience.responsibilities.length; i++) {
    let responsibility = experience.responsibilities[i];
    let responsibilityElement = document.createElement("li");
    responsibilityElement.textContent = responsibility;
    responsibilitiesElement.appendChild(responsibilityElement);
  }

  // add the experience data to the experience element
  experienceElement.appendChild(titleElement);
  experienceElement.appendChild(dateElement);
  experienceElement.appendChild(descriptionElement);
  experienceElement.appendChild(responsibilitiesElement);

  return experienceElement;
}

// Assuming resumeData is the fetched JSON resume data
function populateResume(resumeData) {
  document.getElementById("name").textContent = resumeData.name;
  document.getElementById("location").textContent = resumeData.location;
  document.getElementById("email").textContent = resumeData.email;
  document.getElementById("phone").textContent = resumeData.phone;
  document.getElementById("website").textContent = resumeData.website;
  document.getElementById("summary").textContent = resumeData.summary;

  // Handle Core Skills
  let coreSkillsContainer = document.getElementById("coreSkills");
  let coreSkillsSampleNode = coreSkillsContainer.querySelector("li");
  coreSkillsContainer.innerHTML = ""; // Clear the container
  resumeData.coreSkills.forEach((skill) => {
    let newNode = coreSkillsSampleNode.cloneNode();
    newNode.textContent = skill;
    coreSkillsContainer.appendChild(newNode);
  });

  // Handle Languages
  let languagesContainer = document.getElementById("languages");
  let languagesSampleNode = languagesContainer.querySelector("li");
  languagesContainer.innerHTML = ""; // Clear the container
  resumeData.languages.forEach((language) => {
    let newNode = languagesSampleNode.cloneNode();
    newNode.textContent = language;
    languagesContainer.appendChild(newNode);
  });

  // Handle Experience
  let experienceContainer = document.getElementById("experience");
  let experienceSampleNode = experienceContainer.querySelector("div");
  experienceContainer.innerHTML = ""; // Clear the container
  resumeData.experience.forEach((job) => {
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
          techStackNode.querySelector("img").src = "./assets/" + stackItem.replace(" ", "_") + ".svg";

          let imgEl = new Image();

          imgEl.onload = function () {
            let colors = getAverageColor(imgEl);
            techStackNode.style.backgroundColor = colors.backgroundColor;
            techStackNode.style.color = colors.textColor;

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
          imgEl.src = "./assets/" + stackItem.replace(/ /g, "_") + ".svg";
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