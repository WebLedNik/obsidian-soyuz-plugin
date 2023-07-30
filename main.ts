import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { LinkModal } from "./modal";
const { clipboard } = require('electron');

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon('dice', 'Soyuz Plugin', (evt: MouseEvent) => {});
		ribbonIconEl.addClass('soyuz-plugin-ribbon-class');

		this.addCommand({
			id: 'paraphrasing-selected-text',
			name: 'Перефразирование текста (ReText.AI)',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();
				const href = 'https://retext.ai/ru'
				const modal = new LinkModal(this.app, href)

				modal.open()
				clipboard.writeText(selection);
				new Notice('Текст скопирован в буфер обмена');
			}
		});

		this.addCommand({
			id: 'checking-uniq-selected-text',
			name: 'Антиплагиат, проверка текста на уникальность (eTXT)',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();
				const href = 'https://www.etxt.ru/antiplagiat/'
				const modal = new LinkModal(this.app, href)

				modal.open()
				clipboard.writeText(selection);
				new Notice('Текст скопирован в буфер обмена');
			}
		});

		this.addCommand({
			id: 'correction-selected-text',
			name: 'Корректировка текста (Главред)',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const selection = editor.getSelection();
				const href = 'https://glvrd.ru/'
				const modal = new LinkModal(this.app, href)

				modal.open()
				clipboard.writeText(selection);
				new Notice('Текст скопирован в буфер обмена');
			}
		});

		this.addCommand({
			id: 'book-source-of-literature-save-to-db',
			name: 'Сохранить в базу знаний (Книга)',
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection().trim();
				// @ts-ignore
				const file = this.app.workspace.activeLeaf?.view?.file;
				if (!file) return

				const type = 'Книга'
				this.saveToDB(`\n[${file.basename}](${encodeURIComponent(file.name)}) [${type}]\n${selection}`)
			}
		});

		this.addCommand({
			id: 'electronic-resource-source-of-literature-save-to-db',
			name: 'Сохранить в базу знаний (Электронный ресурс)',
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection().trim();
				// @ts-ignore
				const file = this.app.workspace.activeLeaf?.view?.file;
				if (!file) return

				const type = 'Электронный ресурс'
				this.saveToDB(`\n[${file.basename}](${encodeURIComponent(file.name)}) [${type}]\n${selection}`)
			}
		});

		this.addCommand({
			id: 'article-source-of-literature-save-to-db',
			name: 'Сохранить в базу знаний (Статья)',
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection().trim();
				// @ts-ignore
				const file = this.app.workspace.activeLeaf?.view?.file;
				if (!file) return

				const type = 'Статья'
				this.saveToDB(`\n[${file.basename}](${encodeURIComponent(file.name)}) [${type}]\n${selection}`)
			}
		});

		this.addCommand({
			id: 'document-source-of-literature-save-to-db',
			name: 'Сохранить в базу знаний (Документ)',
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection().trim();
				// @ts-ignore
				const file = this.app.workspace.activeLeaf?.view?.file;
				if (!file) return

				const type = 'Документ'
				this.saveToDB(`\n[${file.basename}](${encodeURIComponent(file.name)}) [${type}]\n${selection}`)
			}
		});

		this.addCommand({
			id: 'scientific-literature-source-of-literature-save-to-db',
			name: 'Сохранить в базу знаний (Научная литература)',
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection().trim();
				// @ts-ignore
				const file = this.app.workspace.activeLeaf?.view?.file;
				if (!file) return

				const type = 'Научная литература'
				this.saveToDB(`\n[${file.basename}](${encodeURIComponent(file.name)}) [${type}]\n${selection}`)
			}
		});
	}

	saveToDB(updatedContent: string) {
		const filename = 'База знаний.md'; // Имя файла и его расширение

		const allFiles = this.app.vault.getMarkdownFiles();
		const targetFile = allFiles.find((file) => file.name === filename);

		if (!targetFile){
			this.app.vault.create(filename, updatedContent).then((success) => {
				new Notice(`Выделенный текст успешно сохранен в "Базу знаний"`);
			}).catch((error) => {
				new Notice(`Не удалось сохранить текст в "Базу знаний"`);
			});

			return
		}

		// Используем API Obsidian для чтения содержимого файла
		this.app.vault.read(targetFile).then((content) => {
			// Если файл существует, обновляем его содержимое
			const updatedFileContent = content + '\n' + updatedContent;
			this.app.vault.modify(targetFile, updatedFileContent).then(() => {
				new Notice(`Выделенный текст успешно сохранен в "Базу знаний"`);
			}).catch((error) => {
				new Notice(`Не удалось сохранить текст в "Базу знаний"`);
			});
		})
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
