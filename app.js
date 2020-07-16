const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "team.html");

const validateEmail = (value) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
    return true;
  }
  return "invalid email address!";
};

const required = (value) => {
  if (value !== "") return true;

  return "value is required";
};

const phonenumber = (value) => {
  var phoneno = /^\d{10}$/;
  if (value.match(phoneno)) {
    return true;
  }
  return "invalid phone number!";
};

const managerQuestion = [
  {
    type: "input",
    name: "name",
    message: "What is the name of the manager ",
    validate: required,
  },
  {
    type: "input",
    name: "id",
    message: "What is the id of the manager ",
    validate: required,
  },
  {
    type: "input",
    name: "email",
    message: "What is the email of the manager ",
    validate: validateEmail,
  },
  {
    type: "input",
    name: "officeNumber",
    message: "What is the office number of manager ",
  },
];

const internQuestion = [
  {
    type: "input",
    name: "name",
    message: "What is the name of the intern ",
    validate: required,
  },
  {
    type: "input",
    name: "id",
    message: "What is the id of the intern ",
    validate: required,
  },
  {
    type: "input",
    name: "email",
    message: "What is the email of the intern ",
    validate: validateEmail,
  },
  {
    type: "input",
    name: "school",
    message: "What school did he attend ",
    validate: required,
  },
  {
    type: "confirm",
    message: "Do you want to add more intern?(yes/no) ",
    name: "moreAddIntern",
    default: false,
  },
];

const engineerQuestion = [
  {
    type: "input",
    name: "name",
    message: "What is the name of the engineer ",
    validate: required,
  },
  {
    type: "input",
    name: "id",
    message: "What is the id of the engineer ",
    validate: required,
  },
  {
    type: "input",
    name: "email",
    message: "What is the email of the engineer ",
    validate: validateEmail,
  },
  {
    type: "input",
    name: "github",
    message: "What is the github account of the engineer ",
    validate: required,
  },

  {
    type: "confirm",
    message: "Do you want add more engineer ",
    name: "addMoreEngineer",
    default: false,
  },
];

const employees = [];

// code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
async function init() {
  const answers = await inquirer.prompt([
    {
      type: "confirm",
      message: "Do you want to built your team profile ",
      name: "wantToBuildTeamProfile",
      default: true,
    },
  ]);
  if (answers.wantToBuildTeamProfile) {
    await askQuestion(managerQuestion, "manager");
  }

  const renderHtml = render(employees);
  await writeToFile(renderHtml);
}

async function addEmpoyees(answers, type) {
  if (type === "manager") {
    employees.push(
      new Manager(answers.name, answers.id, answers.email, answers.officeNumber)
    );
    await askQuestion(engineerQuestion, "engineer");
  } else if (type === "engineer") {
    employees.push(
      new Engineer(answers.name, answers.id, answers.email, answers.github)
    );
    if (answers.addMoreEngineer) {
      await askQuestion(engineerQuestion, "engineer");
    } else {
      await askQuestion(internQuestion, "intern");
    }
  } else if (type === "intern") {
    employees.push(
      new Intern(answers.name, answers.id, answers.email, answers.school)
    );
    if (answers.moreAddIntern) {
      await askQuestion(internQuestion, "intern");
    }
  }
}

async function askQuestion(questionType, type) {
  const answers = await inquirer.prompt(questionType);
  await addEmpoyees(answers, type);
}

async function writeToFile(renderedData) {
  fs.writeFile(OUTPUT_PATH, renderedData, function (err) {
    if (err) throw err;
  });
  console.log("Successfully generated Html file.");
}

init();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
