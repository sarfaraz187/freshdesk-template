async function connectFreshdesk() {
  console.log("triggered")
  setButton('fdConnect', 'Verifying...', true);
  let inputFieldsArr = [fd_domain_name.value, fd_api_key.value];
  let errorArray = ["Entered Freshdesk domain name is invalid", "Entered Freshdesk API key is invalid",];
  if (validateInputFields(inputFieldsArr, errorArray)) {
    let addHttps = fd_domain_name.value.includes("https://") ? fd_domain_name.value : `https://${fd_domain_name.value}`;
    let base_url = addHttps + "/api/v2/groups";
    var options = {
      url: base_url,
      apiKey: fd_api_key.value,
      iparams: storedSettings,
      method: "get",
    };
    let getFdGroups = await client.request.invoke("fetchApiResponse", options);
    if(getFdGroups.response) {
      let response = JSON.parse(getFdGroups.response);
      console.log("Response from Freshdesk : ", response);
      fdGroups = response;
      showNotification('success', 'Verified successfully');
      setButton('fdConnect', 'Verify', false);
      $("#current_tab").attr("active-tab-index", 1);
    } else {
      showNotification('error', 'Either Domain name or Api key is invalid.');
      setButton('fdConnect', 'Verify', false);
    }
  } else {
    setButton('fdConnect', 'Verify', false);
  }
}
  
function validateInputFields(inputFields, errorArry) {
  let areAllFieldsValidated = true;
  for(const [index, value] of inputFields.entries()) {
    if(!value) {
      areAllFieldsValidated = false;
      showNotification('error', errorArry[index]);
      break;
    }
  }
  return areAllFieldsValidated;
}