/**
 * Golden AK69 Prompt — lead capture into this spreadsheet.
 *
 * Paste this into Extensions > Apps Script on the Google Sheet that should
 * hold the leads, then deploy it as a Web App (see SETUP.md).
 *
 * The sheet is created and headed automatically on the first submission, so
 * there is nothing to set up by hand.
 */

var SHEET_NAME = 'Leads';
var HEADERS = ['Timestamp', 'Name', 'Email', 'Source', 'User Agent', 'Referrer'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 165);
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(3, 240);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  // One writer at a time, or two people submitting together can land on the
  // same row.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json_({ ok: false, error: 'busy' });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: 'no body' });
    }

    var data = JSON.parse(e.postData.contents);
    var email = String(data.email || '').trim().toLowerCase();
    var name = String(data.name || '').trim();

    if (!email || email.indexOf('@') === -1) {
      return json_({ ok: false, error: 'bad email' });
    }

    var sheet = getSheet_();
    var now = new Date();
    var last = sheet.getLastRow();

    // Same person coming back should refresh their row, not add another one.
    if (last > 1) {
      var emails = sheet.getRange(2, 3, last - 1, 1).getValues();
      for (var i = 0; i < emails.length; i++) {
        if (String(emails[i][0]).trim().toLowerCase() === email) {
          var row = i + 2;
          sheet.getRange(row, 1).setValue(now);
          if (name) sheet.getRange(row, 2).setValue(name);
          return json_({ ok: true, duplicate: true, row: row });
        }
      }
    }

    sheet.appendRow([
      now,
      name,
      email,
      String(data.source || ''),
      String(data.userAgent || ''),
      String(data.referrer || ''),
    ]);

    return json_({ ok: true, duplicate: false, row: sheet.getLastRow() });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Visiting the /exec URL in a browser should say something useful. */
function doGet() {
  return json_({ ok: true, service: 'golden-ak69-lead-capture' });
}
