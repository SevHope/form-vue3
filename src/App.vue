<script setup>
// import { reactive } from 'vue';
import { useFormStore } from './stores/FormStore';
import { MaskInput } from 'vue-3-mask';

// const state = reactive({
//   formValid: true,
//   formStatus: 'active' //active-все доступно для редактирования, 'isSubmitting' - в процессе валидации, 'submited' - после валидации, форма заблокирована, на экране модалка
// })

// const personsData = reactive({
//   initials: '',
//   email: '',
//   phone: '',
//   date: '',
//   country: '',
//   index: '',
//   checked: false,
//   message: ''
// })

// const formItems = reactive([
//   {id: 'initials', tag: 'input', class: 'formInput', placeholder: 'Введите ФИО', type: 'text', label: 'ФИО', required: true, minLength: '2', maxLength: '200', restrictions: /^[A-Za-zА-Яа-яёЁ\s-]+$/, errorMessage: 'ФИО должно быть от 2 до 200 символов и содержать только буквы, пробелы и дефис', showError: false },
//   {id: 'email', tag: 'input', class: 'formInput', placeholder: 'Введите почту', type: 'email', label: 'Почта', required: true, restrictions: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/, errorMessage: 'Введен некорректный email', showError: false },
//   {id: 'phone', tag: 'input', class: 'formInput', placeholder: '+7 (xxx) xxx-xx-xx', type: 'tel', label: 'Телефон', required: true, correctLength: 11, restrictions: /\D/g, errorMessage: 'Укажите телефон в формате +7 xxx xxx-xx-xx', showError: false },
//   {id: 'date', tag: 'input', class: 'formInput', placeholder: 'Введите дату рождения', type: 'date', label: 'Дата рождения', minAge: 18, errorMessage: 'Возраст должен быть больше или равен 18', showError: false },
//   {id: 'country', tag: 'select', class: 'formSelect', placeholder: 'Укажите страну', label: 'Страна', showError: false},
//   {id: 'index', tag: 'input', class: 'formInput', placeholder: 'Введите почтовый индекс', type: 'number', label: 'Почтовый индекс', restrictions: /^\d{6}$/, errorMessage: 'Индекс должен содержать 6 цифр', showError: false },
//   {id: 'checked', tag: 'input', class: 'formCheckbox', type: 'checkbox', label: 'Согласен с условиями', required: true, showError: false},
//   {id: 'message', tag: 'textarea', class: 'formInput', placeholder: 'Введите текст', label: 'Комментарий', maxLength: '300', errorMessage: 'Комментарий может содержать максимум 300 символов', showError: false},
// ])

// const countries = ['Россия', 'Беларусь', 'Казахстан', 'Китай', 'Индия'];
// const phoneMask = '+7 (###) ###-##-##';

const formStore = useFormStore();

const findField = (id) => {
  const field = formStore.formItems.find(item => item.id === id) || null;
  return field;
}

const validateInitials = (initials, field) => {
  const isValidLength = initials.length >= field.minLength && initials.length <= field.maxLength;
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
  const isValid = message.length <= field.maxLength;
  field.showError = !isValid;
}

const validateItem = (event) => {
  const field = findField(event.target.id);
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
}

const clearForm = () => {
  formStore.personsData.initials = '';
  formStore.personsData.email = '';
  formStore.personsData.phone = '';
  formStore.personsData.date = '';
  formStore.personsData.country = '';
  formStore.personsData.index = '';
  formStore.personsData.checked = false;
  formStore.personsData.message = '';
  const phoneInput = document.getElementById('phone');
  phoneInput.value = '';
}

const checkFields = () => {
    formStore.state.formValid = formStore.formItems.every(field => {
      return !field.showError;
    })
    formStore.state.formStatus = 'submited';
    if (formStore.state.formValid === true) {
      clearForm();
    }
}

const validateForm = () => {
  formStore.state.formStatus = 'isSubmitting';
  setTimeout(() => {
    checkFields();
  }, 2000);
};

const closeModal = () => {
  formStore.state.formStatus = 'active';
}

</script>

<template>
  <form @submit.prevent="validateForm">
    <fieldset :disabled="formStore.state.formStatus !== 'active'">
    <div v-for="item in formStore.formItems" :key="item.id" :class="['form-item', item.class]">
      <label :for="item.id">{{ item.label }}: </label>
      
      <!-- ФИО, email, дата, индекс -->
      <input
        v-if="item.tag === 'input' && !['checkbox', 'tel'].includes(item.type)"
        :type="item.type"
        :id="item.id"
        v-model="formStore.personsData[item.id]"
        :placeholder="item.placeholder"
        :required="item.required"
        @change="validateItem"
      />
      <MaskInput
      v-if="item.type === 'tel'"
      :type="item.type"
      :id="item.id"
      v-model="formStore.personsData[item.id]"
      :required="item.required"
      :placeholder="item.placeholder"
      :mask="formStore.phoneMask"
      @change="validateItem"
      />
      <textarea
        v-if="item.tag === 'textarea'"
        :id="item.id"
        v-model="formStore.personsData[item.id]"
        :placeholder="item.placeholder"
        @change="validateItem"
      ></textarea>
      <input
        v-if="item.type === 'checkbox'"
        :type="item.type"
        :id="item.id"
        v-model="formStore.personsData[item.id]"
        :required="item.required"
      />
      <select
        v-if="item.tag === 'select'"
        :id="item.id"
        v-model="formStore.personsData[item.id]"
        :required="item.required"
        :placeholder="item.placeholder"
      >
        <option disabled value="">{{ item.placeholder }}</option>
        <option v-for="country in formStore.countries" :key="country" :value="country">
          {{ country }}
        </option>
      </select>
      <div class="errorMessage" v-show="item.showError">{{ item.errorMessage }}</div>
    </div>

    <button type="submit" v-if="formStore.state.formStatus !== 'isSubmitting'" :disabled="formStore.state.formStatus !== 'active'">Отправить</button>
    <img src="./images/1494.gif" class="loader" v-if="formStore.state.formStatus === 'isSubmitting'">
    </fieldset>
  </form>
  
  <div v-if="formStore.state.formStatus === 'submited'" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <p v-if="formStore.state.formValid">Спасибо за отправку формы!</p>
      <p v-if="!formStore.state.formValid">Форма заполнена некорректно.</p>
      <button class="modal-close" @click="closeModal">
        <span v-if="formStore.state.formValid">Закрыть</span>
        <span v-if="!formStore.state.formValid">Повторить</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
fieldset {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  max-width: 260px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  position: relative;
  font-size: 14px;
}

.form-disabled::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  cursor: not-allowed;
  z-index: 1;
}

.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.form-item label {
  margin-bottom: 8px;
  color: #333;
}

.formCheckbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: auto;
  padding: 5px 0;
}

.formCheckbox label {
  margin-bottom: 0;
}

.formCheckbox input[type="checkbox"] {
  width: 20px;
}

.form-item input:not([type="checkbox"]),
.form-item select,
.form-item textarea {
  width: 100%;
  height: 48px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  font-family: inherit;
  font-size: inherit;
}

.form-item input::placeholder,
.form-item textarea::placeholder,
.form-item select:invalid {
  color: #999;
}

.form-item select {
  appearance: none; /* убираем двойную стрелку */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  border: 1px solid #ddd !important;
  outline: none;
}

.form-item select:focus {
  border: 2px solid black !important;
}

.form-item textarea {
  min-height: 100px;
  resize: vertical;
}

button[type="submit"] {
  width: 167px;
  height: 40px;
  background-color: #269999;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Open Sans', sans-serif;
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  align-self: center;
}

button[type="submit"]:hover {
  background-color: #1E8686;
}

button[type="submit"]:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.errorMessage {
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
  min-height: 16px;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  z-index: 2;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 80%;
  text-align: center;
}

.modal-close {
  margin-top: 16px;
  padding: 8px 16px;
  background: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>

 <!--
 + ФИО (обязательное поле, от 2 до 200 символов, только буквы/дефис/пробел).
 + E‑mail (обязательное поле, валидный формат почтового адреса). 
 + Телефон (обязательное поле, ввод по маске: +7 xxx xxx-xx-xx).
 + Дата рождения ( возраст ≥ 18 лет).
 + Страна - выбор из нескольких вариантов для примера (элемент select)
 + Почтовый индекс (6 цифр).
 + Согласие с условиями (обязательное поле, элемент checkbox).
 + Комментарий (до 300 символов).
-  Кнопка «Отправить». Пока отправляется — состояние формы - disabled, показываем пользователю loader.
-  При успехе — экран «Спасибо»; при ошибке — сообщение и кнопка «Повторить». -->