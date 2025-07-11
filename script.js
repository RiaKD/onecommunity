/* .js files add interaction to your website */
/*RANDON FACT GENERATOR*/
var factList =[
  "A striking 22% of the population lives in poverty, including 29% of children. The number of children experiencing destitution (lacking food, fuel, clothing and shelter) has almost tripled in the last five years.",
  "By 2028 child poverty is expected to rise to a record 4.4 million, this means the majority of children in larger families will be in poverty.",
  "Relative poverty is when a household earns less than 60% of the current average income. Absolute poverty is based on 2011 figures, it is outdated, misleading and inaccurate.",
  "Childhood poverty impacts all aspects of children's lives this results in children feeling stressed, excluded, embarrassed and concerned about their parents. Their reality suppresses their ability to dream big and have fun.",
  "Due to the lack of support, resources and basic necessities that their peers have access to these children's chances of academic success are reduced by 50%.",
  "These children often live in disadvantaged neighbourhoods and inadequate housing, increasing their risk of meningitis, respiratory problems and making them four times more likely to develop mental health issues by age 11, these children can experience 19-20 fewer years of good health.",
  "In 2023, child poverty cost the UK £39.5 billion. This cost is predicted to exceed £40 billion by 2027. Investing in reducing child poverty could provide significant economic benefits to the country and prevent the direct harm poverty causes to children.",
  ];

var fact = document.getElementById("fact");
var myButton = document.getElementById("myButton");
var count = 0;

if (myButton){
  myButton.addEventListener("click", displayFact);
}
function displayFact(){
  fact.innerHTML = factList[count];
  count++
  if (count == factList.length){
    count = 0
  }
}


/*letter script*/
document.addEventListener("DOMContentLoaded", function() {
    var displayScript = document.getElementById("example");
    var scriptBtn = document.getElementById("scriptBtn");

    if (scriptBtn) {
        scriptBtn.addEventListener("click", generateScript);
    }

    function generateScript() {
        var date = document.getElementById("date").value;
        var mp = document.getElementById("mp").value;
        var name = document.getElementById("name").value;
        var location = document.getElementById("location").value;
        var intro = document.getElementById("intro").value;
        var issue = document.getElementById("issue").value;
        var why = document.getElementById("why").value;
        var action1 = document.getElementById("action1").value;
        var action2 = document.getElementById("action2").value;
        var action3 = document.getElementById("action3").value;
        var taken = document.getElementById("taken").value;
        var subject = document.getElementById("subject").value;

        displayScript.innerHTML = `${date}<br><br>Dear ${mp},<br><br>I hope you are well.<br><br>
        My name is ${name}, and I am a resident of ${location}. ${intro}.
        I am writing to you as my representative in Parliament to express my deep concerns about the rising levels of child poverty in our community. ${issue}.<br><br>
        This is particularly important to me as ${why}.<br><br>
        I urge you to take immediate action on this critical issue. Specifically, I request that you:<br>
        • ${action1}<br>
        • ${action2}<br>
        • ${action3}<br><br>
        Please confirm the actions you have taken or plan to take in response to my letter. I would appreciate a response outlining how you intend to address this on my behalf. If you are unable to address this personally, I request that you escalate my letter to the relevant Minister or department.<br><br>
        Please do keep me informed of any progress made.<br><br>
        Thank you for your attention to this matter. I appreciate your efforts and commitment to representing our community and look forward to hearing from you.<br><br>
        Best wishes,<br>${name}<br><br>
        <strong><u>To thank them for taking positive action:</u></strong><br><br>
        Dear ${mp},<br><br>
        Thank you for ${taken} in response to my letter regarding ${subject}. Your support is greatly appreciated, and it makes a significant difference to the children and families in our community.<br><br>
        Yours sincerely,<br>
        ${name}`;
    }
});

// Google Apps Script URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz67diA9ZnP5FDIOU8FChqyzsJWi0yQJqbe4j4ofegmpWANJlRUZhZ-8yndbPaZrbIk/exec';

// Generate unique ID for requests/offers
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Submit donation request (for charities)
async function submitDonationRequest(requestData) {
  try {
    const formData = new URLSearchParams();
    formData.append('action', 'createRequest');
    formData.append('id', generateId());
    formData.append('charity-email', requestData.charityEmail);
    formData.append('charity-name', requestData.charityName);
    formData.append('item', requestData.item);
    formData.append('quantity', requestData.quantity);
    formData.append('details', requestData.details);
    formData.append('date', new Date().toISOString().split('T')[0]);
    formData.append('status', 'pending');

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting donation request:', error);
    return { success: false, error: 'Failed to submit request' };
  }
}

// Submit donation offer (for businesses)
async function submitDonationOffer(offerData) {
  try {
    const formData = new URLSearchParams();
    formData.append('action', 'createOffer');
    formData.append('id', generateId());
    formData.append('business-email', offerData.businessEmail);
    formData.append('business-name', offerData.businessName);
    formData.append('item', offerData.item);
    formData.append('quantity', offerData.quantity);
    formData.append('details', offerData.details);
    formData.append('date', new Date().toISOString().split('T')[0]);
    formData.append('status', 'pending');

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting donation offer:', error);
    return { success: false, error: 'Failed to submit offer' };
  }
}

// Get all donation requests (for businesses to view)
async function getDonationRequests() {
  try {
    const formData = new URLSearchParams();
    formData.append('action', 'getRequests');

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching donation requests:', error);
    return { success: false, error: 'Failed to fetch requests' };
  }
}

// Get all donation offers (for charities to view)
async function getDonationOffers() {
  try {
    const formData = new URLSearchParams();
    formData.append('action', 'getOffers');

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching donation offers:', error);
    return { success: false, error: 'Failed to fetch offers' };
  }
}

// Update request/offer status
async function updateStatus(type, id, newStatus) {
  try {
    const formData = new URLSearchParams();
    formData.append('action', 'updateStatus');
    formData.append('type', type); // 'request' or 'offer'
    formData.append('id', id);
    formData.append('status', newStatus);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

// Display donation requests in the business dashboard
function displayDonationRequests(requests) {
  const requestsList = document.getElementById('requests-list');
  if (!requestsList) return;

  requestsList.innerHTML = '';
  
  if (!requests || requests.length === 0) {
    requestsList.innerHTML = '<p>No donation requests available.</p>';
    return;
  }

  requests.forEach(request => {
    const requestDiv = document.createElement('div');
    requestDiv.className = 'request-item';
    requestDiv.innerHTML = `
      <h3>${request.item}</h3>
      <p><strong>Charity:</strong> ${request['charity-name']}</p>
      <p><strong>Quantity:</strong> ${request.quantity}</p>
      <p><strong>Details:</strong> ${request.details}</p>
      <p><strong>Date:</strong> ${request.date}</p>
      <p><strong>Status:</strong> ${request.status}</p>
      <button onclick="applyForRequest('${request.id}')" class="apply-btn">Apply to Help</button>
    `;
    requestsList.appendChild(requestDiv);
  });
}

// Display donation offers in the charity dashboard
function displayDonationOffers(offers) {
  const offersList = document.getElementById('offers-list');
  if (!offersList) return;

  offersList.innerHTML = '';
  
  if (!offers || offers.length === 0) {
    offersList.innerHTML = '<p>No donation offers available.</p>';
    return;
  }

  offers.forEach(offer => {
    const offerDiv = document.createElement('div');
    offerDiv.className = 'offer-item';
    offerDiv.innerHTML = `
      <h3>${offer.item}</h3>
      <p><strong>Business:</strong> ${offer['business-name']}</p>
      <p><strong>Quantity:</strong> ${offer.quantity}</p>
      <p><strong>Details:</strong> ${offer.details}</p>
      <p><strong>Date:</strong> ${offer.date}</p>
      <p><strong>Status:</strong> ${offer.status}</p>
      <button onclick="acceptOffer('${offer.id}')" class="accept-btn">Accept Offer</button>
    `;
    offersList.appendChild(offerDiv);
  });
}

// Apply for a donation request (for businesses)
async function applyForRequest(requestId) {
  const result = await updateStatus('request', requestId, 'matched');
  if (result.success) {
    alert('Successfully applied for this request!');
    // Refresh the requests list
    const requests = await getDonationRequests();
    if (requests.success) {
      displayDonationRequests(requests.data);
    }
  } else {
    alert('Failed to apply for request: ' + result.error);
  }
}

// Accept a donation offer (for charities)
async function acceptOffer(offerId) {
  const result = await updateStatus('offer', offerId, 'matched');
  if (result.success) {
    alert('Successfully accepted this offer!');
    // Refresh the offers list
    const offers = await getDonationOffers();
    if (offers.success) {
      displayDonationOffers(offers.data);
    }
  } else {
    alert('Failed to accept offer: ' + result.error);
  }
}

// Handle business donation offer form submission
async function submitBusinessOffer(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  const offerData = {
    item: formData.get('item'),
    quantity: formData.get('quantity'),
    details: formData.get('details'),
    'business-email': localStorage.getItem('userEmail'),
    'business-name': localStorage.getItem('userName')
  };
  
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: new URLSearchParams({
        action: 'createOffer',
        ...offerData
      })
    });
    
    const result = await response.json();
    
    const messageDiv = document.getElementById('offer-message');
    if (result.success) {
      messageDiv.innerHTML = '<p style="color: #4caf50; font-weight: bold;">Offer submitted successfully!</p>';
      form.reset();
    } else {
      messageDiv.innerHTML = '<p style="color: #f44336; font-weight: bold;">Error: ' + result.error + '</p>';
    }
  } catch (error) {
    console.error('Error submitting offer:', error);
    const messageDiv = document.getElementById('offer-message');
    messageDiv.innerHTML = '<p style="color: #f44336; font-weight: bold;">Error submitting offer. Please try again.</p>';
  }
}

// Initialize business dashboard functionality
function initializeBusinessDashboard() {
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  
  if (!userEmail) return;

  // Update user information in the dashboard
  const businessNameElement = document.getElementById('business-name');
  const dashboardBusinessName = document.getElementById('dashboard-business-name');
  const dashboardBusinessEmail = document.getElementById('dashboard-business-email');
  
  if (businessNameElement) businessNameElement.textContent = userName || 'Business';
  if (dashboardBusinessName) dashboardBusinessName.textContent = userName || '[Business Name]';
  if (dashboardBusinessEmail) dashboardBusinessEmail.textContent = userEmail || '[email@business.com]';

  // Set up form handler for business offers
  const offerForm = document.getElementById('donation-offer-form');
  if (offerForm) {
    offerForm.addEventListener('submit', submitBusinessOffer);
  }
}

// Initialize individual dashboard functionality
function initializeIndividualDashboard() {
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  
  if (!userEmail) return;

  // Update user information in the dashboard
  const individualNameElement = document.getElementById('individual-name');
  const dashboardIndividualName = document.getElementById('dashboard-individual-name');
  const dashboardIndividualEmail = document.getElementById('dashboard-individual-email');
  
  if (individualNameElement) individualNameElement.textContent = userName || 'Volunteer';
  if (dashboardIndividualName) dashboardIndividualName.textContent = userName || '[Volunteer Name]';
  if (dashboardIndividualEmail) dashboardIndividualEmail.textContent = userEmail || '[email@volunteer.com]';
}

// Initialize dashboard functionality
function initializeDashboard() {
  // Load requests/offers when dashboard loads
  const currentPage = window.location.pathname;
  
  if (currentPage.includes('dashboard-business')) {
    // Initialize business dashboard
    initializeBusinessDashboard();
    
    // Load donation requests for businesses
    getDonationRequests().then(result => {
      if (result.success) {
        displayDonationRequests(result.data);
      }
    });
  } else if (currentPage.includes('dashboard-charity')) {
    // Initialize charity-specific dashboard
    initializeCharityDashboard();
  } else if (currentPage.includes('dashboard-individual')) {
    // Initialize individual dashboard
    initializeIndividualDashboard();
    
    // Load donation requests for individuals
    getDonationRequests().then(result => {
      if (result.success) {
        displayDonationRequests(result.data);
      }
    });
  }
}

// Export functions for use in HTML
window.submitDonationRequest = submitDonationRequest;
window.submitDonationOffer = submitDonationOffer;
window.getDonationRequests = getDonationRequests;
window.getDonationOffers = getDonationOffers;
window.updateStatus = updateStatus;
window.applyForRequest = applyForRequest;
window.acceptOffer = acceptOffer;
window.initializeDashboard = initializeDashboard;
window.getCharityRequests = getCharityRequests;
window.getCharityOffers = getCharityOffers;
window.displayCharityRequests = displayCharityRequests;
window.displayCharityOffersReceived = displayCharityOffersReceived;
window.displayCharityOffersAccepted = displayCharityOffersAccepted;
window.acceptCharityOffer = acceptCharityOffer;
window.initializeCharityDashboard = initializeCharityDashboard;
window.submitCharityRequest = submitCharityRequest;
window.showSection = showSection;
window.initializeBusinessDashboard = initializeBusinessDashboard;
window.initializeIndividualDashboard = initializeIndividualDashboard;
window.submitBusinessOffer = submitBusinessOffer;

// Get requests posted by a specific charity
async function getCharityRequests(charityEmail) {
  try {
    const formData = new URLSearchParams();
    formData.append('action', 'getCharityRequests');
    formData.append('charity-email', charityEmail);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching charity requests:', error);
    return { success: false, error: 'Failed to fetch charity requests' };
  }
}

// Get offers received for a specific charity's requests
async function getCharityOffers(charityEmail) {
  try {
    const formData = new URLSearchParams();
    formData.append('action', 'getCharityOffers');
    formData.append('charity-email', charityEmail);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching charity offers:', error);
    return { success: false, error: 'Failed to fetch charity offers' };
  }
}

// Display charity's posted requests
function displayCharityRequests(requests) {
  const requestsContainer = document.getElementById('charity-requests-posted');
  if (!requestsContainer) return;

  requestsContainer.innerHTML = '';
  
  if (!requests || requests.length === 0) {
    requestsContainer.innerHTML = '<p>No requests posted yet.</p>';
    return;
  }

  requests.forEach(request => {
    const requestDiv = document.createElement('div');
    requestDiv.className = 'request-item';
    requestDiv.innerHTML = `
      <h3>${request.item}</h3>
      <p><strong>Quantity:</strong> ${request.quantity}</p>
      <p><strong>Details:</strong> ${request.details}</p>
      <p><strong>Date:</strong> ${request.date}</p>
      <p><strong>Status:</strong> ${request.status}</p>
    `;
    requestsContainer.appendChild(requestDiv);
  });
}

// Display offers received for charity's requests
function displayCharityOffersReceived(offers) {
  const offersContainer = document.getElementById('charity-offers-received');
  if (!offersContainer) return;

  offersContainer.innerHTML = '';
  
  if (!offers || offers.length === 0) {
    offersContainer.innerHTML = '<p>No offers received yet.</p>';
    return;
  }

  offers.forEach(offer => {
    const offerDiv = document.createElement('div');
    offerDiv.className = 'offer-item';
    offerDiv.innerHTML = `
      <h3>${offer.item}</h3>
      <p><strong>Business:</strong> ${offer['business-name']}</p>
      <p><strong>Quantity:</strong> ${offer.quantity}</p>
      <p><strong>Details:</strong> ${offer.details}</p>
      <p><strong>Date:</strong> ${offer.date}</p>
      <p><strong>Status:</strong> ${offer.status}</p>
      <button onclick="acceptCharityOffer('${offer.id}')" class="accept-btn">Accept Offer</button>
    `;
    offersContainer.appendChild(offerDiv);
  });
}

// Display offers accepted by charity
function displayCharityOffersAccepted(offers) {
  const offersContainer = document.getElementById('charity-offers-accepted');
  if (!offersContainer) return;

  offersContainer.innerHTML = '';
  
  if (!offers || offers.length === 0) {
    offersContainer.innerHTML = '<p>No offers accepted yet.</p>';
    return;
  }

  offers.forEach(offer => {
    const offerDiv = document.createElement('div');
    offerDiv.className = 'offer-item';
    offerDiv.innerHTML = `
      <h3>${offer.item}</h3>
      <p><strong>Business:</strong> ${offer['business-name']}</p>
      <p><strong>Quantity:</strong> ${offer.quantity}</p>
      <p><strong>Details:</strong> ${offer.details}</p>
      <p><strong>Date:</strong> ${offer.date}</p>
      <p><strong>Status:</strong> <span style="color: #4caf50; font-weight: bold;">${offer.status}</span></p>
    `;
    offersContainer.appendChild(offerDiv);
  });
}

// Accept an offer for a charity
async function acceptCharityOffer(offerId) {
  const result = await updateStatus('offer', offerId, 'accepted');
  if (result.success) {
    alert('Successfully accepted this offer!');
    // Refresh the charity's offers
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const offersReceived = await getCharityOffers(userEmail);
      if (offersReceived.success) {
        displayCharityOffersReceived(offersReceived.data.filter(o => o.status === 'pending'));
      }
      
      const offersAccepted = await getCharityOffers(userEmail);
      if (offersAccepted.success) {
        displayCharityOffersAccepted(offersAccepted.data.filter(o => o.status === 'accepted'));
      }
    }
  } else {
    alert('Failed to accept offer: ' + result.error);
  }
}

// Handle charity donation request form submission
async function submitCharityRequest(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  const requestData = {
    item: formData.get('item'),
    quantity: formData.get('quantity'),
    details: formData.get('details'),
    'requester-email': localStorage.getItem('userEmail'),
    'requester-name': localStorage.getItem('userName')
  };
  
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: new URLSearchParams({
        action: 'createRequest',
        ...requestData
      })
    });
    
    const result = await response.json();
    
    const messageDiv = document.getElementById('charity-request-message');
    if (result.success) {
      messageDiv.innerHTML = '<p style="color: #4caf50; font-weight: bold;">Request submitted successfully!</p>';
      form.reset();
      
      // Refresh the charity's requests
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const requestsResult = await getCharityRequests(userEmail);
        if (requestsResult.success) {
          displayCharityRequests(requestsResult.data);
        }
      }
    } else {
      messageDiv.innerHTML = '<p style="color: #f44336; font-weight: bold;">Error: ' + result.error + '</p>';
    }
  } catch (error) {
    console.error('Error submitting request:', error);
    const messageDiv = document.getElementById('charity-request-message');
    messageDiv.innerHTML = '<p style="color: #f44336; font-weight: bold;">Error submitting request. Please try again.</p>';
  }
}

// Show/hide dashboard sections
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.dashboard-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  // Show the selected section
  const selectedSection = document.getElementById(sectionId);
  if (selectedSection) {
    selectedSection.classList.add('active');
  }
  
  // Update sidebar active state
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Find and activate the clicked sidebar item
  const clickedItem = event.target;
  if (clickedItem.classList.contains('sidebar-item')) {
    clickedItem.classList.add('active');
  }
}

// Initialize charity dashboard functionality
function initializeCharityDashboard() {
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  
  if (!userEmail) return;

  // Update user information in the dashboard
  const charityNameElement = document.getElementById('charity-name');
  const dashboardCharityName = document.getElementById('dashboard-charity-name');
  const dashboardCharityEmail = document.getElementById('dashboard-charity-email');
  
  if (charityNameElement) charityNameElement.textContent = userName || 'Charity';
  if (dashboardCharityName) dashboardCharityName.textContent = userName || '[Charity Name]';
  if (dashboardCharityEmail) dashboardCharityEmail.textContent = userEmail || '[email@charity.org]';

  // Set up form handler for charity requests
  const requestForm = document.getElementById('charity-request-form');
  if (requestForm) {
    requestForm.addEventListener('submit', submitCharityRequest);
  }

  // Load charity's posted requests
  getCharityRequests(userEmail).then(result => {
    if (result.success) {
      displayCharityRequests(result.data);
      
      // Update overview stats
      const activeRequestsCount = document.getElementById('active-requests-count');
      if (activeRequestsCount) {
        activeRequestsCount.textContent = result.data.length;
      }
    }
  });

  // Load offers received for charity's requests
  getCharityOffers(userEmail).then(result => {
    if (result.success) {
      const pendingOffers = result.data.filter(o => o.status === 'pending');
      const acceptedOffers = result.data.filter(o => o.status === 'accepted');
      displayCharityOffersReceived(pendingOffers);
      displayCharityOffersAccepted(acceptedOffers);
      
      // Update overview stats
      const offersReceivedCount = document.getElementById('offers-received-count');
      const successfulMatchesCount = document.getElementById('successful-matches-count');
      if (offersReceivedCount) {
        offersReceivedCount.textContent = pendingOffers.length;
      }
      if (successfulMatchesCount) {
        successfulMatchesCount.textContent = acceptedOffers.length;
      }
    }
  });
}
