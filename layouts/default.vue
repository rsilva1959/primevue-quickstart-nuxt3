<template>
	<div class="layout-wrapper" :class="containerClass">
		<div>
			<img alt="Vue logo" src="../assets/primevue-logo.png">
            <slot />
		</div>
	</div>
</template>
<script setup>
import {useStore} from '../store/store';
const store = useStore()
const containerClass = () => {
    return [{
        // 'layout-news-active': this.$appState.newsActive,
        // 'p-input-filled': this.$primevue.config.inputStyle === 'filled',
        // 'p-ripple-disabled': this.$primevue.config.ripple === false,
        'layout-wrapper-dark': store.colorScheme, // 'dark', // this.$appState.darkTheme,
        'layout-wrapper-light': store.colorScheme, //'light' // !this.$appState.darkTheme
    }]
}
</script>
<style lang="scss">
@import './assets/styles/app/app.scss';
</style>