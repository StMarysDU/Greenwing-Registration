// Replace with your real Sheet ID
const SPREADSHEET_ID = '1T1KjYEGFndHQR1Od8lu6gNsU1su_vUruuhR09x2R2uw';

/**
 * Handles POST requests from your GitHub‐hosted form.
 * For each child entry it appends one row, repeating the parent info.
 */
function doPost(e) {
  // Open the spreadsheet
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];  // or ss.getSheetByName('Sheet1')

  // Parent/Guardian fields
  const parentFirst = e.parameter.parentFirstName;
  const parentLast  = e.parameter.parentLastName;
  const street      = e.parameter.parentStreet;
  const city        = e.parameter.parentCity;
  const state       = e.parameter.parentState;
  const zip         = e.parameter.parentZip;
  const email       = e.parameter.email;
  const phone       = e.parameter.phone;

  // Payment method
  const payment     = e.parameter.paymentMethod;

  // How many children
  const count       = parseInt(e.parameter.numChildren, 10) || 0;
  const now         = new Date();

  // Loop per child and append a row
  for (let i = 1; i <= count; i++) {
    const childFirst = e.parameter[`childFirstName_${i}`] || '';
    const childLast  = e.parameter[`childLastName_${i}`]  || '';
    const dob        = e.parameter[`dob_${i}`]            || '';
    const age        = e.parameter[`age_${i}`]            || '';

    sheet.appendRow([
      now,
      parentFirst,
      parentLast,
      street,
      city,
      state,
      zip,
      email,
      phone,
      childFirst,
      childLast,
      dob,
      age,
      payment
    ]);
  }

  // Return JSON to the hidden iframe so the form thinks it succeeded
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
