const SPREADSHEET_ID = '1T1KjYEGFndHQR1Od8lu6gNsU1su_vUruuhR09x2R2uw';

function doPost(e) {
  // Open your sheet
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];  // or getSheetByName('Sheet1')

  // Parent/guardian info
  const parentFirst   = e.parameter.parentFirstName;
  const parentLast    = e.parameter.parentLastName;
  const parentStreet  = e.parameter.parentStreet;
  const parentCity    = e.parameter.parentCity;
  const parentState   = e.parameter.parentState;
  const parentZip     = e.parameter.parentZip;
  const email         = e.parameter.email;
  const phone         = e.parameter.phone;

  // Payment method
  const paymentMethod = e.parameter.paymentMethod;

  // Number of children
  const count = parseInt(e.parameter.numChildren, 10) || 0;

  // For each child, append one row
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const childFirst = e.parameter[`childFirstName_${i}`];
    const childLast  = e.parameter[`childLastName_${i}`];
    const dob        = e.parameter[`dob_${i}`];
    const age        = e.parameter[`age_${i}`];

    sheet.appendRow([
      now,
      parentFirst, parentLast,
      parentStreet, parentCity, parentState, parentZip,
      email, phone,
      childFirst, childLast,
      dob, age,
      paymentMethod
    ]);
  }

  // Return a simple success text
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
