import { App, Modal } from "obsidian";

export class LinkModal extends Modal {
	link: string;
	width: string;
	height: string;

	constructor(app: App, link: string) {
		super(app);
		this.link = link;
		this.width = '80vw';
		this.height = '80vh';
	}

	onOpen() {
		// Modal Size
		const modalContainer = this.containerEl.lastChild as HTMLElement;
		modalContainer.style.width = this.width;
		modalContainer.style.height = this.height;

		// Iframe Content
		const { contentEl } = this;
		contentEl.addClass("link-modal");

		const frame = contentEl.createEl("iframe");
		frame.src = this.link;
		frame.setAttribute("frameborder", "0");
		frame.style.marginTop = '24px';
		frame.width = "100%";
		frame.height = "95%";
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
