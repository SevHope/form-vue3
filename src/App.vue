<script setup>
import { useFormStore } from './stores/FormStore';
import { MaskInput } from 'vue-3-mask';
import { createValidation } from './validation'

const formStore = useFormStore();
const validation = createValidation(formStore);

const clearForm = () => {
  formStore.formItems.initials = '';
  formStore.formItems.email = '';
  formStore.formItems.phone = '';
  formStore.formItems.date = '';
  formStore.formItems.country = '';
  formStore.formItems.index = '';
  formStore.formItems.checked = false;
  formStore.formItems.message = '';
  const phoneInput = document.getElementById('phone');
  phoneInput.value = '';
}

const closeModal = () => {
  formStore.state.formValid ? clearForm() : null;
  formStore.state.formStatus = 'active';
}

</script>

<template>
  <form @submit.prevent="validation.validateForm">
    <fieldset :disabled="formStore.state.formStatus !== 'active'">
      <div
        v-for="item in formStore.formItems"
        :key="item.id"
        :class="['form-item', item.class]"
      >
        <!-- UiInput компоненты ФИО, email, дата и индекс -->
        <UiInput
          v-if="item.tag === 'input' && !['checkbox', 'tel'].includes(item.type)"
          :id="item.id"
          v-model="formStore.formItems[item.id]"
          :type="item.type"
          :placeholder="item.placeholder"
          :required="item.required"
          :error="item.showError ? item.errorMessage : ''"
          :label="item.label"
          :maxlength="item.maxlength"
          @change="validation.validateItem"
        />
        
        <!-- Все остальные компоненты -->
        <template v-else>
          <label :for="item.id">{{ item.label }}: </label>
          <MaskInput
            v-if="item.type === 'tel'"
            :id="item.id"
            v-model="formStore.formItems[item.id]"
            :type="item.type"
            :required="item.required"
            :placeholder="item.placeholder"
            :mask="formStore.phoneMask"
            @change="validation.validateItem"
          />
          
          <textarea
            v-if="item.tag === 'textarea'"
            :id="item.id"
            v-model="formStore.formItems[item.id]"
            :placeholder="item.placeholder"
            :maxlength="item.maxlength"
            @change="validation.validateItem"
          />
          
          <input
            v-if="item.type === 'checkbox'"
            :id="item.id"
            v-model="formStore.formItems[item.id]"
            :type="item.type"
            :required="item.required"
          >
          <select
            v-if="item.tag === 'select'"
            :id="item.id"
            v-model="formStore.formItems[item.id]"
            :required="item.required"
            :placeholder="item.placeholder"
          >
            <option
              disabled
              value=""
            >
              {{ item.placeholder }}
            </option>
            <option
              v-for="country in formStore.countries"
              :key="country"
              :value="country"
            >
              {{ country }}
            </option>
          </select>
          <div
            v-if="item.showError"
            class="errorMessage"
          >
            {{ item.errorMessage }}
          </div>
        </template>
      </div>
      <button
        v-if="formStore.state.formStatus !== 'isSubmitting'"
        type="submit"
        :disabled="formStore.state.formStatus !== 'active'"
      >
        Отправить
      </button>
      <img
        v-if="formStore.state.formStatus === 'isSubmitting'"
        src="./images/1494.gif"
        class="loader"
      >
    </fieldset>
  </form>
  <div
    v-if="formStore.state.formStatus === 'submited'"
    class="modal-overlay"
    @click.self="closeModal"
  >
    <div class="modal-content">
      <p v-if="formStore.state.formValid">
        Спасибо за отправку формы!
      </p>
      <p v-if="!formStore.state.formValid">
        Форма заполнена некорректно.
      </p>
      <button
        class="modal-close"
        @click="closeModal"
      >
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
 + Кнопка «Отправить». Пока отправляется — состояние формы - disabled, показываем пользователю loader.
 + При успехе — экран «Спасибо»; при ошибке — сообщение и кнопка «Повторить». -->