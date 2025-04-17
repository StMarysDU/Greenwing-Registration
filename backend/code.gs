// Code.gs

// Your Google Sheet ID
const SHEET_ID = '1T1KjYEGFndHQR1Od8lu6gNsU1su_vUruuhR09x2R2uw';
// The name of the tab where responses will go
const TAB_NAME  = 'Form Responses';

/**
 * This runs whenever your GitHub form POSTS to the Web App URL.
 */
function doPost(e) {
  // e.parameter is a flat map of name→value from the form
  submitRegistration(e.parameter);
  // Return a simple text response so the hidden iframe doesn't error out
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Takes the flat formData map and appends a row in the sheet.
 */
function submitRegistration(formData) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(TAB_NAME);
  if (!sheet) sheet = ss.insertSheet(TAB_NAME);

  const numChildren = parseInt(formData.numChildren, 10) || 0;

  // Write headers if this is the first submission
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Timestamp',
      'parentFirstName','parentLastName',
      'parentStreet','parentCity','parentState','parentZip',
      'email','phone',
      'numChildren'
    ];
    for (let i = 1; i <= numChildren; i++) {
      headers.push(
        `childFirstName_${i}`,
        `childLastName_${i}`,
        `dob_${i}`,
        `age_${i}`,
        `childStreet_${i}`,
        `childCity_${i}`,
        `childState_${i}`,
        `childZip_${i}`
      );
    }
    headers.push('paymentMethod','paymentDetails');
    sheet.appendRow(headers);
  }

  // Build the row values
  const row = [
    new Date(),
    formData.parentFirstName, formData.parentLastName,
    formData.parentStreet,    formData.parentCity,
    formData.parentState,     formData.parentZip,
    formData.email,           formData.phone,
    formData.numChildren
  ];
  for (let i = 1; i <= numChildren; i++) {
    row.push(
      formData[`childFirstName_${i}`] || '',
      formData[`childLastName_${i}`]  || '',
      formData[`dob_${i}`]            || '',
      formData[`age_${i}`]            || '',
      formData[`childStreet_${i}`]    || '',
      formData[`childCity_${i}`]      || '',
      formData[`childState_${i}`]     || '',
      formData[`childZip_${i}`]       || ''
    );
  }
  row.push(
    formData.paymentMethod  || '',
    formData.paymentDetails || ''
  );

  sheet.appendRow(row);
}
