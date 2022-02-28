/*
  [1] display all blogs form json file
  [2] once the user clicks on one of the keywords
  [3] we are going to filter these jobs according to the classes/dataset

*/
let jobsHolder = document.querySelector("[data-jobs-holder]");

let FILTER_LIST = [];

async function getJobs() {
  let response = await fetch("data.json");
  let data = await response.json();

  data.forEach((job) => {
    createJob(job);
  });
}
getJobs();

function createJob(job) {
  // extracting the data into vars
  let {
    company,
    contract,
    featured,
    id,
    languages,
    level,
    location,
    new: isNew,
    logo,
    position: jobTitle,
    postedAt,
    role,
    tools,
  } = job;

  // cloning the template
  let jobTemp = document.querySelector("[data-template]").cloneNode(true);

  delete jobTemp.dataset.template;
  jobTemp.dataset["showJob"] = "true";
  jobTemp.dataset.job = "";
  jobTemp.classList.add(`job-number${id}`);

  jobTemp.querySelector("[data-logo]").src = logo;

  jobTemp.querySelector("[data-company]").innerHTML = company;

  jobTemp.querySelector("[data-contract]").innerHTML = contract;

  jobTemp.querySelector("[data-location]").innerHTML = location;

  jobTemp.querySelector("[data-title]").innerHTML = jobTitle;

  jobTemp.querySelector("[data-time-posted]").innerHTML = postedAt;

  let statusSection = jobTemp.querySelector("[data-status]");

  if (isNew) newJob(statusSection);

  if (featured) featuredJob(statusSection);

  function newJob(appender) {
    let newSpan = document.createElement("span");
    newSpan.className = "new";
    newSpan.innerHTML = "New";
    newSpan.dataset.featured = "true";

    appender.append(newSpan);
  }

  function featuredJob(appender) {
    // adding a dataset to specify that this job is featured;
    jobTemp.dataset.featured = "true";

    let newSpan = document.createElement("span");
    newSpan.className = "featured";
    newSpan.innerHTML = "Featured";
    newSpan.dataset.featured = "true";

    appender.append(newSpan);
  }

  // creating a function that gets all the keyword for the argumnets
  createKeywords(...languages, role, ...tools, level);

  function createKeywords(...keyWords) {
    let keyWordsHolder = jobTemp.querySelector("[data-keywords]");

    keyWords.forEach((keyword) => {
      let span = document.createElement("span");
      span.setAttribute("data-keyword", keyword);
      span.className = "keyword";
      span.innerHTML = keyword;

      keyWordsHolder.appendChild(span);
    });
  }

  jobsHolder.appendChild(jobTemp);
}

function filterJobs(e) {
  if (e.target.dataset.keyword == undefined) return;

  // showing the filter parent element

  let keyword = e.target.dataset.keyword;

  FILTER_LIST.push(keyword);
  FILTER_LIST = [...new Set(FILTER_LIST)];

  updateFilterBar(FILTER_LIST);

  let matchedJobs = getfilteredArr(FILTER_LIST);

  // jobsHolder.innerHTML = "";
  showJobs(matchedJobs);
}

function showJobs(matchedJobs) {
  Array.from(jobsHolder.children).forEach((job) => {
    job.dataset["showJob"] = "false";
  });

  matchedJobs.forEach((job) => {
    job.dataset["showJob"] = "true";
  });
}

// function that return array with selected keywords
function getfilteredArr(FILTER_LIST) {
  let displayedJobs = [...document.querySelectorAll("[data-job]")];

  let matchedJobs = displayedJobs.filter((job) => {
    let jobKeywords = [...job.querySelectorAll("[data-keyword]")].map(
      (span) => span.dataset.keyword
    );

    let filterationMatched = FILTER_LIST.every((filterKeyword) => {
      return jobKeywords.includes(filterKeyword);
    });

    if (filterationMatched) return job;
  });

  return matchedJobs;
}

function updateFilterBar(FILTER_LIST) {
  // getting the main holder
  let filterBar = document.querySelector("[data-keywords-holder]");
  filterBar.parentElement.parentElement.dataset.show = "true";
  filterBar.innerHTML = "";

  FILTER_LIST.forEach((keyword) => {
    let keywordDiv = document.createElement("div");
    keywordDiv.innerHTML = keyword;
    keywordDiv.dataset.keyword = keyword;
    keywordDiv.classList.add("item");

    let deleteSpan = document.createElement("span");
    deleteSpan.dataset.delete = "";
    deleteSpan.className = "delete";
    deleteSpan.innerHTML =
      '<ion-icon name="close-outline" data-delete ></ion-icon>';

    keywordDiv.appendChild(deleteSpan);

    filterBar.appendChild(keywordDiv);
  });

  if (FILTER_LIST.length == 0) {
    filterBar.parentElement.parentElement.dataset.show = "false";
  }
}

function deleteKeyword(e) {
  e.stopPropagation();
  if (e.target.dataset.delete == undefined) return;

  let keywordToDel = e.target.parentElement.parentElement.dataset.keyword;
  let indexToDel = FILTER_LIST.indexOf(keywordToDel);

  FILTER_LIST.splice(indexToDel, 1);
  updateFilterBar(FILTER_LIST);

  let matchedJobs = getfilteredArr(FILTER_LIST);
  showJobs(matchedJobs);

  // filterJobs;
}

function clearKeywords(e) {
  if (e.target.dataset.clear == undefined) return;

  FILTER_LIST = [];

  updateFilterBar(FILTER_LIST);

  document
    .querySelectorAll("[data-job]")
    .forEach((job) => (job.dataset["showJob"] = "true"));
}

// EVENT LISTENERS
document.addEventListener("click", deleteKeyword);
document.addEventListener("click", filterJobs);
document.addEventListener("click", clearKeywords);
