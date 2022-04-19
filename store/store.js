import { defineStore } from 'pinia'

export const useStore = defineStore('global', {
  state: () => ({
    nick: '',
    program: {},
    colorScheme: 'dark',
    isLocal: false,
  }),
  actions: {}
})
