/**
 * Google Apps Script - Form Handler
 * Bu kod Google Sheets ga form ma'lumotlarini yozish uchun ishlatiladi
 *
 * O'rnatish:
 * 1. Google Sheets oching
 * 2. Extensions > Apps Script ga boring
 * 3. Bu kodni yozing yoki nusxalang
 * 4. SPREADSHEET_ID ni o'z Google Sheets ID sizga almashtiring
 * 5. Deploy > New deployment > Web app
 * 6. URL ni nusxalang va js/index.js da scriptURL ga qo'ying
 */

function doPost(e) {
  try {
    const SPREADSHEET_ID = "10zGsbDC9l4Y_9V83QpgCCApMU_fTxZ85B7LyOuq3l2o";

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getActiveSheet();

    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = {
          fullName: e.postData.contents.includes("fullName")
            ? e.postData.contents
                .split("fullName=")[1]
                ?.split("&")[0]
                ?.replace(/\+/g, " ") || ""
            : "",
          phone: e.postData.contents.includes("phone=")
            ? e.postData.contents
                .split("phone=")[1]
                ?.split("&")[0]
                ?.replace(/\+/g, " ") || ""
            : "",
          timestamp: new Date().toLocaleString("uz-UZ"),
        };
      }
    } else {
      data = {
        fullName: e.parameter.fullName || "",
        phone: e.parameter.phone || "",
        timestamp: e.parameter.timestamp || new Date().toLocaleString("uz-UZ"),
      };
    }

    const fullName = data.fullName || "";
    let phone = data.phone || "";

    phone = phone.replace(/[\s-]/g, "");

    if (!phone.startsWith("+")) {
      phone = "+" + phone;
    }

    const timestamp =
      data.timestamp ||
      new Date().toLocaleString("uz-UZ", {
        timeZone: "Asia/Tashkent",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    if (sheet.getLastRow() === 0) {
      const headerRange = sheet.getRange(1, 1, 1, 3);
      headerRange.setValues([["Ism va Familya", "Telefon raqam", "Vaqt"]]);
      headerRange.setFontWeight("bold");

      sheet.setColumnWidth(1, 200);
      sheet.setColumnWidth(2, 150);
      sheet.setColumnWidth(3, 180);
    }

    const lastRow = sheet.getLastRow() + 1;

    sheet.getRange(lastRow, 1).setValue(fullName);

    const phoneCell = sheet.getRange(lastRow, 2);
    phoneCell.setNumberFormat("@");
    phoneCell.setValue("'" + phone);

    sheet.getRange(lastRow, 3).setValue(timestamp);

    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Ma'lumotlar muvaffaqiyatli saqlandi",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
        message: "Xato yuz berdi: " + error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
