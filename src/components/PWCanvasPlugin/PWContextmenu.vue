<template>
	<v-menu v-model="opts.show" :position-x="opts.x" :position-y="opts.y" absolute offset-y min-width="200" max-width="300">
		<v-list @contextmenu.stop.prevent rounded>
			<v-list-item-group>
				<v-list-item v-for="(item, idx) in items" :key="idx" @click="onClick(item.cmd)">
					<v-list-item-avatar>
						<v-icon :color="item.color" v-text="item.icon" dark></v-icon>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title>{{ item.text }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-menu>
</template>
<script>
export default {
	name: "PWContextmenu",
	props: {
		opts: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			items: [
				{ icon: "mdi-plus", color: "primary", text: "추가", cmd: "plus" },
				{ icon: "mdi-source-branch-plus", color: "secondary", text: "분기", cmd: "branch" },
				{ icon: "mdi-delete", color: "red", text: "삭제", cmd: "delete" }
			]
		}
	},
	methods: {
		onClick(cmd) {
			this.$emit("click", cmd);
		}
	}
}
</script>