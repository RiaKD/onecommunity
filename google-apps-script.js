// =============================================================================
// OneCommunity Google Apps Script Backend
// =============================================================================
// This script handles all backend operations for the OneCommunity platform
// including user management, donation requests/offers, and volunteer requests
// =============================================================================

// =============================================================================
// MAIN ENTRY POINT
// =============================================================================

/**
 * Main POST handler for all API requests
 * @param {Object} e - The event object containing request parameters
 * @return {TextOutput} JSON response
 */
function doPost(e) {
  try {
    const action = e.parameter.action;
    
    switch(action) {
      // User Management
      case 'register':
        return registerUser(e);
      case 'login':
        return loginUser(e);
      
      // Donation Management
      case 'createRequest':
        return createDonationRequest(e);
      case 'createOffer':
        return createDonationOffer(e);
      case 'getRequests':
        return getDonationRequests(e);
      case 'getOffers':
        return getDonationOffers(e);
      case 'getBusinessOffers':
        return getBusinessOffers(e);
      case 'updateStatus':
        return updateRequestOfferStatus(e);
      
      // Charity Dashboard Functions
      case 'getCharityRequests':
        return getCharityRequests(e);
      case 'getCharityOffers':
        return getCharityOffers(e);
      case 'getAcceptedOffers':
        return getAcceptedOffers(e);
      case 'getRejectedOffers':
        return getRejectedOffers(e);
      
      // Volunteer Management
      case 'createVolunteerRequest':
        return createVolunteerRequest(e);
      case 'getVolunteerRequests':
        return getVolunteerRequests(e);
      
      // Volunteer Applications (Future Implementation)
      case 'createVolunteerApplication':
        return createVolunteerApplication(e);
      case 'getVolunteerApplications':
        return getVolunteerApplications(e);
      case 'updateVolunteerApplicationStatus':
        return updateVolunteerApplicationStatus(e);
      
      default:
        return createErrorResponse('Invalid action: ' + action);
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return createErrorResponse(error.toString());
  }
}

/**
 * GET handler for testing connectivity
 * @param {Object} e - The event object
 * @return {TextOutput} JSON response
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'OneCommunity API is running',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Creates a standardized error response
 * @param {string} error - Error message
 * @return {TextOutput} JSON error response
 */
function createErrorResponse(error) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: error
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Creates a standardized success response
 * @param {Object} data - Response data
 * @return {TextOutput} JSON success response
 */
function createSuccessResponse(data) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    ...data
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Gets sheet data with headers
 * @param {string} sheetName - Name of the sheet
 * @return {Object} Object containing headers and data
 */
function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(sheetName + ' sheet not found');
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  return { sheet, headers, rows };
}

// =============================================================================
// USER MANAGEMENT
// =============================================================================

/**
 * Registers a new user
 * @param {Object} e - Event object with user parameters
 * @return {TextOutput} JSON response
 */
function registerUser(e) {
  const userType = e.parameter['role'];
  const email = e.parameter.email;
  const password = e.parameter.password;
  const name = e.parameter.name;
  
  // Validate required fields
  if (!userType || !email || !password || !name) {
    return createErrorResponse('Missing required fields');
  }
  
  // Get the appropriate sheet based on user type
  let sheetName, nameHeader;
  switch(userType) {
    case 'business':
      sheetName = 'Businesses';
      nameHeader = 'contact-name';
      break;
    case 'charity':
      sheetName = 'Charities';
      nameHeader = 'contact-name';
      break;
    case 'individual':
      sheetName = 'Individuals';
      nameHeader = 'name';
      break;
    default:
      return createErrorResponse('Invalid role');
  }
  
  try {
    const { sheet, headers } = getSheetData(sheetName);
    
    // Check if user already exists
    const emailColumn = headers.indexOf('email');
    const existingUser = sheet.getDataRange().getValues().slice(1)
      .find(row => row[emailColumn] === email);
    
    if (existingUser) {
      return createErrorResponse('User already exists');
    }
    
    // Add new user
    const newRow = [];
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === 'email') {
        newRow[i] = email;
      } else if (headers[i] === 'password') {
        newRow[i] = password;
      } else if (headers[i] === nameHeader) {
        newRow[i] = name;
      } else {
        newRow[i] = '';
      }
    }
    
    sheet.appendRow(newRow);
    
    return createSuccessResponse({
      message: 'Registration successful'
    });
  } catch (error) {
    return createErrorResponse('Registration failed: ' + error.message);
  }
}

/**
 * Authenticates a user login
 * @param {Object} e - Event object with login parameters
 * @return {TextOutput} JSON response
 */
function loginUser(e) {
  const userType = e.parameter['role'];
  const email = e.parameter.email;
  const password = e.parameter.password;
  
  // Validate required fields
  if (!userType || !email || !password) {
    return createErrorResponse('Missing required fields');
  }
  
  // Get the appropriate sheet based on user type
  let sheetName, nameHeader;
  switch(userType) {
    case 'business':
      sheetName = 'Businesses';
      nameHeader = 'contact-name';
      break;
    case 'charity':
      sheetName = 'Charities';
      nameHeader = 'contact-name';
      break;
    case 'individual':
      sheetName = 'Individuals';
      nameHeader = 'name';
      break;
    default:
      return createErrorResponse('Invalid role');
  }
  
  try {
    const { headers, rows } = getSheetData(sheetName);
    
    const emailColumn = headers.indexOf('email');
    const passwordColumn = headers.indexOf('password');
    const nameColumn = headers.indexOf(nameHeader);
    
    const user = rows.find(row => 
      row[emailColumn] === email && row[passwordColumn] === password
    );
    
    if (user) {
      return createSuccessResponse({
        user: {
          name: user[nameColumn] || '',
          email: user[emailColumn] || ''
        }
      });
    } else {
      return createErrorResponse('Invalid credentials');
    }
  } catch (error) {
    return createErrorResponse('Login failed: ' + error.message);
  }
}

// =============================================================================
// DONATION REQUEST MANAGEMENT
// =============================================================================

/**
 * Creates a new donation request
 * @param {Object} e - Event object with request parameters
 * @return {TextOutput} JSON response
 */
function createDonationRequest(e) {
  try {
    const { sheet, headers } = getSheetData('DonationRequests');
    
    const newRow = [];
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      switch(header) {
        case 'id':
          newRow[i] = Utilities.getUuid();
          break;
        case 'charity-email':
          newRow[i] = e.parameter['charity-email'] || '';
          break;
        case 'charity-name':
          newRow[i] = e.parameter['charity-name'] || '';
          break;
        case 'item':
          newRow[i] = e.parameter['item'] || '';
          break;
        case 'category':
          newRow[i] = e.parameter['category'] || '';
          break;
        case 'quantity':
          newRow[i] = e.parameter['quantity'] || '';
          break;
        case 'details':
          newRow[i] = e.parameter['details'] || '';
          break;
        case 'date':
          newRow[i] = e.parameter['date'] || new Date().toISOString().split('T')[0];
          break;
        case 'status':
          newRow[i] = 'pending';
          break;
        default:
          newRow[i] = '';
      }
    }
    
    sheet.appendRow(newRow);
    
    return createSuccessResponse({
      message: 'Donation request created successfully'
    });
  } catch (error) {
    return createErrorResponse('Failed to create donation request: ' + error.message);
  }
}

/**
 * Retrieves all donation requests
 * @param {Object} e - Event object
 * @return {TextOutput} JSON response with requests data
 */
function getDonationRequests(e) {
  try {
    const { headers, rows } = getSheetData('DonationRequests');
    
    const requests = rows.map(row => {
      const request = {};
      headers.forEach((header, index) => {
        request[header] = row[index] || '';
      });
      return request;
    });
    
    return createSuccessResponse({
      data: requests
    });
  } catch (error) {
    return createErrorResponse('Failed to get donation requests: ' + error.message);
  }
}

/**
 * Gets donation requests for a specific charity
 * @param {Object} e - Event object with charity email
 * @return {TextOutput} JSON response
 */
function getCharityRequests(e) {
  try {
    const charityEmail = e.parameter['charity-email'];
    if (!charityEmail) {
      return createErrorResponse('Charity email is required');
    }
    
    const { headers, rows } = getSheetData('DonationRequests');
    const charityEmailIndex = headers.indexOf('charity-email');
    
    const charityRequests = rows
      .filter(row => row[charityEmailIndex] === charityEmail)
      .map(row => {
        const request = {};
        headers.forEach((header, index) => {
          request[header] = row[index] || '';
        });
        return request;
      });
    
    return createSuccessResponse({
      data: charityRequests
    });
  } catch (error) {
    return createErrorResponse('Failed to get charity requests: ' + error.message);
  }
}

// =============================================================================
// DONATION OFFER MANAGEMENT
// =============================================================================

/**
 * Creates a new donation offer
 * @param {Object} e - Event object with offer parameters
 * @return {TextOutput} JSON response
 */
function createDonationOffer(e) {
  try {
    const { sheet, headers } = getSheetData('DonationOffers');
    
    const newRow = [];
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      switch(header) {
        case 'id':
          newRow[i] = Utilities.getUuid();
          break;
        case 'business-email':
          newRow[i] = e.parameter['business-email'] || '';
          break;
        case 'business-name':
          newRow[i] = e.parameter['business-name'] || '';
          break;
        case 'item':
          newRow[i] = e.parameter['item'] || '';
          break;
        case 'category':
          newRow[i] = e.parameter['category'] || '';
          break;
        case 'quantity':
          newRow[i] = e.parameter['quantity'] || '';
          break;
        case 'details':
          newRow[i] = e.parameter['details'] || '';
          break;
        case 'date':
          newRow[i] = e.parameter['date'] || new Date().toISOString().split('T')[0];
          break;
        case 'status':
          newRow[i] = 'pending';
          break;
        default:
          newRow[i] = '';
      }
    }
    
    sheet.appendRow(newRow);
    
    return createSuccessResponse({
      message: 'Donation offer created successfully'
    });
  } catch (error) {
    return createErrorResponse('Failed to create donation offer: ' + error.message);
  }
}

/**
 * Retrieves all donation offers
 * @param {Object} e - Event object
 * @return {TextOutput} JSON response with offers data
 */
function getDonationOffers(e) {
  try {
    const { headers, rows } = getSheetData('DonationOffers');
    
    const offers = rows.map(row => {
      const offer = {};
      headers.forEach((header, index) => {
        offer[header] = row[index] || '';
      });
      return offer;
    });
    
    return createSuccessResponse({
      data: offers
    });
  } catch (error) {
    return createErrorResponse('Failed to get donation offers: ' + error.message);
  }
}

/**
 * Gets donation offers for a specific business
 * @param {Object} e - Event object with business email
 * @return {TextOutput} JSON response
 */
function getBusinessOffers(e) {
  try {
    const businessEmail = e.parameter['business-email'];
    if (!businessEmail) {
      return createErrorResponse('Business email is required');
    }
    
    const { headers, rows } = getSheetData('DonationOffers');
    const businessEmailIndex = headers.indexOf('business-email');
    
    const businessOffers = rows
      .filter(row => row[businessEmailIndex] === businessEmail)
      .map(row => {
        const offer = {};
        headers.forEach((header, index) => {
          offer[header] = row[index] || '';
        });
        return offer;
      });
    
    return createSuccessResponse({
      data: businessOffers
    });
  } catch (error) {
    return createErrorResponse('Failed to get business offers: ' + error.message);
  }
}

/**
 * Gets offers received by a charity
 * @param {Object} e - Event object
 * @return {TextOutput} JSON response
 */
function getCharityOffers(e) {
  try {
    const { headers, rows } = getSheetData('DonationOffers');
    
    const offers = rows.map(row => {
      const offer = {};
      headers.forEach((header, index) => {
        offer[header] = row[index] || '';
      });
      return offer;
    });
    
    return createSuccessResponse({
      data: offers
    });
  } catch (error) {
    return createErrorResponse('Failed to get charity offers: ' + error.message);
  }
}

/**
 * Gets accepted offers
 * @param {Object} e - Event object
 * @return {TextOutput} JSON response
 */
function getAcceptedOffers(e) {
  try {
    const { headers, rows } = getSheetData('DonationOffers');
    const statusIndex = headers.indexOf('status');
    
    const acceptedOffers = rows
      .filter(row => row[statusIndex] === 'accepted')
      .map(row => {
        const offer = {};
        headers.forEach((header, index) => {
          offer[header] = row[index] || '';
        });
        return offer;
      });
    
    return createSuccessResponse({
      data: acceptedOffers
    });
  } catch (error) {
    return createErrorResponse('Failed to get accepted offers: ' + error.message);
  }
}

/**
 * Gets rejected offers
 * @param {Object} e - Event object
 * @return {TextOutput} JSON response
 */
function getRejectedOffers(e) {
  try {
    const { headers, rows } = getSheetData('DonationOffers');
    const statusIndex = headers.indexOf('status');
    
    const rejectedOffers = rows
      .filter(row => row[statusIndex] === 'rejected')
      .map(row => {
        const offer = {};
        headers.forEach((header, index) => {
          offer[header] = row[index] || '';
        });
        return offer;
      });
    
    return createSuccessResponse({
      data: rejectedOffers
    });
  } catch (error) {
    return createErrorResponse('Failed to get rejected offers: ' + error.message);
  }
}

/**
 * Updates the status of a request or offer
 * @param {Object} e - Event object with status update parameters
 * @return {TextOutput} JSON response
 */
function updateRequestOfferStatus(e) {
  try {
    const type = e.parameter.type; // 'request' or 'offer'
    const id = e.parameter.id;
    const newStatus = e.parameter.status;
    
    if (!type || !id || !newStatus) {
      return createErrorResponse('Missing required parameters');
    }
    
    const sheetName = type === 'request' ? 'DonationRequests' : 'DonationOffers';
    const { sheet, headers } = getSheetData(sheetName);
    
    const idIndex = headers.indexOf('id');
    const statusIndex = headers.indexOf('status');
    
    const data = sheet.getDataRange().getValues();
    const rowIndex = data.findIndex(row => row[idIndex] === id);
    
    if (rowIndex === -1) {
      return createErrorResponse('Item not found');
    }
    
    // Update status (rowIndex + 1 because sheet rows are 1-indexed)
    sheet.getRange(rowIndex + 1, statusIndex + 1).setValue(newStatus);
    
    return createSuccessResponse({
      message: 'Status updated successfully'
    });
  } catch (error) {
    return createErrorResponse('Failed to update status: ' + error.message);
  }
}

// =============================================================================
// VOLUNTEER REQUEST MANAGEMENT
// =============================================================================

/**
 * Creates a new volunteer request
 * @param {Object} e - Event object with volunteer request parameters
 * @return {TextOutput} JSON response
 */
function createVolunteerRequest(e) {
  try {
    const { sheet, headers } = getSheetData('VolunteerRequests');
    
    const newRow = [];
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      switch(header) {
        case 'id':
          newRow[i] = Utilities.getUuid();
          break;
        case 'charity-email':
          newRow[i] = e.parameter['charity-email'] || '';
          break;
        case 'charity-name':
          newRow[i] = e.parameter['charity-name'] || '';
          break;
        case 'role':
          newRow[i] = e.parameter['role'] || '';
          break;
        case 'category':
          newRow[i] = e.parameter['category'] || '';
          break;
        case 'hours':
          newRow[i] = e.parameter['hours'] || '';
          break;
        case 'details':
          newRow[i] = e.parameter['details'] || '';
          break;
        case 'date':
          newRow[i] = e.parameter['date'] || new Date().toISOString().split('T')[0];
          break;
        case 'status':
          newRow[i] = 'pending';
          break;
        default:
          newRow[i] = '';
      }
    }
    
    sheet.appendRow(newRow);
    
    return createSuccessResponse({
      message: 'Volunteer request created successfully'
    });
  } catch (error) {
    return createErrorResponse('Failed to create volunteer request: ' + error.message);
  }
}

/**
 * Retrieves all volunteer requests
 * @param {Object} e - Event object
 * @return {TextOutput} JSON response with volunteer requests data
 */
function getVolunteerRequests(e) {
  try {
    const { headers, rows } = getSheetData('VolunteerRequests');
    
    const requests = rows.map(row => {
      const request = {};
      headers.forEach((header, index) => {
        request[header] = row[index] || '';
      });
      return request;
    });
    
    return createSuccessResponse({
      data: requests
    });
  } catch (error) {
    return createErrorResponse('Failed to get volunteer requests: ' + error.message);
  }
}

// =============================================================================
// VOLUNTEER APPLICATION MANAGEMENT (FUTURE IMPLEMENTATION)
// =============================================================================

/**
 * Creates a new volunteer application
 * @param {Object} e - Event object with application parameters
 * @return {TextOutput} JSON response
 */
function createVolunteerApplication(e) {
  try {
    const volunteerEmail = e.parameter['volunteer-email'];
    const requestId = e.parameter['request-id'];
    const role = e.parameter['role'];
    const charityName = e.parameter['charity-name'];
    
    if (!volunteerEmail || !requestId || !role || !charityName) {
      return createErrorResponse('Missing required application parameters');
    }
    
    // Check if volunteer exists in Individuals sheet
    const { headers, rows } = getSheetData('Individuals');
    const emailIndex = headers.indexOf('email');
    const nameIndex = headers.indexOf('name');
    
    const volunteer = rows.find(row => row[emailIndex] === volunteerEmail);
    
    if (!volunteer) {
      return createErrorResponse('Volunteer not found. Please register first.');
    }
    
    // Create application data using volunteer's profile
    const applicationData = {
      'application-id': e.parameter['id'] || Utilities.getUuid(),
      'volunteer-email': volunteerEmail,
      'volunteer-name': volunteer[nameIndex] || '',
      'request-id': requestId,
      'role': role,
      'charity-name': charityName,
      'application-date': e.parameter['date'] || new Date().toISOString().split('T')[0],
      'status': e.parameter['status'] || 'pending'
    };
    
    // Store application in a simple format that can be easily retrieved
    // We'll use the existing volunteer's row and add application info
    const applicationRow = [];
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === 'name') {
        applicationRow[i] = 'VOLUNTEER_APPLICATION_' + applicationData['application-id'];
      } else if (headers[i] === 'email') {
        applicationRow[i] = volunteerEmail;
      } else if (headers[i] === 'password') {
        applicationRow[i] = JSON.stringify(applicationData);
      } else {
        applicationRow[i] = '';
      }
    }
    
    // Add the application as a new row
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Individuals');
    sheet.appendRow(applicationRow);
    
    return createSuccessResponse({
      message: 'Volunteer application created successfully'
    });
  } catch (error) {
    return createErrorResponse('Failed to create volunteer application: ' + error.message);
  }
}

/**
 * Retrieves volunteer applications
 * @param {Object} e - Event object
 * @return {TextOutput} JSON response with applications data
 */
function getVolunteerApplications(e) {
  try {
    const { headers, rows } = getSheetData('Individuals');
    
    // Filter rows that contain volunteer applications (they start with VOLUNTEER_APPLICATION_)
    const applications = rows
      .filter(row => {
        const nameIndex = headers.indexOf('name');
        return nameIndex >= 0 && row[nameIndex] && row[nameIndex].toString().startsWith('VOLUNTEER_APPLICATION_');
      })
      .map(row => {
        const nameIndex = headers.indexOf('name');
        const emailIndex = headers.indexOf('email');
        const passwordIndex = headers.indexOf('password');
        
        // Extract application data from the password field
        let applicationData = {};
        if (passwordIndex >= 0 && row[passwordIndex]) {
          try {
            applicationData = JSON.parse(row[passwordIndex]);
          } catch (e) {
            // If parsing fails, create basic application data
            applicationData = {
              'application-id': row[nameIndex] ? row[nameIndex].replace('VOLUNTEER_APPLICATION_', '') : '',
              'volunteer-email': emailIndex >= 0 ? row[emailIndex] : '',
              'volunteer-name': '',
              'request-id': '',
              'role': '',
              'charity-name': '',
              'application-date': '',
              'status': 'pending'
            };
          }
        }
        
        return {
          id: applicationData['application-id'] || '',
          'volunteer-email': applicationData['volunteer-email'] || '',
          'volunteer-name': applicationData['volunteer-name'] || '',
          'request-id': applicationData['request-id'] || '',
          role: applicationData['role'] || '',
          'charity-name': applicationData['charity-name'] || '',
          date: applicationData['application-date'] || '',
          status: applicationData['status'] || 'pending'
        };
      });
    
    return createSuccessResponse({
      data: applications
    });
  } catch (error) {
    return createErrorResponse('Failed to get volunteer applications: ' + error.message);
  }
}

/**
 * Updates volunteer application status
 * @param {Object} e - Event object with status update parameters
 * @return {TextOutput} JSON response
 */
function updateVolunteerApplicationStatus(e) {
  try {
    const id = e.parameter.id;
    const newStatus = e.parameter.status;
    
    if (!id || !newStatus) {
      return createErrorResponse('Missing required parameters');
    }
    
    const { sheet, headers } = getSheetData('Individuals');
    
    const nameIndex = headers.indexOf('name');
    const passwordIndex = headers.indexOf('password');
    
    const data = sheet.getDataRange().getValues();
    const rowIndex = data.findIndex(row => 
      nameIndex >= 0 && row[nameIndex] && row[nameIndex].toString().startsWith('VOLUNTEER_APPLICATION_' + id)
    );
    
    if (rowIndex === -1) {
      return createErrorResponse('Application not found');
    }
    
    // Update the application data in the password field
    if (passwordIndex >= 0 && data[rowIndex][passwordIndex]) {
      try {
        const applicationData = JSON.parse(data[rowIndex][passwordIndex]);
        applicationData.status = newStatus;
        
        // Update the password field with the new status
        sheet.getRange(rowIndex + 1, passwordIndex + 1).setValue(JSON.stringify(applicationData));
        
        return createSuccessResponse({
          message: 'Application status updated successfully'
        });
      } catch (e) {
        return createErrorResponse('Failed to update application status: Invalid application data');
      }
    } else {
      return createErrorResponse('Application data not found');
    }
  } catch (error) {
    return createErrorResponse('Failed to update application status: ' + error.message);
  }
} 