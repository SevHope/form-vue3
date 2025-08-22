<template>
  <div class="ui-input-group">
    <label
      :for="id"
      class="ui-input-label"
    >{{ label }}: </label>
    <input
      v-bind="$attrs"
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      class="ui-input"
      :maxlength="maxlength"
      @input="handleInput"
      @change="handleChange"
    >
    <span
      v-if="error"
      class="ui-input-error"
    >{{ error }}</span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text',
  },
  error: String,
  required: Boolean,
  placeholder: String,
  id: String,
  label: String,
  maxlength: Number,
});

const emit = defineEmits(['update:modelValue', 'change']);

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};

const handleChange = (event) => {
  emit('change', event);
};
</script>

<style scoped>
.ui-input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 260px;
}

.ui-input {
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

.ui-input-label {
  margin-bottom: 8px;
  color: #333;
}

.ui-input::placeholder {
  color: #999;
}

.ui-input-error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
</style>