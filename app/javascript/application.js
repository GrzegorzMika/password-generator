// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('DOMContentLoaded', () => {
  // Get references to the HTML elements we'll interact with
  const generateButton = document.getElementById('generateButton');
  const copyButton = document.getElementById('copyButton');
  const copyBase64Button = document.getElementById('copyBase64Button');
  const passwordLengthInput = document.getElementById('passwordLength');
  const generatedPasswordDisplay = document.getElementById('generatedPassword');
  const generatedPasswordBase64Display = document.getElementById('generatedPasswordBase64');
  const messageBox = document.getElementById('messageBox');

    let messageTimeoutId;
    
  // Function to show a temporary message
    function showMessage(message, type = 'success') {
    if (messageTimeoutId) {
      clearTimeout(messageTimeoutId);
    }

    messageBox.textContent = message;
    if (type === 'success') {
      messageBox.style.backgroundColor = '#d4edda';
      messageBox.style.color = '#155724';
      messageBox.style.borderColor = '#c3e6cb';
    } else if (type === 'error') {
      messageBox.style.backgroundColor = '#f8d7da';
      messageBox.style.color = '#721c24';
      messageBox.style.borderColor = '#f5c6cb';
    } 
    // Hide the message after 3 seconds
    messageTimeoutId = setTimeout(() => {
        messageBox.textContent = ''; // Clear the message text
        messageBox.style.backgroundColor = '#2c2c2c'; // Reset background color
    }, 3000);
  }

    
  // Add an event listener to the "Generate Password" button
  generateButton.addEventListener('click', async () => {
    // Get the desired password length from the input field
    const length = parseInt(passwordLengthInput.value, 10); // Use parseInt for explicit integer conversion

    // Define min and max allowed lengths
    const minLength = 1;
    const maxLength = 200;

    // Robust client-side validation for length
    if (isNaN(length)) {
      generatedPasswordDisplay.textContent = 'Please enter a number for the password length.';
      showMessage('Please enter a valid number for the password length.', 'error');
      return;
    }

    if (length < minLength) {
      generatedPasswordDisplay.textContent = `Password length cannot be less than ${minLength}.`;
      showMessage(`Password length cannot be less than ${minLength}.`, 'error');
      return;
    }

    if (length > maxLength) {
      generatedPasswordDisplay.textContent = `Password length cannot exceed ${maxLength}.`;
      showMessage(`Password length cannot exceed ${maxLength}.`, 'error');
      return;
    }

    try {
      // Make a POST request to our Rails backend API endpoint
      const response = await fetch('/generate_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
          length: length,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
        generatedPasswordDisplay.textContent = data.password;
        generatedPasswordBase64Display.textContent = data.password_base64;
      showMessage('Password generated successfully!', 'success');

    } catch (error) {
      console.error('Error generating password:', error);
      generatedPasswordDisplay.textContent = 'Failed to generate password. Please try again.';
      showMessage('Failed to generate password. Please try again.', 'error');
    }
  });

  // Add event listener for the "Copy Password" button
  copyButton.addEventListener('click', () => {
    const passwordToCopy = generatedPasswordDisplay.textContent;

    // Check if there's a password to copy (not the initial placeholder text or an error message)
    const initialPlaceholder = 'Your generated password will appear here.';
    const errorMessages = [
      'Please enter a number for the password length.',
      'Password length cannot be less than 1.',
      'Password length cannot exceed 200.',
      'Failed to generate password. Please try again.'
    ];

    if (passwordToCopy === initialPlaceholder || passwordToCopy === '' || errorMessages.includes(passwordToCopy)) {
      showMessage('No valid password to copy yet. Generate one first!', 'error');
      return;
    }

    // Use document.execCommand('copy') for clipboard operations due to iFrame restrictions
    // Create a temporary textarea element to hold the text
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = passwordToCopy;
    document.body.appendChild(tempTextArea); // Append to the DOM
    tempTextArea.select(); // Select the text
    tempTextArea.setSelectionRange(0, 99999); // For mobile devices

    try {
      // Execute the copy command
      const successful = document.execCommand('copy');
      if (successful) {
        showMessage('Password copied to clipboard!', 'success');
      } else {
        showMessage('Failed to copy password. Please try manually.', 'error');
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
      showMessage('Failed to copy password. Please try manually.', 'error');
    } finally {
      // Remove the temporary textarea
      document.body.removeChild(tempTextArea);
    }
  });
    
copyBase64Button    .addEventListener('click', () => {
    const passwordToCopy = generatedPasswordBase64Display.textContent;

    // Check if there's a password to copy (not the initial placeholder text or an error message)
    const initialPlaceholder = 'Your generated password will appear here.';
    const errorMessages = [
      'Please enter a number for the password length.',
      'Password length cannot be less than 1.',
      'Password length cannot exceed 200.',
      'Failed to generate password. Please try again.'
    ];

    if (generatedPasswordDisplay.textContent === initialPlaceholder || passwordToCopy === '' || errorMessages.includes(generatedPasswordDisplay.textContent)) {
      showMessage('No valid password to copy yet. Generate one first!', 'error');
      return;
    }

    // Use document.execCommand('copy') for clipboard operations due to iFrame restrictions
    // Create a temporary textarea element to hold the text
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = passwordToCopy;
    document.body.appendChild(tempTextArea); // Append to the DOM
    tempTextArea.select(); // Select the text
    tempTextArea.setSelectionRange(0, 99999); // For mobile devices

    try {
      // Execute the copy command
      const successful = document.execCommand('copy');
      if (successful) {
        showMessage('Encoded password copied to clipboard!', 'success');
      } else {
        showMessage('Failed to copy password. Please try manually.', 'error');
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
      showMessage('Failed to copy password. Please try manually.', 'error');
    } finally {
      // Remove the temporary textarea
      document.body.removeChild(tempTextArea);
    }
  });
});
