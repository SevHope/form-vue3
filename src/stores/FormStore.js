import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useFormStore = defineStore("form", () => {
    const state = reactive({
        formValid: true,
        formStatus: 'active' //active-все доступно для редактирования, 'isSubmitting' - в процессе валидации, 'submited' - после валидации, форма заблокирована, на экране модалка
    })

const formItems = reactive([
  {id: 'initials', value: '', tag: 'input', class: 'formInput', placeholder: 'Введите ФИО', type: 'text', label: 'ФИО', required: true, minlength: 2, maxlength: 200, restrictions: /^[A-Za-zА-Яа-яёЁ\s-]{2,200}$/, errorMessage: 'ФИО должно быть от 2 до 200 символов и содержать только буквы, пробелы и дефис', showError: false },
  {id: 'email', value: '', tag: 'input', class: 'formInput', placeholder: 'Введите почту', type: 'email', label: 'Почта', required: true, restrictions: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/, errorMessage: 'Введен некорректный email', showError: false },
  {id: 'phone', value: '', tag: 'input', class: 'formInput', placeholder: '+7 (xxx) xxx-xx-xx', type: 'tel', label: 'Телефон', required: true, correctLength: 11, restrictions: /\D/g, errorMessage: 'Укажите телефон в формате +7 xxx xxx-xx-xx', showError: false },
  {id: 'date', value: '', tag: 'input', class: 'formInput', placeholder: 'Введите дату рождения', type: 'date', label: 'Дата рождения', minAge: 18, errorMessage: 'Возраст должен быть больше или равен 18', showError: false },
  {id: 'country', value: '', tag: 'select', class: 'formSelect', placeholder: 'Укажите страну', label: 'Страна', showError: false},
  {id: 'index', value: '', tag: 'input', class: 'formInput', placeholder: 'Введите почтовый индекс', type: 'number', label: 'Почтовый индекс', restrictions: /^\d{6}$/, errorMessage: 'Индекс должен содержать 6 цифр', showError: false },
  {id: 'checked', value: false, tag: 'input', class: 'formCheckbox', type: 'checkbox', label: 'Согласен с условиями', required: true, showError: false},
  {id: 'message', value: '', tag: 'textarea', class: 'formInput', placeholder: 'Введите текст', label: 'Комментарий', maxlength: 300, errorMessage: 'Комментарий может содержать максимум 300 символов', showError: false},
])

const countries = ['Россия', 'Беларусь', 'Казахстан', 'Китай', 'Индия'];
const phoneMask = '+7 (###) ###-##-##';

    return { 
    state,
    formItems,
    countries,
    phoneMask
  };
})