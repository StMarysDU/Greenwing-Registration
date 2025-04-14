function doPost(e) {
  try {
    // Use your provided Spreadsheet ID
    var ss = SpreadsheetApp.openById('1xSKngMq9i-XuVvFTkenMvY4O7aX545D3wIWX1--5868');
    var sheet = ss.getSheetByName('Sheet1');

    // Capture Parent/Guardian fields.
    var parentName = e.parameter.parentName;
    var parentAddress = e.parameter.parentAddress;
    var email = e.parameter.email;
    var phone = e.parameter.phone;
    var numChildren = e.parameter.numChildren;

    // Collect dynamic child information.
    var childData = "";
    for (var i = 1; i <= parseInt(numChildren); i++) {
      childData += "Child " + i + ": " +
                   (e.parameter["childFirstName_" + i] || "") + " " +
                   (e.parameter["childLastName_" + i] || "") +
                   ", DOB: " + (e.parameter["dob_" + i] || "") +
                   ", Age: " + (e.parameter["age_" + i] || "") +
                   ", Address: " + (e.parameter["childAddress_" + i] || "") + "\n";
    }

    // Append a row to the spreadsheet with a timestamp and the registration details.
    sheet.appendRow([new Date(), parentName, parentAddress, email, phone, numChildren, childData]);

    // Return a success response.
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                          .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
                          .setMimeType(ContentService.MimeType.JSON);
  }
}
