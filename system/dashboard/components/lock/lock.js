alert('movile detected');

const MOBILE_DETECTED = document.createElement('div');
MOBILE_DETECTED.id = 'MOBILE_DETECTED';

MOBILE_DETECTED.innerHTML = `
 
  <img src="..../../assets/lock.svg" />  

  <h2>No soportado</h2>

`;
document.body.appendChild(MOBILE_DETECTED);
