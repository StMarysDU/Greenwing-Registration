// Code.gs

// Your spreadsheet ID
const SHEET_ID = '1T1KjYEGFndHQR1Od8lu6gNsU1su_vUruuhR09x2R2uw';
// Tab name for responses
const TAB_NAME = 'Form Responses';

/**
 * Receives form POSTs from GitHub Pages.
 */
function doPost(e) {
  submitRegistration(e.parameter);
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Appends a row to the sheet based on the flat formData map.
 */
function submitRegistration(formData) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(TAB_NAME);
  if (!sheet) sheet = ss.insertSheet(TAB_NAME);

  const numChildren = parseInt(formData.numChildren, 10) || 0;

  // Write headers if this is the first row
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Timestamp',
      'parentFirstName','parentLastName',
      'parentStreet','parentCity','parentState','parentZip',
      'email','phone','numChildren'
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

  // Build the row data
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
