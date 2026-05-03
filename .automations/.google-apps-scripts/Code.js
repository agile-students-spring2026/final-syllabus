function getConfig() {
  const config = {
  };
  return config;
}

function doGet(e) {
  const config = getConfig();
  if (e.parameter["email"]) {
    const email = decodeURIComponent(e.parameter["email"]);
    Logger.log(`GET request to send grades to email ${email}`);
    const rowNum = getRowNumByEmail(email);
    if (rowNum) SEND_ONE_ROW_NOW(config.debug_mode, rowNum);
  }
}

function getRowNumByEmail(email = promptUserForEmail()) {
  const config = getConfig();
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = sheet.getDataRange().getValues();
  const headings = values[config.headingRow - 1]; // extract the column headings
  const emailIndex = headings.indexOf("Email");
  for (let i = 0; i < values.length; i++) {
    const row = values[i]; // array indices start from 0, while sheet rows start from 1
    if (row[emailIndex] == email) {
      const rowNum = i + 1; // increment by 1 since spreadsheet row numbers are one more than array indices.
      Logger.log(`Found email ${email} at row ${rowNum}!`);
      return rowNum; // found it!  exit.
    }
  }
  Logger.log(`Could not find email ${email}`);
  return false; // failed to find email
}

function promptUserForRowNum() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    "Row to send",
    "Please enter the row number of the grades to send",
    ui.ButtonSet.OK_CANCEL,
  );
  const rowNum = response.getResponseText();
  return rowNum;
}

function promptUserForEmail() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    "Email address",
    "Please enter the email address for the user whose grades to send",
    ui.ButtonSet.OK_CANCEL,
  );
  const email = response.getResponseText();
  return email;
}

function DEBUG_SEND_ONE_ROW_NOW() {
  SEND_ONE_ROW_NOW(true); // debug mode
}

function DEBUG_SEND_ONE_ROW_NOW_BY_EMAIL() {
  SEND_ONE_ROW_NOW_BY_EMAIL((debug_mode = true), (rowNum = getRowNumByEmail()));
}

function SEND_ONE_ROW_NOW_BY_EMAIL(
  debug_mode = getConfig().debug_mode,
  rowNum = getRowNumByEmail(),
) {
  if (rowNum) {
    SEND_ONE_ROW_NOW(debug_mode, rowNum);
  } else {
    Logger.log(`No row number specified... aborting.`);
  }
}

function SEND_ONE_ROW_NOW(
  debug_mode = getConfig().debug_mode,
  rowNum = promptUserForRowNum(),
) {
  const config = getConfig();

  if (rowNum) {
    Logger.log("got a response");
    const sheet = SpreadsheetApp.getActiveSheet();
    const values = sheet.getDataRange().getValues();
    const headings = values[config.headingRow - 1];

    for (let i = 1; i < values.length; i++) {
      if (i == parseInt(rowNum)) {
        Logger.log("sending row " + (i - 1));
        const row = values[i - 1];
        const rows = [headings, row];
        sendGrades(rows, debug_mode);
        break;
      }
    }
  }
}

function SEND_ALL_GRADES_NOW(e = null, debug_mode = getConfig().debug_mode) {
  const config = getConfig();
  Logger.log("Sending all grades...");

  const sheet = SpreadsheetApp.getActiveSheet();
  let rows = sheet.getDataRange().getValues();
  rows = rows.slice(config.headingRow - 1);
  sendGrades(rows, debug_mode);
}

function sendGrades(rows, debug_mode = getConfig().debug_mode) {
  const config = getConfig();
  const template = getMessageTemplate(config.EMAIL_TEMPLATE_DOC_URL);

  Logger.log(`DEBUG MODE: ${JSON.stringify(debug_mode, null, 2)}`);

  const columnNames = rows[0];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var data = extractData(columnNames, row);

    if ("status" in data && data["status"] != "enrolled") {
      console.log(`Skipping ${data["email"]} due to status ${data["status"]}`);
      continue;
    }

    if (data["email"]) {
      let to = debug_mode ? config.debug_mode_recipient : data["email"];
      let subject = config.courseTitle + " :: Grades"; //prepend course name to subject


      try {
        let message = createMessageFromTemplate(data["email"], data, template);
        MailApp.sendEmail({
          to: to,
          replyTo: config.EMAIL_REPLY_TO,
          subject: subject,
          htmlBody: message,
        });
      } catch (err) {
        Logger.log(`Failed to send email to ${to}: ${err}`);
      }
    } //endif data
    else {
      // there was no email...
      Logger.log(`NO EMAIL: ${data}`);
    }

    // pause for a few seconds before moving on to next
    Utilities.sleep(config.PAUSE_BETWEEN_EMAILS); // pause in the loop to not anger the Google spamlords
  } //endfor
}

function extractData(columnNames, row) {
  let data = new Array();

  for (var i = 0; i < columnNames.length; i++) {
    let columnName = columnNames[i] + "";
    columnName = columnName.toLowerCase();
    try {
      data[columnName] = row[i];
    } catch (err) {}
  }

  return data;
}

function onOpen() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let entries = [
    {
      name: "Send all grades!!!",
      functionName: "SEND_ALL_GRADES_NOW",
    },
    {
      name: "Send one student their grades by row number",
      functionName: "SEND_ONE_ROW_NOW",
    },
    {
      name: "Send one student their grades by email address",
      functionName: "SEND_ONE_ROW_NOW_BY_EMAIL",
    },
    null,
    {
      name: "DEBUGGING: send sample email to myself",
      functionName: "DEBUG_SEND_ONE_ROW_NOW",
    },
    null,
    {
      name: "Set up weekly emails",
      functionName: "createWeeklyTrigger",
    },
    {
      name: "Cancel weekly emails",
      functionName: "cancelWeeklyTrigger",
    },
  ];

  spreadsheet.addMenu("Grading", entries);
}

function getTimeBasedTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  const timeBasedTriggers = [];
  for (var i = 0; i < triggers.length; i++) {
    const type = triggers[i].getEventType();
    if (type == ScriptApp.EventType.CLOCK) {
      timeBasedTriggers.push(triggers[i]);
    }
  }
  return timeBasedTriggers;
}

function createWeeklyTrigger() {
  const config = getConfig();

  cancelWeeklyTrigger();

  config.EMAIL_DAYS.forEach((day) => {
    ScriptApp.newTrigger("SEND_ALL_GRADES_NOW")
      .timeBased()
      .onWeekDay(day)
      .atHour(config.EMAIL_HOUR)
      .create();

    Logger.log(
      `Created time-based trigger for ${day} at ${config.EMAIL_HOUR}.`,
    );
  });
}

function cancelWeeklyTrigger() {
  var triggers = getTimeBasedTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == "SEND_ALL_GRADES_NOW") {
      Logger.log("Deleted time-based trigger.");
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function getMessageTemplate(templateUrl) {
  const docId = DocumentApp.openByUrl(templateUrl).getId();
  try {
    let template = docToHtml(docId);
    if (!template) {
      throw new Error("Message template is empty!", template);
    }
    return template;
  } catch (err) {
    throw err;
  }
}

function createMessageFromTemplate(email, data, template) {
  message = template;

  Logger.log(`Preparing email for ${email}.`);

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`\{\{${key}\}\}`, "gi");
    if (data[key] !== "" && data[key] !== undefined && data[key] !== null) {
      message = message.replace(regex, data[key]);
    } else {
      message = message.replace(regex, "");
    }
  });

  message = message.replace(/{{.*?}}/g, "N/A");

  return message;
}

function docToHtml(docId) {
  const url =
    "https://docs.google.com/feeds/download/documents/export/Export?id=" +
    docId +
    "&exportFormat=html";
  const param = {
    method: "get",
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    // muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}
