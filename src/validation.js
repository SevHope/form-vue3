export function createValidation(formStore) {
    return {
        validateItem: (event) => {
            const field = formStore.formItems.find(item => item.id === event.target.id) || null;
  switch (event.target.id) {
  case 'initials':
    validateInitials(event.target.value, field)
    break;
  case 'email':
    validateEmail(event.target.value, field)
    break;
  case 'phone':
    validatePhone(event.target.value, field)
    break;
  case 'date':
    validateDate(event.target.value, field)
    break;
  case 'index':
    validateIndex(event.target.value, field)
    break;
  case 'message':
    validateMessage(event.target.value, field)
    break;
  default:
    console.log('нет такого id')
}
},
validateForm: () => {
  formStore.state.formStatus = 'isSubmitting';
  setTimeout(() => {
    checkFields(formStore);
  }, 2000);
}

        }
    }

const validateInitials = (initials, field) => {
  const isValidLength = initials.length >= field.minlength && initials.length <= field.maxlength;
  const isValidFormat = field.restrictions.test(initials);
  field.showError = !(isValidLength && isValidFormat);
}

const validateEmail = (email, field) => {
  const isValidEmail = field.restrictions.test(email);
  field.showError = !(isValidEmail);
}

const validatePhone = (phone, field) => {
  const phoneNumbers = phone.replace(field.restrictions, '');
  const isValid = phoneNumbers.length === field.correctLength;
  field.showError = !isValid;
};

const calculateAge = (date) => {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age-=1;
  }
  return age;
};

const validateDate = (date, field) => {
  const age = calculateAge(date);
  const isValid = age >= field.minAge;
  field.showError = !isValid;
};

const validateIndex = (index, field) => {
  const isValid = field.restrictions.test(index);
  field.showError = !isValid;
}

const validateMessage = (message, field) => {
  const isValid = message.length <= field.maxlength;
  field.showError = !isValid;
}

const checkFields = (formStore) => {
    formStore.state.formValid = formStore.formItems.every(field => {
      return !field.showError;
    })
    formStore.state.formStatus = 'submited';
}