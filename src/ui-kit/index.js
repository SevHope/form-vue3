import UiInput from './components/Input.vue';

const components = { UiInput };

export default {
  install(Vue) {
    for (const name in components) {
      Vue.component(name, components[name]);
    }
  },
};